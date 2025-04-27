# pylint: skip-file

import os
os.chdir("/mnt")

from pyodide.ffi import to_js
import js
import uuid

from scripts.game_structure.load_cat import load_cats, version_convert
from scripts.game_structure.game_essentials import game
from scripts.cat.cats import Cat, create_example_cats, BACKSTORIES
from scripts.cat.history import History
from scripts.patrol.patrol import Patrol
from scripts.clan import Clan
from scripts.events import events_class
from scripts.clan import clan_class
from scripts.utility import quit as clangen_quit

import shutil

class CatCantWork(Exception):
  """Error thrown when a cat who can't work is made to work"""

current_patrols = {}

def load_clan():
  clan_list = game.read_clans()
  if clan_list:
      game.switches['clan_list'] = clan_list
      try:
          load_cats()
          version_info = clan_class.load_clan()
          version_convert(version_info)
          game.load_events()
      except Exception as e:
          print("File failed to load")
          if not game.switches['error_message']:
              game.switches[
                  'error_message'] = 'There was an error loading the cats file!'
              game.switches['traceback'] = e

def reload_clan():
  game.mediated.clear()
  game.patrolled.clear()
  game.cat_to_fade.clear()
  Cat.outside_cats.clear()
  Cat.all_cats_list.clear()
  Cat.ordered_cat_list.clear()
  Cat.all_cats.clear()
  Patrol.used_patrols.clear()
  game.cur_events_list.clear()
  game.herb_events_list.clear()
  Cat.grief_strings.clear()
  load_clan()
  Cat.sort_cats()
  refresh_cats()
  current_patrols.clear()

def erase_clan():
  shutil.rmtree("/mnt/saves")

def cat_to_dict(cat, depth=1):
  def id_list_to_dict_list(lst):
    return list(map(lambda cat_id : cat_to_dict(Cat.all_cats[cat_id], 0), lst))

  if cat is None:
    return None

  if cat.status in ['kittypet', 'loner', 'rogue', 'former Clancat']:
    backstory = cat.status
  elif cat.backstory:
    backstory = 'Clanborn'
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

def save_game():
  game.save_cats()
  game.clan.save_clan()
  game.clan.save_pregnancy(game.clan)
  game.save_events()

def initialize_starting_cats():
  cats = []
  create_example_cats()
  for _, cat in game.choose_cats.items():
    cats.append(cat_to_dict(cat))
  return to_js(cats, dict_converter=js.Object.fromEntries)

def create_clan(clan_name, leader, deputy, med_cat, biome, camp, game_mode, members, season):
  erase_clan()

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
  current_patrols.clear()

def get_cat(cat_id):
  cat = Cat.all_cats[cat_id]
  return to_js(cat_to_dict(cat), dict_converter=js.Object.fromEntries)

def edit_cat(cat_id, editObj):
  edit = editObj.to_py()
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
  _end_patrol_containing(cat_id)

def destroy_accessory(cat_id):
  cat = Cat.all_cats[cat_id]
  cat.pelt.accessory = None
  _end_patrol_containing(cat_id)

def exile_cat(cat_id):
  cat = Cat.all_cats[cat_id]
  cat.exile()
  _end_patrol_containing(cat_id)

def kill_cat(cat_id, history, take_nine_lives):
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
  _end_patrol_containing(cat_id)

def get_cats():
  cats = []
  for cat in Cat.all_cats_list:
    cats.append(cat_to_dict(cat))
  return to_js(cats, dict_converter=js.Object.fromEntries)

def get_potential_mates(cat_id):
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

  return to_js(valid_mates, dict_converter=js.Object.fromEntries)

def _is_patrollable(the_cat):
  return not the_cat.dead and the_cat.ID not in game.patrolled and the_cat.status not in [
          'newborn', 'elder', 'kitten', 'mediator', 'mediator apprentice'
      ] and not the_cat.outside and not the_cat.not_working()

def _end_patrol_containing(cat_id):
  for key, patrol in current_patrols.items():
    for cat in patrol.patrol_cats:
      if cat.ID == cat_id:
        patrol.proceed_patrol("decline")
        del current_patrols[key]
        return

def get_patrollable_cats():
  cats = []
  for the_cat in Cat.all_cats_list:
    if _is_patrollable(the_cat):
      cats.append(cat_to_dict(the_cat))
  return to_js(cats, dict_converter=js.Object.fromEntries)

