import { PyodideInterface } from "pyodide";

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

import clangenApi from "./clangen_api.py?raw"

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
  /* Gets age of the Clan */
  getClanAge(): Number;
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
  private _pyodide;

  constructor(pyodide: PyodideInterface) {
    this._pyodide = pyodide;
  }

  private async _syncFS(populate: boolean) {
    return new Promise((resolve) => {
      this._pyodide.FS.syncfs(populate, (err: Error) => {
        resolve(err);
      });
    });
  }

  public async loadClangen(): Promise<void> {
    const VERSION = "0.11.2";
    let mountDir = "/mnt";
    this._pyodide.FS.mkdirTree(mountDir);
    this._pyodide.FS.mount(this._pyodide.FS.filesystems.IDBFS, {}, mountDir);

    if (localStorage.getItem("resourcesLoaded") !== VERSION) {
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
      localStorage.setItem("resourcesLoaded", VERSION);
    } else {
      console.log("Loading existing resources...");
      await this._syncFS(true);
    }

    // install "clangen-lite"
    await this._pyodide.loadPackage(
      "/clangen_lite-0.0.1-py2.py3-none-any.whl",
    );

    // load clan
    try {
      this._pyodide.runPython(clangenApi);
      this._pyodide.runPython(`
      clan_list = game.read_clans()
      if clan_list:
          game.switches['clan_list'] = clan_list
          try:
              load_cats()
              version_info = clan_class.load_clan()
              version_convert(version_info)
              game.load_events()
          except Exception as e:
              logger.exception("File failed to load")
              if not game.switches['error_message']:
                  game.switches[
                      'error_message'] = 'There was an error loading the cats file!'
                  game.switches['traceback'] = e
    `);
    } catch (err) {
      console.error(err);
    }
  }

  public async saveGame(): Promise<void> {
    this._pyodide.runPython(`
      save_game()
    `);
    await this._syncFS(false);
  }

  public initializeStarterCats(): Cat[] {
    const cats = this._pyodide.runPython(
      `
      initialize_starting_cats()
      `,
    );
    return cats;
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
    const locals = this._pyodide.toPy({
      clan_name: clanName,
      leader: leader,
      deputy: deputy,
      med_cat: medCat,
      biome: biome,
      camp: camp,
      game_mode: gameMode,
      members: members,
      season: season,
    });
    this._pyodide.runPython(
      `
      create_clan(clan_name, leader, deputy, med_cat, biome, camp, game_mode, members, season)
      `,
      { locals: locals },
    );
    locals.destroy();
    await this.saveGame();
  }

  public getCat(id: string): Cat {
    // is there a better way of doing this?
    const locals = this._pyodide.toPy({ cat_id: id });
    const cat = this._pyodide.runPython(
      `
      get_cat(cat_id)
    `,
      { locals: locals },
    );
    locals.destroy();
    return cat;
  }

  public editCat(id: string, edit: CatEdit): boolean {
    const locals = this._pyodide.toPy({ cat_id: id, edit: edit });
    this._pyodide.runPython(
      `
      edit_cat(cat_id, edit)
      `,
      { locals: locals },
    );
    locals.destroy();

    return true;
  }

  destroyAccessory(id: string): void {
    const locals = this._pyodide.toPy({ cat_id: id });
    this._pyodide.runPython(
      `
      destroy_accessory(cat_id)
    `,
      { locals: locals },
    );
    locals.destroy();
  }

  exileCat(id: string): void {
    const locals = this._pyodide.toPy({ cat_id: id });
    this._pyodide.runPython(
      `
      exile_cat(cat_id)
    `,
      { locals: locals },
    );
    locals.destroy();
  }

  killCat(id: string, history: string, takeNineLives?: boolean): void {
    const locals = this._pyodide.toPy({ cat_id: id, history: history, take_nine_lives: takeNineLives });
    this._pyodide.runPython(
      `
      kill_cat(cat_id, history, take_nine_lives)
    `,
      { locals: locals },
    );
    locals.destroy();
  }

  public getCats(): Cat[] {
    const cats = this._pyodide.runPython(`
      get_cats()
    `);
    return cats;
  }

  public getPotentialMates(id: string): Cat[] {
  /* WARNING: This includes CURRENT MATES of the selected cat. 
              You have to filter them out on the frontend. */

    const locals = this._pyodide.toPy({ cat_id: id});
    const potentialMates = this._pyodide.runPython(`
      get_potential_mates(cat_id)
    `,
      {locals: locals}
    );
    locals.destroy();
    return potentialMates;
  }

  public getPatrollableCats(): Cat[] {
    const cats = this._pyodide.runPython(`
      get_patrollable_cats()
    `);
    return cats;
  }

  public getPossibleMediators(): Cat[] {
    const cats = this._pyodide.runPython(`
      get_possible_mediators()
    `);
    return cats;
  }

  public getPossibleMediated(): Cat[] {
    const cats = this._pyodide.runPython(`
      get_possible_mediated()
    `);
    return cats;
  }

  public getPotentialMentors(apprenticeRole: string): Cat[] {
    const locals = this._pyodide.toPy({ apprentice_role: apprenticeRole});
    const potentialMentors = this._pyodide.runPython(`
      get_potential_mentors(apprentice_role)
    `,
      {locals: locals}
    );
    locals.destroy();
    return potentialMentors;
  }

  public getRelationships(id: string): Relationship[] {
    // is there a better way of doing this?
    const locals = this._pyodide.toPy({ cat_id: id });
    const rels = this._pyodide.runPython(
      `
      get_relationships(cat_id)
    `,
      { locals: locals },
    );
    locals.destroy();
    return rels;
  }

  public getConditions(id: string): Condition[] {
    const locals = this._pyodide.toPy({ cat_id: id });
    const conditions = this._pyodide.runPython(
      `
      get_conditions(cat_id)
    `,
      { locals: locals },
    );
    locals.destroy();
    return conditions;
  }

  public async moonskip(): Promise<void> {
    this._pyodide.runPython(`
      moonskip()
    `);
    await this.saveGame();
  }

  public getEvents(): Event[] {
    const events = this._pyodide.runPython(`
      get_events()
    `);
    return events;
  }

  public startPatrol(patrolMembers: string[], patrolType: PatrolType): PatrolIntro {
    const locals = this._pyodide.toPy({
      patrol_members: patrolMembers,
      patrol_type: patrolType,
    });
    const patrol = this._pyodide.runPython(
      `
      start_patrol(patrol_members, patrol_type)
    `,
      { locals: locals },
    );
    locals.destroy();

    return patrol;
  }

  public finishPatrol(action: PatrolAction): [string, string] {
    const locals = this._pyodide.toPy({
      action: action,
    });
    const outcome = this._pyodide.runPython(
      `
      finish_patrol(action)
    `,
      { locals: locals },
    );
    locals.destroy();

    // outcome text, results text
    return outcome;
  }

  public mediate(mediator: string, mediated1: string, mediated2: string, sabotage = false, allowRomantic = false): string {
    const locals = this._pyodide.toPy({
      mediator: mediator,
      mediated1: mediated1,
      mediated2: mediated2,
      sabotage: sabotage,
      allow_romantic: allowRomantic
    });
    const outcome = this._pyodide.runPython(
      `
      mediate(mediator, mediated1, mediated2, sabotage, allow_romantic)
    `,
      { locals: locals },
    );
    locals.destroy();

    return outcome;
  }

  public getClanAge(): Number {
    const age = this._pyodide.runPython(`
      game.clan.age
    `);
    return age;
  }

  public exportClan(): Int8Array {
    const binaryFile = this._pyodide.runPython(`
      export_clan()
    `);
    return binaryFile;
  }

  public importClan(saveFile: Int8Array) {
    this._pyodide.runPython(`
    erase_clan()
    `);
    this._pyodide.unpackArchive(saveFile, "zip", {
      extractDir: "/mnt/saves",
    });
    this._syncFS(false).then(() => location.reload());
  }

  public getClanInfo(): ClanInfo {
    return this._pyodide.runPython(`
    get_clan_info()
    `);
  }

  public refreshCats() {
    this._pyodide.runPython(`
    refresh_cats()
    `);
  }

  public getSettings(): Record<string, boolean> {
    return this._pyodide.runPython(`
      get_settings()
    `);  
  }

  public setSettings(settings: Record<string, boolean>) {
    const locals = this._pyodide.toPy({ settings: settings });
    this._pyodide.runPython(
      `
      set_settings(settings)
      `,
      { locals: locals },
    );
    locals.destroy();
  }
}

export default Clangen;