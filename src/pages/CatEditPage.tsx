import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Cat, clangenRunner } from "../python/clangen";
import Nav from "../components/Nav";
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
    label: "Elder (permanent)",
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

  const [prefix, setPrefix] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");

  const [status, setStatus] = useState("");

  // have to do it like this because we don't want to disable before submit
  const [disableSelectStatus, setDisableSelectStatus] = useState(false);

  var statusOptions;

  if (status.includes("apprentice")) {
    statusOptions = selectApprenticeOptions;
  } else if (status == "kitten") {
    statusOptions = selectKittenOptions;
  } else {
    statusOptions = selectRegularCatOptions;
  }

  function handleSubmit() {
    clangenRunner.editCat(catID, {
      status: status,
      prefix: prefix,
      suffix: suffix,
    });
    if (status === "elder") {
      setDisableSelectStatus(true);
    }
    alert("Cat successfully edited!");
  }

  useEffect(() => {
    const c = clangenRunner.getCat(catID);
    if (c.status === "elder" || c.status === "kitten") {
      setDisableSelectStatus(true);
    }
    setCat(c);
    setPrefix(c.name.prefix);
    setSuffix(c.name.suffix);
    setStatus(c.status);
  }, []);

  return (
    <>
      <Nav />
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
          onChange={setStatus}
          noEmpty
        />
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}

export default CatEditPage;
