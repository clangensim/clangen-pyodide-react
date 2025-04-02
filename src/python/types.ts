
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
  uuid: string;
}

export type {
  CatEdit,
  Cat,
  ClanInfo,
  PatrolAction,
  PatrolType,
  PatrolIntro,
  Pelt,
  Relationship,
  Condition,
  Event,
};
