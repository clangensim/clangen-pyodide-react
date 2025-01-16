import { PyodideInterface } from "pyodide";
import pyodide from "./pyodide";

type Pelt = {
  name: string;
  colour: string;
  skin: string;
  pattern: string | undefined;
  tortieBase: string | undefined;
  tortiePattern: string | undefined;
  tortieColour: string | undefined;
  spritesName: string;
  whitePatches: string | undefined;
  points: string | undefined;
  vitiligo: string | undefined;
  eyeColour: string;
  eyeColour2: string | undefined;
  scars: Array<string> | undefined;
  tint: string;
  whitePatchesTint: string;
  accessory: string | undefined;
  catSprites: Record<string, number>;
};

type Name = {
  prefix: string;
  suffix: string;
  display: string;
};

type Severity = "major" | "minor";
type ConditionType = "injury" | "condition" | "illness";

type Condition = {
  name: string;
  type: ConditionType;
  moonStart: number;
  moonsWith: number;
  severity: Severity;
  infectious: boolean;
};

type Cat = {
  ID: string;
  name: Name;
  moons: number;
  gender: string;
  trait: string;
  status: string;
  pelt: Pelt;
  age: string;
  outside: boolean;
  dead: boolean;
};

type Relationship = {
  cat_to_id: string;
  cat_from_id: string;
  cat_to: Cat;
  mates: boolean;
  family: boolean;
  romantic_love: Number;
  platonic_like: Number;
  dislike: Number;
  admiration: Number;
  comfortable: Number;
  jealousy: Number;
  trust: Number;
};

type Event = {
  text: string;
  types: Array<string>;
  cats_involved: Array<string>;
};

type CatEdit = {
  status: string;
  prefix: string;
  suffix: string;
};

type PatrolType = "hunting" | "border" | "training" | "med";
type PatrolAction = "proceed" | "antag" | "decline";

interface ClangenInterface {
  getCat(id: string): Cat;
  editCat(id: string, edit: CatEdit): boolean;
  saveGame(): void;
  moonskip(): void;
  initializeStarterCats(): Cat[];
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
  startPatrol(patrolMembers: string[], patrolType: PatrolType): string;
  finishPatrol(action: PatrolAction): [string, string];
  getEvents(): Event[];
  getCats(): Cat[];
  getPatrollableCats(): Cat[];
  getClanAge(): Number;
  getConditions(id: string): Condition[];
  getRelationships(id: string): Relationship[];
  exportClan(): Int8Array;
  importClan(saveFile: Int8Array): void;
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
    let mountDir = "/mnt";
    this._pyodide.FS.mkdirTree(mountDir);
    this._pyodide.FS.mount(pyodide.FS.filesystems.IDBFS, {}, mountDir);

    if (localStorage.getItem("resourcesLoaded") === null) {
      console.log("Loading resources...");
      // load resources
      let zipResources = await fetch("/bin/resources.zip");
      let binaryResources = await zipResources.arrayBuffer();
      this._pyodide.unpackArchive(binaryResources, "zip", {
        extractDir: "/mnt",
      });

      // load "sprites" (actually just tints)
      let zipSprites = await fetch("/bin/sprites.zip");
      let binarySprites = await zipSprites.arrayBuffer();
      this._pyodide.unpackArchive(binarySprites, "zip", { extractDir: "/mnt" });

      // loag DEBUG SAVE
      let zipSaves = await fetch("/bin/saves-no-folder.zip");
      let binarySaves = await zipSaves.arrayBuffer();
      this._pyodide.unpackArchive(binarySaves, "zip", {
        extractDir: "/mnt/saves",
      });

      await this._syncFS(false);
      localStorage.setItem("resourcesLoaded", "true");
    } else {
      console.log("Loading existing resources...");
      await this._syncFS(true);
    }

    // install "clangen-lite"
    await this._pyodide.loadPackage(
      "/bin/clangen_lite-0.0.1-py2.py3-none-any.whl",
    );

