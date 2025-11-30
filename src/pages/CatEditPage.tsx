import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { CatEdit, Cat, Toggles } from "../python/types";
import { clangenRunner } from "../python/clangenRunner";
import Select from "../components/generic/Select";
import { SelectOption } from "../components/generic/Select";

import BasePage from "../layout/BasePage";
import Checkbox from "../components/generic/Checkbox";
import Radiobox from "../components/generic/Radiobox";

const selectApprenticeOptions = [
  {
    value: "apprentice",
    label: "Warrior Apprentice",
  },
  {
    value: "medicine cat apprentice",
    label: "Medicine Cat Apprentice",
  },
  {
    value: "mediator apprentice",
    label: "Mediator Apprentice",
  },
];

const selectRegularCatOptions = [
  {
    value: "leader",
    label: "Leader (replaces current leader)",
  },
  {
    value: "deputy",
    label: "Deputy (replaces current deputy)",
  },
  {
    value: "warrior",
    label: "Warrior",
  },
  {
    value: "mediator",
    label: "Mediator",
  },
  {
    value: "medicine cat",
    label: "Medicine Cat",
  },
  {
    value: "elder",
    label: "Elder (retired)",
  },
];

function EditGender({cat, value, setValue} : {cat: Cat, value: string; setValue: (val: string) => void}) {

  return (
    <>
      <fieldset>
        <legend>Gender</legend>

        <div onChange={(e: any) => setValue(e.target.value)}>
          {cat.sex === "female" && 
            <>
              <Radiobox checked={value === "trans male"} label="trans male" name="gender" />
              <Radiobox checked={value === "female"} label="female" name="gender" />
            </>
          }
          {cat.sex === "male" &&
            <>
              <Radiobox checked={value === "male"} label="male" name="gender" />
              <Radiobox checked={value === "trans female"} label="trans female" name="gender" />
            </>
          }
          <Radiobox checked={value === "nonbinary"} label="nonbinary" name="gender" />
        </div>
      </fieldset>
    </>
  );
}

function EditAfterlife({value, setValue} : {value: string; setValue: (val: string) => void}) {
  return (
    <>
      <fieldset>
        <legend>Afterlife</legend>

        <div onChange={(e: any) => setValue(e.target.value)}>
            <Radiobox checked={value === "starclan"} label="starclan" name="afterlife" />
            <Radiobox checked={value === "dark forest"} label="dark forest" name="afterlife" />
            <Radiobox checked={value === "unknown residence"} label="unknown residence" name="afterlife" />
        </div>
      </fieldset>
    </>
  )
}

