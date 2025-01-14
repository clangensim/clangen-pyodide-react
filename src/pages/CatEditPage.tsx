import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Cat, clangenRunner } from "../python/clangen";
import Nav from "../components/Nav";
import Select from "../components/Select";

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
    label: "Elder (permanent)"
  }
];

function CatEditPage() {
  const params = useParams();
  const catID = params.id as string;

  const [cat, setCat] = useState<Cat>();

  const [catName, setCatName] = useState("");
  const [status, setStatus] = useState("");

  // have to do it like this because we don't want to disable before submit
  const [disableSelectStatus, setDisableSelectStatus] = useState(false);

  var statusOptions = status.includes("apprentice") ? selectApprenticeOptions : selectRegularCatOptions;

  function handleSubmit() {
    clangenRunner.editCat(catID, {
      status: status
    });
    if (status === "elder") {
      setDisableSelectStatus(true);
    }
    alert("Cat successfully edited!");
  }

  useEffect(() => {
    const c = clangenRunner.getCat(catID);
    if (c.status === "elder") {
      setDisableSelectStatus(true);
    }
    setCatName(c.name.display);
    setStatus(c.status);
    setCat(c);
  }, []);

  return (
    <>
      <Nav />

      <div>
        Name
        <input type="text" disabled value={catName} onChange={(e) => setCatName(e.currentTarget.value)} />
      </div>

      <div>
        Role
        <Select
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
