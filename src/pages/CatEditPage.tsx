import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { CatEdit, Cat, clangenRunner } from "../python/clangen";
import Navbar from "../components/Navbar";
import Select from "../components/Select";
import Breadcrumbs from "../components/Breadcrumbs";

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

const selectKittenOptions = [
  {
    value: "kitten",
    label: "Kitten"
  },
];

function CatEditPage() {
  const params = useParams();
  const catID = params.id as string;

  const [cat, setCat] = useState<Cat>();
  const [potentialMentors, setPotentialMentors] = useState<Cat[]>();

  const [prefix, setPrefix] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");

  const [status, setStatus] = useState("");

  const [mentor, setMentor] = useState("");

  const isApprentice = cat?.status.includes("apprentice");

  const potentialMentorOptions = [];
  if (potentialMentors) {
    for (const c of potentialMentors) {
      potentialMentorOptions.push({
        label: `${c.name.display} - ${c.status}`,
        value: c.ID
      });
    }
  }

  // have to do it like this because we don't want to disable before submit
  const [disableSelectStatus, setDisableSelectStatus] = useState(false);

  var statusOptions;
  if (isApprentice) {
    statusOptions = selectApprenticeOptions;
  } else if (cat?.status == "kitten") {
    statusOptions = selectKittenOptions;
  } else {
    statusOptions = selectRegularCatOptions;
  }

  function handleSubmit() {
    const e: CatEdit = {
      status: status,
      prefix: prefix,
      suffix: suffix,
    }
    if (isApprentice) {
      e.mentor = mentor;
    }
    clangenRunner.editCat(catID, e);
    alert("Cat successfully edited!");
  }

  function handleChangeRole(value: string) {
    if (isApprentice && value !== status) {
        setPotentialMentors(clangenRunner.getPotentialMentors(value));
        setMentor("");
    }
    setStatus(value);
  }

  useEffect(() => {
    const c = clangenRunner.getCat(catID);
    if (c.status === "kitten") {
      setDisableSelectStatus(true);
    }
    setCat(c);
    if (c.mentor) {
      setMentor(c.mentor);
    }
    setPrefix(c.name.prefix);
    setSuffix(c.name.suffix);
    setStatus(c.status);

    setPotentialMentors(clangenRunner.getPotentialMentors(c.status));
  }, []);

  return (
    <>
      <Navbar />
      {cat && (
        <Breadcrumbs
          crumbs={[
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
          ]}
        />
      )}

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

      {isApprentice &&
        <div>
          <Select
              label="Mentor"
              disabled={disableSelectStatus}
              options={potentialMentorOptions}
              value={mentor}
              onChange={setMentor}
          />
        </div>
      }

      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}

export default CatEditPage;