def get_possible_mediators():
  cats = []
  for the_cat in Cat.all_cats_list:
    if not the_cat.dead and the_cat.ID not in game.patrolled and the_cat.status in [
          'mediator', 'mediator apprentice'
        ] and not the_cat.outside and not the_cat.not_working():
      cats.append(cat_to_dict(the_cat))
  return to_js(cats, dict_converter=js.Object.fromEntries)

def get_possible_mediated():
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
  return to_js(cats, dict_converter=js.Object.fromEntries)

def get_potential_mentors(apprentice_role):
  potential_mentors = []

  for cat in Cat.all_cats_list:
    if not cat.dead and not cat.outside:
      if cat.status in ["warrior", "leader", "deputy"] and apprentice_role == "apprentice":
        potential_mentors.append(cat_to_dict(cat))
      elif cat.status == "medicine cat" and apprentice_role == "medicine cat apprentice":
        potential_mentors.append(cat_to_dict(cat))
      elif cat.status == "mediator" and apprentice_role == "mediator apprentice":
        potential_mentors.append(cat_to_dict(cat))
  return to_js(potential_mentors, dict_converter=js.Object.fromEntries)

def get_relationships(cat_id):
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
  return to_js(rels, dict_converter=js.Object.fromEntries)

def get_conditions(cat_id):
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
  return to_js(conditions, dict_converter=js.Object.fromEntries)

def moonskip():
  events_class.one_moon()
  current_patrols.clear()

def get_events():
  return to_js([vars(event) for event in game.cur_events_list], dict_converter=js.Object.fromEntries)

def start_patrol(patrol_members, patrol_type):
  patrol_members_obj = list(map(lambda cat_id : Cat.all_cats[cat_id], patrol_members))
  for cat in patrol_members_obj:
    if not _is_patrollable(cat):
      raise CatCantWork
    if cat.status == "medicine cat" or cat.status == "medicine cat apprentice":
      patrol_type = "med"

  id = str(uuid.uuid4())
  current_patrols[id] = Patrol()

  p = {
    "text": current_patrols[id].setup_patrol(patrol_members_obj, patrol_type),
    "canAntagonize": len(current_patrols[id].patrol_event.antag_success_outcomes) > 0,
    "uuid": id
  }
  return to_js(p, dict_converter=js.Object.fromEntries)

def finish_patrol(id, action):
  outcome = current_patrols.pop(id).proceed_patrol(action)
  return outcome

def mediate(mediator, mediated1, mediated2, sabotage, allow_romantic):
  game.mediated.append([mediated1, mediated2])
  game.patrolled.append(mediator)
  return Cat.mediate_relationship(Cat.all_cats[mediator], 
    Cat.all_cats[mediated1], Cat.all_cats[mediated2],
    allow_romantic=allow_romantic,
    sabotage=sabotage)

def get_clan_age():
  return game.clan.age

def export_clan():
  game.save_cats()
  game.clan.save_clan()
  game.clan.save_pregnancy(game.clan)
  game.save_events()

  import shutil
  shutil.make_archive("/exported", "zip", "saves")

  with open("/exported.zip", "rb") as f:
    binary = f.read()
  return to_js(binary)

def get_clan_info():
  clan_info = {
    "name": game.clan.name + "Clan",
    "age": game.clan.age,
    "gameMode": game.clan.game_mode,
    "season": game.clan.current_season
  }
  if game.clan.game_mode != "classic":
    clan_info["freshkill"] = round(game.clan.freshkill_pile.total_amount, 2)
    clan_info["requiredFreshkill"] = round(game.clan.freshkill_pile.amount_food_needed(), 2)
  return to_js(clan_info, dict_converter=js.Object.fromEntries)

def refresh_cats():
  if game.clan is not None:
    key_copy = tuple(Cat.all_cats.keys())
    for x in key_copy:
      if x not in game.clan.clan_cats:
        game.clan.remove_cat(x)

def get_settings():
  return to_js(game.clan.clan_settings, dict_converter=js.Object.fromEntries)

def set_settings(settingsObj):
  settings = settingsObj.to_py()
  for name, setting in settings.items():
    game.clan.clan_settings[name] = setting
