import { loadPyodide, PyodideInterface } from "pyodide";
import localforage from "localforage";

import type {
  CatEdit,
  Cat,
  ClanInfo,
  PatrolAction,
  PatrolType,
  PatrolIntro,
  Relationship,
  Condition,
  Event,
} from "./types";

import clangenApiUrl from "./clangen_api.py?url";

class Clangen {
  private _pyodide?: PyodideInterface;
  private _clangenApi: any;
  private _loaded;

  constructor() {
    this._loaded = false;
  }

  private async _syncFS(populate: boolean) {
    return new Promise((resolve) => {
      this._pyodide!.FS.syncfs(populate, (err: Error) => {
        resolve(err);
      });
    });
  }

  public async loadClangen(): Promise<void> {
    if (this._loaded === true) {
      return;
    }

    this._pyodide = await loadPyodide();

    // update this whenever RESOURCES change bc it caches them for better init speed
    const VERSION = "0.11.2";
    const mountDir = "/mnt";
    this._pyodide.FS.mkdirTree(mountDir);
    this._pyodide.FS.mount(this._pyodide.FS.filesystems.IDBFS, {}, mountDir);

    const storedVersion = await localforage.getItem("resourcesLoaded");
    if (storedVersion !== VERSION) {
      // make sure to load saves first so they don't get wiped when syncing back
      await this._syncFS(true);

      console.log("Delete existing resources...");
      this._pyodide.runPython(`
      import shutil
      shutil.rmtree("/mnt/sprites", True)
      shutil.rmtree("/mnt/resources", True)
      `);

      console.log("Loading resources...");
      const zipResources = await fetch("/res.zip");
      const binaryResources = await zipResources.arrayBuffer();
      this._pyodide.unpackArchive(binaryResources, "zip", {
        extractDir: "/mnt",
      });

      await this._syncFS(false);
      await localforage.setItem("resourcesLoaded", VERSION);
    } else {
      console.log("Loading existing resources...");
      await this._syncFS(true);
    }

    // install "clangen-lite"
    await this._pyodide.loadPackage("/clangen_lite-0.0.1-py2.py3-none-any.whl");
    await this._pyodide.runPythonAsync(`
      from pyodide.http import pyfetch
      response = await pyfetch("${clangenApiUrl}")
      with open("clangen_api.py", "wb") as f:
          f.write(await response.bytes())
      `);
    this._clangenApi = this._pyodide.pyimport("clangen_api");

    // load clan
    try {
      // reload because this can get called twice in rare circumstances
      this._clangenApi.reload_clan();
      this._loaded = true;
    } catch (err) {
      console.error(err);
    }
  }

  public async reloadClan() {
    this._clangenApi.reload_clan();
  }

  /**
   * Saves the game.
   */
  public async saveGame(): Promise<void> {
    this._clangenApi.save_game();
    await this._syncFS(false);
  }

  /**
   * Initializes starter cats used in Clan creation.
   *
   * These get added to the cat list, so you should run `refreshCats()`
   * at some point after calling this if you don't run `createClan()`.
   */
  public async initializeStarterCats(): Promise<Cat[]> {
    return this._clangenApi.initialize_starting_cats();
  }

  public async createClan(
    clanName: string,
    leader: string,
    deputy: string,
    medCat: string,
    biome: string,
    camp: string,
    gameMode: string,
    members: string[],
    season: string,
  ): Promise<void> {
    this._clangenApi.create_clan(
      clanName,
      leader,
      deputy,
      medCat,
      biome,
      camp,
      gameMode,
      members,
      season,
    );
    await this.saveGame();
  }

  /**
   * Gets Cat from ID.
   */
  public async getCat(id: string): Promise<Cat> {
    return this._clangenApi.get_cat(id);
  }

  /**
   * Edits cat with ID according to CatEdit object.
   * Also saves the game.
   */
  public async editCat(id: string, edit: CatEdit): Promise<void> {
    this._clangenApi.edit_cat(id, edit);
    await this.saveGame();
  }

  /**
   * Gets notes for cat with ID.
   */
  public async getCatNotes(id: string): Promise<string | undefined> {
    return this._clangenApi.get_cat_notes(id);
  }

  /**
   * Destroys accessory belonging to cat with specified ID.
   * Also saves the game.
   */
  public async destroyAccessory(id: string): Promise<void> {
    this._clangenApi.destroy_accessory(id);
    await this.saveGame();
  }

  /**
   * Exiles cat with specified ID.
   * Also saves the game.
   */
  public async exileCat(id: string): Promise<void> {
    this._clangenApi.exile_cat(id);
    await this.saveGame();
  }

  /**
   * Kills cat with specified ID.
   * Also saves the game.
   */
  public async killCat(
    id: string,
    history: string,
    takeNineLives?: boolean,
  ): Promise<void> {
    this._clangenApi.kill_cat(id, history, takeNineLives);
    await this.saveGame();
  }

  /**
   * Gets every cat in the save.
   */
  public async getCats(): Promise<Cat[]> {
    return this._clangenApi.get_cats();
  }

  /**
   * Gets leader ceremony.
   */
  public async getLeaderCeremony(): Promise<string | undefined> {
    return this._clangenApi.get_leader_ceremony();
  }

  /**
   * Gets potential mates for cat of specified ID.
   *
   * WARNING: This includes CURRENT MATES of the selected cat.
   */
  public async getPotentialMates(id: string): Promise<Cat[]> {
    return this._clangenApi.get_potential_mates(id);
  }

