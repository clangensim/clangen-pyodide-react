import { PyodideInterface } from "pyodide";
import pyodide from "./pyodide";

type ClanInfo = {
  name: string;
  age: number;
  gameMode: string;
  season: string;
  freshkill?: number;
  requiredFreshkill?: number;
}

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
  reverse: boolean;
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
  skillString: string;
  status: string;
  pelt: Pelt;
  age: string;
  outside: boolean;
  experienceLevel: string;
  thought: string;
  /* this is the display text of the backstory */
  backstory: string;
  dead: boolean;
  inDarkForest: boolean;
  /* TODO: fix these types
     The following fields are only Cats for the first "layer".
     After that, they're strings. */
  mentor: Cat | undefined;
  apprentices: Cat[];
  formerApprentices: Cat[];
  parent1: Cat | undefined;
  parent2: Cat | undefined;
  mates: Cat[];
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
  mentor?: string;
  mates?: string[];
};

type PatrolType = "hunting" | "border" | "training" | "med";
type PatrolAction = "proceed" | "antag" | "decline";
type PatrolIntro = {
  text: string;
  canAntagonize: boolean;
}

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
    this._pyodide.FS.mount(pyodide.FS.filesystems.IDBFS, {}, mountDir);

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
      this._pyodide.runPython(`
      import os
      os.chdir("/mnt")

      from pyodide.ffi import to_js
      import js

      from scripts.game_structure.load_cat import load_cats, version_convert
      from scripts.game_structure.game_essentials import game
      from scripts.cat.cats import Cat, create_example_cats, BACKSTORIES
      from scripts.cat.history import History
      from scripts.patrol.patrol import Patrol
      from scripts.clan import Clan
      from scripts.events import events_class
      from scripts.clan import clan_class
      from scripts.utility import quit as clangen_quit

      def cat_to_dict(cat, depth=1):
          def id_list_to_dict_list(lst):
              return list(map(lambda cat_id : cat_to_dict(Cat.all_cats[cat_id], 0), lst))

          if cat is None:
              return None

          if cat.status in ['kittypet', 'loner', 'rogue', 'former Clancat']:
              backstory = cat.status
          elif cat.backstory:
              for category in BACKSTORIES["backstory_categories"]:
                  if cat.backstory in BACKSTORIES["backstory_categories"][category]:
                      backstory = BACKSTORIES["backstory_display"][category]
                      break
          else:
              backstory = 'Clanborn'

          if depth <= 0:
              former_apprentices = cat.former_apprentices
              mates = cat.mate
              apprentices = cat.apprentice
              parent1 = cat.parent1
              parent2 = cat.parent2
              mentor = cat.mentor
          else:
              former_apprentices = id_list_to_dict_list(cat.former_apprentices)
              mates = id_list_to_dict_list(cat.mate)
              apprentices = id_list_to_dict_list(cat.apprentice)
              parent1 = cat_to_dict(Cat.fetch_cat(cat.parent1), 0)
              parent2 = cat_to_dict(Cat.fetch_cat(cat.parent2), 0)
              mentor = cat_to_dict(Cat.fetch_cat(cat.mentor), 0)

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
              'backstory': backstory,
              'dead': cat.dead,
              'inDarkForest': cat.df,
              'trait': cat.personality.trait,
              'skillString': cat.skills.skill_string(),
              'mentor': mentor,
              'apprentices': apprentices,
              'formerApprentices': former_apprentices,
              'parent1': parent1,
              'parent2': parent2,
              'mates': mates,
              'experienceLevel': cat.experience_level,
              'thought': cat.thought,
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
                  'catSprites': cat.pelt.cat_sprites,
                  'reverse': cat.pelt.reverse
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
      import shutil
      shutil.rmtree("/mnt/saves")

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

      if "mentor" in edit:
        new_mentor = Cat.fetch_cat(edit["mentor"])
        old_mentor = Cat.fetch_cat(cat.mentor)
        if old_mentor:
          old_mentor.apprentice.remove(cat.ID)
          if cat.moons > 6 and cat.ID not in old_mentor.former_apprentices:
            old_mentor.former_apprentices.append(cat.ID)
        if new_mentor:
          cat.patrol_with_mentor = 0
          cat.mentor = new_mentor.ID
          new_mentor.apprentice.append(cat.ID)
          if cat.ID in new_mentor.former_apprentices:
            new_mentor.former_apprentices.remove(cat.ID)
        else:
          cat.mentor = None

      if "mates" in edit:
        for mateID in edit["mates"]:
          if mateID not in cat.mate:
            cat.set_mate(Cat.fetch_cat(mateID))

        for mateID in cat.mate:
          if mateID not in edit["mates"]:
            cat.unset_mate(Cat.fetch_cat(mateID))
    `,
      { locals: locals },
    );
    locals.destroy();

    return true;
  }

  destroyAccessory(id: string): void {
    const locals = pyodide.toPy({ cat_id: id });
    this._pyodide.runPython(
      `
      cat = Cat.all_cats[cat_id]
      cat.pelt.accessory = None
    `,
      { locals: locals },
    );
    locals.destroy();
  }

  exileCat(id: string): void {
    const locals = pyodide.toPy({ cat_id: id });
    this._pyodide.runPython(
      `
      cat = Cat.all_cats[cat_id]
      cat.exile()
    `,
      { locals: locals },
    );
    locals.destroy();
  }

  killCat(id: string, history: string, takeNineLives?: boolean): void {
    const locals = pyodide.toPy({ cat_id: id, history: history, take_nine_lives: takeNineLives });
    this._pyodide.runPython(
      `
      cat = Cat.all_cats[cat_id]
      if (cat.status == "leader"):
        if take_nine_lives:
          game.clan.leader_lives = 0
        else:
          game.clan.leader_lives -= 1

        history = "{VERB/m_c/were/was} " + history
      else:
        history = "This cat {VERB/m_c/were/was} " + history
      cat.die()
      History.add_death(cat, history)
    `,
      { locals: locals },
    );
    locals.destroy();
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

  public getPotentialMates(id: string): Cat[] {
  /* WARNING: This includes CURRENT MATES of the selected cat. 
              You have to filter them out on the frontend. */

    const locals = pyodide.toPy({ cat_id: id});
    const potentialMates = this._pyodide.runPython(`
      valid_mates = []

      single_only = False
      have_kits_only = False

      cat = Cat.all_cats[cat_id]

      valid_mates = [cat_to_dict(i, 0) for i in Cat.all_cats_list if
                      not i.faded
                      and cat.is_potential_mate(
                          i, for_love_interest=False,
                          age_restriction=False, ignore_no_mates=True)
                      and (not single_only or not i.mate)
                      and (not have_kits_only 
                          or game.clan.clan_settings["same sex birth"]
                          or i.gender != cat.gender)]

      to_js(valid_mates, dict_converter=js.Object.fromEntries)
    `,
      {locals: locals}
    );
    locals.destroy();
    return potentialMates;
  }

  public getPatrollableCats(): Cat[] {
    const cats = this._pyodide.runPython(`
      cats = []
      for the_cat in Cat.all_cats_list:
        if not the_cat.dead and the_cat.ID not in game.patrolled and the_cat.status not in [
                'newborn', 'elder', 'kitten', 'mediator', 'mediator apprentice'
            ] and not the_cat.outside and not the_cat.not_working():
          
          cats.append(cat_to_dict(the_cat))
      to_js(cats, dict_converter=js.Object.fromEntries)
    `);
    return cats;
  }

  public getPossibleMediators(): Cat[] {
    const cats = this._pyodide.runPython(`
      cats = []
      for the_cat in Cat.all_cats_list:
        if not the_cat.dead and the_cat.ID not in game.patrolled and the_cat.status in [
              'mediator', 'mediator apprentice'
            ] and not the_cat.outside and not the_cat.not_working():
          cats.append(cat_to_dict(the_cat))
      to_js(cats, dict_converter=js.Object.fromEntries)
    `);
    return cats;
  }

  public getPossibleMediated(): Cat[] {
    const cats = this._pyodide.runPython(`
      cats = []
      for the_cat in Cat.all_cats_list:
        if the_cat.outside or the_cat.dead:
          continue
        mediated = False
        for cat1, cat2 in game.mediated:
          if the_cat.ID == cat1 or the_cat.ID == cat2:
            mediated = True
        if not mediated:
          cats.append(cat_to_dict(the_cat))
      to_js(cats, dict_converter=js.Object.fromEntries)
    `);
    return cats;
  }

  public getPotentialMentors(apprenticeRole: string): Cat[] {
    const locals = pyodide.toPy({ apprentice_role: apprenticeRole});
    const potentialMentors = this._pyodide.runPython(`
      potential_mentors =[]

      for cat in Cat.all_cats_list:
        if not cat.dead and not cat.outside:
          if cat.status in ["warrior", "leader", "deputy"] and apprentice_role == "apprentice":
            potential_mentors.append(cat_to_dict(cat))
          elif cat.status == "medicine cat" and apprentice_role == "medicine cat apprentice":
            potential_mentors.append(cat_to_dict(cat))
          elif cat.status == "mediator" and apprentice_role == "mediator apprentice":
            potential_mentors.append(cat_to_dict(cat))
      to_js(potential_mentors, dict_converter=js.Object.fromEntries)
    `,
      {locals: locals}
    );
    locals.destroy();
    return potentialMentors;
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

  public startPatrol(patrolMembers: string[], patrolType: PatrolType): PatrolIntro {
    const locals = pyodide.toPy({
      patrol_members: patrolMembers,
      patrol_type: patrolType,
    });
    const patrol = this._pyodide.runPython(
      `
      patrol_members_obj = list(map(lambda cat_id : Cat.all_cats[cat_id], patrol_members))
      for cat in patrol_members_obj:
        if cat.status == "medicine cat" or cat.status == "medicine cat apprentice":
          patrol_type = "med"
      global current_patrol
      current_patrol = Patrol()

      p = {
        "text": current_patrol.setup_patrol(patrol_members_obj, patrol_type),
        "canAntagonize": len(current_patrol.patrol_event.antag_success_outcomes) > 0
      }
      to_js(p, dict_converter=js.Object.fromEntries)
    `,
      { locals: locals },
    );
    locals.destroy();

    return patrol;
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

  public mediate(mediator: string, mediated1: string, mediated2: string, sabotage = false, allowRomantic = false): string {
    const locals = pyodide.toPy({
      mediator: mediator,
      mediated1: mediated1,
      mediated2: mediated2,
      sabotage: sabotage,
      allow_romantic: allowRomantic
    });
    const outcome = this._pyodide.runPython(
      `
      game.mediated.append([mediated1, mediated2])
      game.patrolled.append(mediator)
      Cat.mediate_relationship(Cat.all_cats[mediator], 
        Cat.all_cats[mediated1], Cat.all_cats[mediated2],
        allow_romantic=allow_romantic,
        sabotage=sabotage)
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
      game.save_cats()
      game.clan.save_clan()
      game.clan.save_pregnancy(game.clan)
      game.save_events()

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

  public getClanInfo(): ClanInfo {
    return this._pyodide.runPython(`
    clan_info = {
      "name": game.clan.name + "Clan",
      "age": game.clan.age,
      "gameMode": game.clan.game_mode,
      "season": game.clan.current_season
    }
    if game.clan.game_mode != "classic":
      clan_info["freshkill"] = round(game.clan.freshkill_pile.total_amount, 2)
      clan_info["requiredFreshkill"] = round(game.clan.freshkill_pile.amount_food_needed(), 2)
    to_js(clan_info, dict_converter=js.Object.fromEntries)
    `);
  }

  public refreshCats() {
    this._pyodide.runPython(`
    if game.clan is not None:
      key_copy = tuple(Cat.all_cats.keys())
      for x in key_copy:
        if x not in game.clan.clan_cats:
          game.clan.remove_cat(x)
    `);
  }

  public getSettings(): Record<string, boolean> {
    return this._pyodide.runPython(`
      to_js(game.clan.clan_settings, dict_converter=js.Object.fromEntries)
    `);  
  }

  public setSettings(settings: Record<string, boolean>) {
    const locals = pyodide.toPy({ settings: settings });
    this._pyodide.runPython(
      `
      for name, setting in settings.items():
        game.clan.clan_settings[name] = setting
      `,
      { locals: locals },
    );
    locals.destroy();
  }
}

const clangenRunner = new Clangen(pyodide);
await clangenRunner.loadClangen();

export { clangenRunner };
export type {
  CatEdit,
  Cat,
  ClanInfo,
  PatrolAction,
  PatrolType,
  Pelt,
  Relationship,
  Condition,
  Event,
};
