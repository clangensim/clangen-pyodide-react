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

interface ClangenInterface {
  /* Gets Cat from ID */
  getCat(id: string): Cat;
  /* Edits cat with ID according to CatEdit object */
  editCat(id: string, edit: CatEdit): boolean;
  /* Saves game */
  saveGame(): void;
  /* Skips a moon */
  moonskip(): void;
  /* Initializes starter cats used in Clan creation.
     These get added to the cat list, so you should run refreshCats()
     at some point after calling this if you don't run createClan().
  */
  initializeStarterCats(): Cat[];
  /* Creates a new Clan as specified. */
  createClan(
    clanName: string,
    leader: string,
    deputy: string,
    medCat: string,
    biome: string,
    camp: string,
    gameMode: string,
    members: string[],
    season: string,
  ): void;
  /* Starts a patrol. There can only be one patrol at a time. */
  startPatrol(patrolMembers: string[], patrolType: PatrolType): PatrolIntro;
  /* Finishes a patrol started by startPatrol() and returns 
     [outcome text, result text]. 
     Result text represents what happened in concrete terms.
     Outcome text is the writing to go with the intro text. */
  finishPatrol(action: PatrolAction): [string, string];
  /* Gets events for this moon */
  getEvents(): Event[];
  /* Gets cats from all_cat_list */
  getCats(): Cat[];
  /* Gets cats that can patrol */
  getPatrollableCats(): Cat[];
  /* Gets condiions of cat with given ID */
  getConditions(id: string): Condition[];
  /* Gets relationships of cat with given ID */
  getRelationships(id: string): Relationship[];
  /* Exports save to binary array */
  exportClan(): Int8Array;
  /* Imports save exported by exportClan() */
  importClan(saveFile: Int8Array): void;
  /* Removes cats that aren't in clan_cats.
     Mainly, this is cats added in Clan creation. */
  refreshCats(): void;
  destroyAccessory(id: string): void;
  killCat(id: string, history: string, takeNineLives?: boolean): void;
  exileCat(id: string): void;
}

class Clangen implements ClangenInterface {
  private _pyodide?: PyodideInterface;
  private _clangenApi: any;

  private async _syncFS(populate: boolean) {
    return new Promise((resolve) => {
      this._pyodide!.FS.syncfs(populate, (err: Error) => {
        resolve(err);
      });
    });
  }