    // load clan
    try {
      this._pyodide.runPython(`
      import os
      os.chdir("/mnt")

      from pyodide.ffi import to_js
      import js

      from scripts.game_structure.load_cat import load_cats, version_convert
      from scripts.game_structure.game_essentials import game
      from scripts.cat.cats import Cat, create_example_cats
      from scripts.patrol.patrol import Patrol
      from scripts.clan import Clan
      from scripts.events import events_class
      from scripts.clan import clan_class
      from scripts.utility import quit as clangen_quit

      def cat_to_dict(cat):
          return {
              'ID': cat.ID,
              'name': {
                  'prefix': cat.name.prefix,
                  'suffix': cat.name.suffix,
                  'display': str(cat.name)
              },
              'age': cat.age,
              'moons': cat.moons,
              'gender': cat.genderalign,
              'status': cat.status,
              'outside': cat.outside,
              'dead': cat.dead,
              'trait': cat.personality.trait,
              'pelt': {
                  'name': cat.pelt.name,
                  'colour': cat.pelt.colour,
                  'skin': cat.pelt.skin,
                  'pattern': cat.pelt.pattern,
                  'tortieBase': cat.pelt.tortiebase,
                  'tortiePattern': cat.pelt.tortiepattern,
                  'tortieColour': cat.pelt.tortiecolour,
                  'spritesName': cat.pelt.get_sprites_name(),
                  'whitePatches': cat.pelt.white_patches,
                  'points': cat.pelt.points,
                  'vitiligo': cat.pelt.vitiligo,
                  'eyeColour': cat.pelt.eye_colour,
                  'eyeColour2': cat.pelt.eye_colour2,
                  'scars': cat.pelt.scars,
                  'tint': cat.pelt.tint,
                  'whitePatchesTint': cat.pelt.white_patches_tint,
                  'accessory': cat.pelt.accessory,
                  'catSprites': cat.pelt.cat_sprites
              }
          }

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
      game.save_cats()
      game.clan.save_clan()
      game.clan.save_pregnancy(game.clan)
      game.save_events()
    `);
    await this._syncFS(false);
  }

  public initializeStarterCats(): Cat[] {
    const cats = this._pyodide.runPython(
      `
    cats = []
    create_example_cats()
    for _, cat in game.choose_cats.items():
      cats.append(cat_to_dict(cat))
    to_js(cats, dict_converter=js.Object.fromEntries)
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
    const locals = pyodide.toPy({
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
      game.mediated.clear()
      game.patrolled.clear()
      game.cat_to_fade.clear()
      Cat.outside_cats.clear()
      Patrol.used_patrols.clear()
      game.clan = Clan(
        clan_name,
        Cat.all_cats[leader],
        Cat.all_cats[deputy],
        Cat.all_cats[med_cat],
        biome,
        camp,
        game_mode,
        list(map(lambda cat_id : Cat.all_cats[cat_id], members)),
        season
      )
      game.clan.create_clan()
      #game.clan.starclan_cats.clear()
      game.cur_events_list.clear()
      game.herb_events_list.clear()
      Cat.grief_strings.clear()
      Cat.sort_cats()
      `,
      { locals: locals },
    );
    locals.destroy();
    await this.saveGame();
  }

  public getCat(id: string): Cat {
    // is there a better way of doing this?
    const locals = pyodide.toPy({ cat_id: id });
    const cat = this._pyodide.runPython(
      `
      cat = Cat.all_cats[cat_id]
      to_js(cat_to_dict(cat), dict_converter=js.Object.fromEntries)
    `,
      { locals: locals },
    );
    locals.destroy();
    return cat;
  }

  public editCat(id: string, edit: CatEdit): boolean {
    const locals = pyodide.toPy({ cat_id: id, edit: edit });
    this._pyodide.runPython(
      `
      cat = Cat.all_cats[cat_id]
      if cat.status != edit["status"]:
        if edit["status"] == "leader":
          # if they're deputy, remove them from deputy
          if game.clan.deputy and cat.ID == game.clan.deputy.ID:
            game.clan.deputy = None
          # demote current leader
          if game.clan.leader:
            game.clan.leader.status_change("warrior", resort=True)
          game.clan.new_leader(cat)
          Cat.sort_cats()
        elif edit["status"] == "deputy":
          # demote current deputy 
          if game.clan.deputy:
            game.clan.deputy.status_change("warrior")
          game.clan.deputy = cat
          cat.status_change("deputy", resort=True)
        else:
          cat.status_change(edit["status"], resort=True)
      if "prefix" in edit and edit["prefix"] != cat.name.prefix:
        cat.name.prefix = edit["prefix"]
      if "suffix" in edit and edit["suffix"] != cat.name.suffix:
        cat.name.suffix = edit["suffix"]
    `,
      { locals: locals },
    );
    locals.destroy();

    return true;
  }

  public getCats(): Cat[] {
    const cats = this._pyodide.runPython(`
      cats = []
      for cat in Cat.all_cats_list:
        cats.append(cat_to_dict(cat))
      to_js(cats, dict_converter=js.Object.fromEntries)
    `);
    return cats;
  }

  public getPatrollableCats(): Cat[] {
    const cats = this._pyodide.runPython(`
      cats = []
      for the_cat in Cat.all_cats_list:
        if not the_cat.dead and the_cat.ID not in game.patrolled and the_cat.status not in [
                'elder', 'kitten', 'mediator', 'mediator apprentice'
            ] and not the_cat.outside and not the_cat.not_working():
          
          cats.append(cat_to_dict(the_cat))
      to_js(cats, dict_converter=js.Object.fromEntries)
    `);
    return cats;
  }