  /**
   * Gets cats who can patrol this moon.
   */
  public async getPatrollableCats(): Promise<Cat[]> {
    return this._clangenApi.get_patrollable_cats();
  }

  /* 
   * Gets cats who were mediated together this moon.
   */
  public async getMediatedPairs(): Promise<[string, string][]> {
    return this._clangenApi.get_mediated_pairs();
  }

  /**
   * Gets cats who can mediate this moon.
   */
  public async getPossibleMediators(): Promise<Cat[]> {
    return this._clangenApi.get_possible_mediators();
  }

  /**
   * Gets cats who can be mediated this moon.
   */
  public async getPossibleMediated(): Promise<Cat[]> {
    return this._clangenApi.get_possible_mediated();
  }

  /**
   * Gets possible mentors for a cat with specified apprentice role.
   */
  public async getPotentialMentors(apprenticeRole: string): Promise<Cat[]> {
    return this._clangenApi.get_potential_mentors(apprenticeRole);
  }

  /**
   * Gets relationships for cat with specified ID.
   */
  public async getRelationships(id: string): Promise<Relationship[]> {
    return this._clangenApi.get_relationships(id);
  }

  /**
   * Gets conditions for cat with specified ID.
   */
  public async getConditions(id: string): Promise<Condition[]> {
    return this._clangenApi.get_conditions(id);
  }

  /**
   * Gets "next" and "previous" cats
   */
  public async getPrevAndNextCats(
    currentCatId: string,
  ): Promise<[string, string]> {
    const prevNext = this._clangenApi.get_prev_and_next_cats(currentCatId);
    return [prevNext[0], prevNext[1]];
  }

  /**
   * Skips one moon. Also saves the game.
   */
  public async moonskip(): Promise<void> {
    this._clangenApi.moonskip();
    await this.saveGame();
  }

  /**
   * Gets this moon's events.
   */
  public async getEvents(): Promise<Event[]> {
    return this._clangenApi.get_events();
  }

  /**
   * Starts a patrol. There can only be one patrol at a time.
   */
  public async startPatrol(
    patrolMembers: string[],
    patrolType: PatrolType,
  ): Promise<PatrolIntro> {
    try {
      return this._clangenApi.start_patrol(patrolMembers, patrolType);
    } catch (exception: any) {
      // have to throw again because the pyodide errors don't work with comlink
      if (exception.type === "CatCantWork") {
        throw Error("A selected cat can't patrol this moon!");
      } else if (exception.type === "KeyError") {
        throw Error("A selected cat doesn't seem to exist!");
      }
      console.error(exception);
      throw Error("Unknown");
    }
  }

  /**
   * Finishes a patrol. There can only be one patrol at a time.
   * Also saves the game.
   *
   * Returns [outcome text, results text].
   */
  public async finishPatrol(
    uuid: string,
    action: PatrolAction,
  ): Promise<[string, string, string | undefined]> {
    try {
      // outcome text, results text
      const p = this._clangenApi.finish_patrol(uuid, action);
      await this.saveGame();
      // for some reason it doesn't work with comlink unless you do this
      return [p[0], p[1], p[2]];
    } catch (exception: any) {
      // have to throw again because the pyodide errors don't work with comlink
      if (exception.type === "KeyError") {
        throw Error("This patrol has already ended!");
      }
      console.error(exception);
      throw Error("Unknown");
    }
  }

  /**
   * Completes a mediation between specified cats by specified mediator.
   * Also saves the game.
   */
  public async mediate(
    mediator: string,
    mediated1: string,
    mediated2: string,
    sabotage = false,
    allowRomantic = false,
  ): Promise<string> {
    try {
      const s = this._clangenApi.mediate(
        mediator,
        mediated1,
        mediated2,
        sabotage,
        allowRomantic,
      );
      await this.saveGame();
      return s;
    } catch (exception: any) {
      if (exception.type === "PairAlreadyMediatedError") {
        throw Error("This pair has already been mediated!");
      } else if (exception.type === "CatCantWork") {
        throw Error("This mediator can't currently work!");
      }
      console.error(exception);
      throw Error("Unknown");
    }
  }

  /**
   * Exports Clan to a binary array that can be imported by `importClan()`.
   */
  public async exportClan(): Promise<ArrayBuffer> {
    return this._clangenApi.export_clan();
  }

  /**
   * Imports binary array of a Clan exported by `exportClan()`.
   */
  public async importClan(saveFile: ArrayBuffer) {
    this._clangenApi.erase_clan();
    this._pyodide!.unpackArchive(saveFile, "zip", {
      extractDir: "/mnt/saves",
    });
    this._syncFS(false);
  }

  /**
   * Gets info about Clan.
   */
  public async getClanInfo(): Promise<ClanInfo | null> {
    const clanInfo = this._clangenApi.get_clan_info();
    if (clanInfo) {
      return clanInfo;
    } else {
      // have to return null or tanstack complains
      return null;
    }
  }

  /**
   * Removes cats that "don't exist".
   */
  public async refreshCats() {
    this._clangenApi.refresh_cats();
  }

  /**
   * Gets current game settings.
   */
  public async getSettings(): Promise<Record<string, boolean>> {
    return this._clangenApi.get_settings();
  }

  /**
   * Sets new game settings.
   */
  public async setSettings(settings: Record<string, boolean>) {
    this._clangenApi.set_settings(settings);
    await this.saveGame();
  }
}

export default Clangen;