  public async loadClangen(): Promise<void> {
    this._pyodide = await loadPyodide();

    const VERSION = "0.11.2";
    let mountDir = "/mnt";
    this._pyodide.FS.mkdirTree(mountDir);
    this._pyodide.FS.mount(this._pyodide.FS.filesystems.IDBFS, {}, mountDir);

    const storedVersion = await localforage.getItem("resourcesLoaded");
    if (storedVersion !== VERSION) {
      console.log("Loading resources...");
      // load resources
      let zipResources = await fetch("/res.zip");
      let binaryResources = await zipResources.arrayBuffer();
      this._pyodide.unpackArchive(binaryResources, "zip", {
        extractDir: "/mnt",
      });

      // loag DEBUG SAVE
      let zipSaves = await fetch("/saves-no-folder.zip");
      let binarySaves = await zipSaves.arrayBuffer();
      this._pyodide.unpackArchive(binarySaves, "zip", {
        extractDir: "/mnt/saves",
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
      this._clangenApi.load_clan();
    } catch (err) {
      console.error(err);
    }
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
  public initializeStarterCats(): Cat[] {
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
  public getCat(id: string): Cat {
    return this._clangenApi.get_cat(id);
  }

  /**
   * Edits cat with ID according to CatEdit object.
   */
  public editCat(id: string, edit: CatEdit): boolean {
    this._clangenApi.edit_cat(id, edit);
    return true;
  }

  /**
   * Destroys accessory belonging to cat with specified ID.
   */
  destroyAccessory(id: string): void {
    this._clangenApi.destroy_accessory(id);
  }

  /**
   * Exiles cat with specified ID.
   */
  exileCat(id: string): void {
    this._clangenApi.exile_cat(id);
  }

  /**
   * Kills cat with specified ID.
   */
  killCat(id: string, history: string, takeNineLives?: boolean): void {
    this._clangenApi.kill_cat(id, history, takeNineLives);
  }

  /**
   * Gets every cat in the save.
   */
  public getCats(): Cat[] {
    return this._clangenApi.get_cats();
  }

  /**
   * Gets potential mates for cat of specified ID.
   * 
   * WARNING: This includes CURRENT MATES of the selected cat.
   */
  public getPotentialMates(id: string): Cat[] {
    return this._clangenApi.get_potential_mates(id);
  }

  /**
   * Gets cats who can patrol this moon.
   */
  public getPatrollableCats(): Cat[] {
    return this._clangenApi.get_patrollable_cats();
  }

  /**
   * Gets cats who can mediate this moon.
   */
  public getPossibleMediators(): Cat[] {
    return this._clangenApi.get_possible_mediators();
  }

  /**
   * Gets cats who can be mediated this moon.
   */
  public getPossibleMediated(): Cat[] {
    return this._clangenApi.get_possible_mediated();
  }

  /**
   * Gets possible mentors for a cat with specified apprentice role.
   */
  public getPotentialMentors(apprenticeRole: string): Cat[] {
    return this._clangenApi.get_potential_mentors(apprenticeRole);
  }

  /**
   * Gets relationships for cat with specified ID.
   */
  public getRelationships(id: string): Relationship[] {
    return this._clangenApi.get_relationships(id);
  }

  /**
   * Gets conditions for cat with specified ID.
   */
  public getConditions(id: string): Condition[] {
    return this._clangenApi.get_conditions(id);
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
  public getEvents(): Event[] {
    return this._clangenApi.get_events();
  }

  /**
   * Starts a patrol. There can only be one patrol at a time.
   */
  public startPatrol(
    patrolMembers: string[],
    patrolType: PatrolType,
  ): PatrolIntro {
    return this._clangenApi.start_patrol(patrolMembers, patrolType);
  }

  /**
   * Finishes a patrol. There can only be one patrol at a time.
   * 
   * Returns [outcome text, results text].
   */
  public finishPatrol(action: PatrolAction): [string, string] {
    // outcome text, results text
    return this._clangenApi.finish_patrol(action);
  }

  /**
   * Completes a mediation between specified cats by specified mediator.
   */
  public mediate(
    mediator: string,
    mediated1: string,
    mediated2: string,
    sabotage = false,
    allowRomantic = false,
  ): string {
    return this._clangenApi.mediate(
      mediator,
      mediated1,
      mediated2,
      sabotage,
      allowRomantic,
    );
  }

  /**
   * Exports Clan to a binary array that can be imported by `importClan()`.
   */
  public exportClan(): Int8Array {
    return this._clangenApi.export_clan();
  }

  /**
   * Imports binary array of a Clan exported by `exportClan()`.
   */
  public importClan(saveFile: Int8Array) {
    this._clangenApi.erase_clan();
    this._pyodide!.unpackArchive(saveFile, "zip", {
      extractDir: "/mnt/saves",
    });
    this._syncFS(false).then(() => location.reload());
  }

  /**
   * Gets info about Clan.
   */
  public getClanInfo(): ClanInfo {
    return this._clangenApi.get_clan_info();
  }

  /**
   * Completes a mediation between specified cats by specified mediator.
   */
  public refreshCats() {
    this._clangenApi.refresh_cats();
  }

  /**
   * Gets current game settings.
   */
  public getSettings(): Record<string, boolean> {
    return this._clangenApi.get_settings();
  }

  /**
   * Sets new game settings.
   */
  public setSettings(settings: Record<string, boolean>) {
    this._clangenApi.set_settings(settings);
  }
}

export default Clangen;
