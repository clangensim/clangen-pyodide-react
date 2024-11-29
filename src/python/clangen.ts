import { PyodideInterface } from "pyodide";
import pyodide from "./pyodide";

interface ClangenInterface {
  getCat(id: string): Object;
  moonskip(): void;
  getEvents(): Array<Object>;
  getCats(): Array<Object>
  getClanAge(): Number;
}

class Clangen implements ClangenInterface {
  pyodide;

  constructor(pyodide: PyodideInterface) {
    this.pyodide = pyodide;
  }

  async loadClangen(): Promise<void> {
    // load resources
    let zipResources = await fetch("/bin/resources.zip");
    let binaryResources = await zipResources.arrayBuffer();
    this.pyodide.unpackArchive(binaryResources, "zip");

    // load "sprites" (actually just tints)
    let zipSprites = await fetch("/bin/sprites.zip");
    let binarySprites = await zipSprites.arrayBuffer();
    this.pyodide.unpackArchive(binarySprites, "zip");

    // load saves (for testing)
    let zipSaves = await fetch("/bin/saves.zip");
    let binarySaves = await zipSaves.arrayBuffer();
    this.pyodide.unpackArchive(binarySaves, "zip");

    // install "clangen-lite"
    await this.pyodide.loadPackage("micropip");
    const micropip = this.pyodide.pyimport("micropip");
    await micropip.install("/bin/clangen_lite-0.0.1-py2.py3-none-any.whl");

    // load clan
    try {
      this.pyodide.runPython(`
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

  getCat(id: string): any {
    return {};
  }

  getCats(): Array<any> {
    const cats = this.pyodide.runPython(`
      cats = []
      for cat in Cat.all_cats_list:
        cats.append({
          'ID': cat.ID,
          'name': str(cat.name),
          'moons': cat.moons,
          'desc': cat.describe_cat()
        })
      to_js(cats, dict_converter=js.Object.fromEntries)
    `)
    return cats;
  }

  moonskip(): void {
    this.pyodide.runPython(`
      events_class.one_moon()
    `);
  }

  getEvents(): Array<any> {
    const events = this.pyodide.runPython(`
      to_js([vars(event) for event in game.cur_events_list], dict_converter=js.Object.fromEntries)
    `);
    return events;
  }

  getClanAge(): Number {
    const age = this.pyodide.runPython(`
      game.clan.age
    `);
    return age;
  }
}

const clangenRunner = new Clangen(pyodide);
await clangenRunner.loadClangen();

export { clangenRunner };
