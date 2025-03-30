import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { CatEdit, Cat } from "../python/types";
import { clangenRunner } from "../python/clangenRunner";
import Select from "../components/generic/Select";
import { SelectOption } from "../components/generic/Select";

import BasePage from "../layout/BasePage";

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

function CatEditPage() {
  const params = useParams();
  const catID = params.id as string;
  var crumbs = undefined;

  const navigate = useNavigate();

  const [cat, setCat] = useState<Cat>();
  const [potentialMentors, setPotentialMentors] = useState<Cat[]>();
  const [potentialMates, setPotentialMates] = useState<Cat[]>();

  const [prefix, setPrefix] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");

  const [status, setStatus] = useState("");

  const [mentor, setMentor] = useState("");
  const [selectedMate, setSelectedMate] = useState("");

  const [mates, setMates] = useState<string[]>([]);

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

  var disableSelectStatus = false;
  var statusOptions: SelectOption[] = [];
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
    };
    if (isApprentice) {
      e.mentor = mentor;
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
        document.title = `Editing ${c.name.display} | Clangen Simulator`;
      }
      setCat(c);
      if (c.mentor) {
        setMentor(c.mentor.ID);
      }
      setPrefix(c.name.prefix);
      setSuffix(c.name.suffix);
      setStatus(c.status);
      setMates(c.mates.map((mate) => mate.ID));

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
  }, []);

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

          {["young adult", "adult", "senior adult", "senior"].includes(
            cat.age,
          ) && (
            <fieldset>
              <legend>Mates</legend>
              {mates.map((mateID, index) => (
                <div key={mateID + "_" + index}>
                  {potentialMateMap.current[mateID]?.name.display}{" "}
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

      <button tabIndex={0} onClick={handleSubmit}>
        Submit
      </button>
    </BasePage>
  );
}

export default CatEditPage;