function CatEditPage() {
  const params = useParams();
  const catID = params.id as string;
  let crumbs = undefined;

  const navigate = useNavigate();

  const [cat, setCat] = useState<Cat>();
  const [notes, setNotes] = useState<string>("");

  const [potentialMentors, setPotentialMentors] = useState<Cat[]>();
  const [potentialMates, setPotentialMates] = useState<Cat[]>();

  const [prefix, setPrefix] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");

  const [status, setStatus] = useState("");

  const [mentor, setMentor] = useState("");
  const [selectedMate, setSelectedMate] = useState("");

  const [mates, setMates] = useState<string[]>([]);

  const [preventRetire, setPreventRetire] = useState(false);
  const [preventKits, setPreventKits] = useState(false);
  const [preventMates, setPreventMates] = useState(false);
  const [hideSpecSuffix, setHideSpecSuffix] = useState(false);

  const [gender, setGender] = useState("");
  const [afterlife, setAfterlife] = useState("");

  const isApprentice = cat?.status.includes("apprentice");

  const potentialMentorOptions = [];
  if (potentialMentors) {
    for (const c of potentialMentors) {
      potentialMentorOptions.push({
        label: `${c.name.display} - ${c.status}`,
        value: c.ID,
      });
    }
  }

  const potentialMateOptions = [];
  const potentialMateMap = useRef<Record<string, Cat>>({});
  if (potentialMates) {
    for (const c of potentialMates) {
      potentialMateMap.current[c.ID] = c;
      if (mates.includes(c.ID)) {
        continue;
      }
      potentialMateOptions.push({
        label: `${c.name.display}`,
        value: c.ID,
      });
    }
  }

  let disableSelectStatus = false;
  let statusOptions: SelectOption[] = [];
  if (cat) {
    if (isApprentice) {
      disableSelectStatus = false;
      statusOptions = selectApprenticeOptions;
    } else if (
      selectRegularCatOptions.find((elem) => elem.value === cat.status)
    ) {
      // if the cat's status is under regular cat options
      disableSelectStatus = false;
      statusOptions = selectRegularCatOptions;
    } else {
      disableSelectStatus = true;
      statusOptions = [
        {
          value: cat?.status,
          label: cat?.status,
        },
      ];
    }

    crumbs = [
      {
        url: "/",
        label: "Home",
      },
      {
        url: "/cats",
        label: "Cats",
      },
      {
        url: `/cats/${catID}`,
        label: cat.name.display,
      },
      {
        url: `/cats/${catID}/edit`,
        label: "Edit",
      },
    ];
  }

  function handleSubmit() {
    const e: CatEdit = {
      status: status,
      prefix: prefix,
      suffix: suffix,
      mates: mates,
      gender: gender,
    };
    const t: Toggles = {
      preventKits: preventKits,
      preventMates: preventMates,
      preventRetire: preventRetire
    };
    e.toggles = t;
    e.hideSpecialSuffix = hideSpecSuffix;
    if (isApprentice) {
      e.mentor = mentor;
    }
    if (afterlife !== "") {
      e.afterlife = afterlife;
    }
    if (notes !== "") {
      e.notes = notes;
    }
    clangenRunner.editCat(catID, e);
    navigate(`/cats/${catID}`);
  }

  function handleChangeRole(value: string) {
    if (isApprentice && value !== status) {
      clangenRunner
        .getPotentialMentors(value)
        .then((mentors) => setPotentialMentors(mentors));
      setMentor("");
    }
    setStatus(value);
  }

  function handleRemoveMate(index: number) {
    setMates(mates.filter((_, i) => i !== index));
  }

  useEffect(() => {
    clangenRunner.getCat(catID).then((c) => {
      if (c) {
        document.title = `Editing ${c.name.display} | ClanGen Simulator`;
      }
      setCat(c);
      if (c.mentor) {
        setMentor(c.mentor.ID);
      }
      setPrefix(c.name.prefix);
      setSuffix(c.name.suffix);
      setStatus(c.status);
      setMates(c.mates.map((mate) => mate.ID));
      setPreventRetire(c.toggles.preventRetire);
      setPreventKits(c.toggles.preventKits);
      setPreventMates(c.toggles.preventMates);
      setHideSpecSuffix(c.name.specSuffixHidden);
      setGender(c.gender);

      var afterlifeLocation = "";
      if (c.dead) {
        if (c.inDarkForest) {
          afterlifeLocation = "dark forest";
        } else if (c.outside) {
          afterlifeLocation = "unknown residence";
        } else {
          afterlifeLocation = "starclan";
        }
      }
      setAfterlife(afterlifeLocation);

      clangenRunner
        .getPotentialMentors(c.status)
        .then((mentors) => setPotentialMentors(mentors));
      for (const mate of c.mates) {
        potentialMateMap.current[mate.ID] = mate;
      }
    });

    clangenRunner.getPotentialMates(catID).then((mates) => {
      setPotentialMates(mates);
    });
  }, [catID]);

  return (
    <BasePage crumbs={crumbs}>
      <div>
        Name
        <input
          type="text"
          value={prefix}
          onChange={(e) => setPrefix(e.currentTarget.value)}
        />
        <input
          type="text"
          value={suffix}
          onChange={(e) => setSuffix(e.currentTarget.value)}
        />
      </div>

      {cat && cat.dead && 
        <EditAfterlife value={afterlife} setValue={setAfterlife}/>
      }

      {cat && !cat.dead && !cat.outside && (
        <>
          <div>
            <Select
              label="Role"
              disabled={disableSelectStatus}
              options={statusOptions}
              value={status}
              onChange={handleChangeRole}
              noEmpty
            />
          </div>

          <EditGender cat={cat} value={gender} setValue={setGender} />

          {["young adult", "adult", "senior adult", "senior"].includes(
            cat.age,
          ) && (
            <fieldset>
              <legend>Mates</legend>
              {mates.map((mateID, index) => (
                <div key={mateID + "_" + index}>
                  <Link to={`/cats/${mateID}`} target="_blank">
                    {potentialMateMap.current[mateID]?.name.display}
                  </Link>{" "}
                  <button onClick={() => handleRemoveMate(index)}>
                    Remove
                  </button>
                </div>
              ))}

              <Select
                value={selectedMate}
                options={potentialMateOptions}
                onChange={(value) => {
                  setSelectedMate(value);
                }}
              />
              <button
                onClick={() => {
                  setMates([...mates, selectedMate]);
                  setSelectedMate("");
                }}
                disabled={selectedMate === ""}
              >
                Add mate
              </button>
            </fieldset>
          )}

          <fieldset>
            <legend>Toggles</legend>

            <Checkbox label="Prevent retiring automatically" checked={preventRetire} onChange={() => setPreventRetire(!preventRetire)}/>
            <Checkbox label="Prevent adopting or having kits" checked={preventKits} onChange={() => setPreventKits(!preventKits)}/>
            <Checkbox label="Prevent having romantic interactions with non-mates" checked={preventMates} onChange={() => setPreventMates(!preventMates)}/>
            <Checkbox label="Hide special role suffixes" checked={hideSpecSuffix} onChange={() => setHideSpecSuffix(!hideSpecSuffix)}/>
          </fieldset>

          {isApprentice && (
            <div>
              <Select
                label="Mentor"
                disabled={disableSelectStatus}
                options={potentialMentorOptions}
                value={mentor}
                onChange={setMentor}
              />
            </div>
          )}
        </>
      )}

      <fieldset>
        <legend>Notes</legend>
        <textarea
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
          style={{width: "99%", maxWidth: "99%", resize: "none", height: "20em", fontSize: "16px"}}></textarea>
      </fieldset>

      <button tabIndex={0} onClick={handleSubmit}>
        Submit
      </button>
    </BasePage>
  );
}

export default CatEditPage;
