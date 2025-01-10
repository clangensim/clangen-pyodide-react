import { PyodideInterface } from "pyodide";
import pyodide from "./pyodide";

type Pelt = {
  name: string;
  colour: string;
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
  catSprites: Record<string, number>;
}

type Cat = {
  ID: string;
  name: string;
  moons: number;
  status: string;
  pelt: Pelt;
  age: string;
}

type Relationship = {
  cat_to_id: string;
  cat_from_id: string;
  mates: boolean;
  family: boolean;
  romantic_love: Number;
  platonic_like: Number;
  dislike: Number;
  admiration: Number;
  comfortable: Number;
  jealousy: Number;
  trust: Number;
}

type Event = {
  text: string;
  types: Array<string>;
  cats_involved: Array<string>;
}

interface ClangenInterface {
  getCat(id: string): Cat | undefined;
  moonskip(): void;
  getEvents(): Array<Object>;
  getCats(): Array<Object>
  getClanAge(): Number;
  getRelationships(id: string): Array<Object>;
}

class Clangen implements ClangenInterface {
  private _pyodide;

  constructor(pyodide: PyodideInterface) {
    this._pyodide = pyodide;
  }

  public async loadClangen(): Promise<void> {
    // load resources
    let zipResources = await fetch("/bin/resources.zip");
    let binaryResources = await zipResources.arrayBuffer();
    this._pyodide.unpackArchive(binaryResources, "zip");

    // load "sprites" (actually just tints)
    let zipSprites = await fetch("/bin/sprites.zip");
    let binarySprites = await zipSprites.arrayBuffer();
    this._pyodide.unpackArchive(binarySprites, "zip");

    // load saves (for testing)
    let zipSaves = await fetch("/bin/saves.zip");
    let binarySaves = await zipSaves.arrayBuffer();
    this._pyodide.unpackArchive(binarySaves, "zip");

    // install "clangen-lite"
    await this._pyodide.loadPackage("/bin/clangen_lite-0.0.1-py2.py3-none-any.whl");

    // load clan
    try {
      this._pyodide.runPython(`
      from pyodide.ffi import to_js
      import js

      from scripts.game_structure.load_cat import load_cats, version_convert
      from scripts.game_structure.game_essentials import game
      from scripts.cat.cats import Cat
      from scripts.events import events_class
      from scripts.clan import clan_class
      from scripts.utility import quit as clangen_quit

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
    } catch(err) {
      console.error(err);
    }
  }

  public getCat(id: string): Cat | undefined {
    // is there a better way of doing this?
    const locals = pyodide.toPy({ cat_id: id });
    const cat = this._pyodide.runPython(`
      cat = Cat.all_cats[cat_id]
      to_js({
        'ID': cat.ID,
        'name': str(cat.name),
        'age': cat.age,
        'moons': cat.moons,
        'status': cat.status,
        'pelt': {
          'name': cat.pelt.name,
          'colour': cat.pelt.colour,
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
          'catSprites': cat.pelt.cat_sprites
          }
        }, dict_converter=js.Object.fromEntries)
    `, { locals: locals });
    locals.destroy();
    return cat;
  }

  public getCats(): Array<Cat> {
    const cats = this._pyodide.runPython(`
      cats = []
      for cat in Cat.all_cats_list:
        cats.append({
          'ID': cat.ID,
          'name': str(cat.name),
          'age': cat.age,
          'moons': cat.moons,
          'status': cat.status,
          'desc': cat.describe_cat(),
          'pelt': {
            'name': cat.pelt.name,
            'colour': cat.pelt.colour,
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
            'catSprites': cat.pelt.cat_sprites
          }
        })
      to_js(cats, dict_converter=js.Object.fromEntries)
    `)
    return cats;
  }

  public getRelationships(id: string | undefined): Array<Relationship> {
    if (id === undefined) {
      return [];
    }

    // is there a better way of doing this?
    const locals = pyodide.toPy({ cat_id: id });
    const rels = this._pyodide.runPython(`
      rels = []
      cat = Cat.all_cats[cat_id]
      cat_rels = rel = sorted(cat.relationships.values(),
                             key=lambda x: sum(map(abs, [x.romantic_love, x.platonic_like, x.dislike,
                             x.admiration, x.comfortable, x.jealousy, x.trust])),
                             reverse=True)
      for rel in cat_rels:
        rels.append({
          'cat_to_id': rel.cat_to.ID,
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
    `, { locals: locals });
    locals.destroy();
    return rels;
  }

  public moonskip(): void {
    this._pyodide.runPython(`
      events_class.one_moon()
    `);
  }

  public getEvents(): Array<Event> {
    const events = this._pyodide.runPython(`
      to_js([vars(event) for event in game.cur_events_list], dict_converter=js.Object.fromEntries)
    `);
    return events;
  }

  public getClanAge(): Number {
    const age = this._pyodide.runPython(`
      game.clan.age
    `);
    return age;
  }
}

const clangenRunner = new Clangen(pyodide);
await clangenRunner.loadClangen();

export { clangenRunner };
export type { Cat, Pelt, Relationship, Event };