  public getRelationships(id: string): Relationship[] {
    // is there a better way of doing this?
    const locals = pyodide.toPy({ cat_id: id });
    const rels = this._pyodide.runPython(
      `
      rels = []
      cat = Cat.all_cats[cat_id]
      cat_rels = rel = sorted(cat.relationships.values(),
                             key=lambda x: sum(map(abs, [x.romantic_love, x.platonic_like, x.dislike,
                             x.admiration, x.comfortable, x.jealousy, x.trust])),
                             reverse=True)
      for rel in cat_rels:
        rels.append({
          'cat_to_id': rel.cat_to.ID,
          'cat_to': cat_to_dict(Cat.all_cats[rel.cat_to.ID]),
          'cat_from_id': cat_id,
          'mates': rel.mates,
          'family': rel.family,
          'romantic_love': rel.romantic_love,
          'platonic_like': rel.platonic_like,
          'dislike': rel.dislike,
          'admiration': rel.admiration,
          'comfortable': rel.comfortable,
          'jealousy': rel.jealousy,
          'trust': rel.trust
        })
      to_js(rels, dict_converter=js.Object.fromEntries)
    `,
      { locals: locals },
    );
    locals.destroy();
    return rels;
  }

  public getConditions(id: string): Condition[] {
    const locals = pyodide.toPy({ cat_id: id });
    const conditions = this._pyodide.runPython(
      `
      conditions = []
      cat = Cat.all_cats[cat_id]
      

      for name, condition in cat.permanent_condition.items():
        conditions.append({
          "type": "condition",
          "name": name,
          "moonStart": condition["moon_start"],
          "moonsWith": game.clan.age - condition["moon_start"],
          "severity": condition["severity"],
          "infectious": condition.get("infectiousness", 0) != 0
        })
      for name, condition in cat.illnesses.items():
        conditions.append({
          "type": "illness",
          "name": name,
          "moonStart": condition["moon_start"],
          "moonsWith": game.clan.age - condition["moon_start"],
          "severity": condition["severity"],
          "infectious": condition.get("infectiousness", 0) != 0
        })
      for name, condition in cat.injuries.items():
        conditions.append({
          "type": "injury",
          "name": name,
          "moonStart": condition["moon_start"],
          "moonsWith": game.clan.age - condition["moon_start"],
          "severity": condition["severity"],
          "infectious": condition.get("infectiousness", 0) != 0
        })
      to_js(conditions, dict_converter=js.Object.fromEntries)
    `,
      { locals: locals },
    );
    locals.destroy();
    console.log(conditions);
    return conditions;
  }

  public async moonskip(): Promise<void> {
    this._pyodide.runPython(`
      events_class.one_moon()
    `);
    await this.saveGame();
  }

  public getEvents(): Event[] {
    const events = this._pyodide.runPython(`
      to_js([vars(event) for event in game.cur_events_list], dict_converter=js.Object.fromEntries)
    `);
    return events;
  }

  public startPatrol(patrolMembers: string[], patrolType: PatrolType): string {
    const locals = pyodide.toPy({
      patrol_members: patrolMembers,
      patrol_type: patrolType,
    });
    const introText = this._pyodide.runPython(
      `
      patrol_members_obj = list(map(lambda cat_id : Cat.all_cats[cat_id], patrol_members))
      global current_patrol
      current_patrol = Patrol()
      current_patrol.setup_patrol(patrol_members_obj, patrol_type)
    `,
      { locals: locals },
    );
    locals.destroy();

    return introText;
  }

  public finishPatrol(action: PatrolAction): [string, string] {
    const locals = pyodide.toPy({
      action: action,
    });
    const outcome = this._pyodide.runPython(
      `
      global current_patrol
      outcome = current_patrol.proceed_patrol(action)
      current_patrol = None
      outcome
    `,
      { locals: locals },
    );
    locals.destroy();

    // outcome text, results text
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
      import shutil
      shutil.make_archive("/exported", "zip", "saves")

      with open("/exported.zip", "rb") as f:
        binary = f.read()
      to_js(binary)
    `);
    return binaryFile;
  }

  public importClan(saveFile: Int8Array) {
    this._pyodide.runPython(`
    import shutil
    shutil.rmtree("/mnt/saves")
    `);
    this._pyodide.unpackArchive(saveFile, "zip", {
      extractDir: "/mnt/saves",
    });
    this._syncFS(false).then(() => location.reload());
  }
}

const clangenRunner = new Clangen(pyodide);
await clangenRunner.loadClangen();

export { clangenRunner };
export type {
  Cat,
  PatrolAction,
  PatrolType,
  Pelt,
  Relationship,
  Condition,
  Event,
};
