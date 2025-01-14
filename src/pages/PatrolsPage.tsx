import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Cat, PatrolType, clangenRunner } from "../python/clangen";
import Select from "../components/Select";

// TODO: switch to reducer
function PatrolsPage() {
  const [patrolText, setPatrolText] = useState("");
  const [resultText, setResultText] = useState("");

  const [patrolType, setPatrolType] = useState<PatrolType>("hunting");

  const [possibleCats, setPossibleCats] = useState<Cat[]>([]);

  const [selectedCat1, setSelectedCat1] = useState("");
  const [selectedCat2, setSelectedCat2] = useState("");
  const [selectedCat3, setSelectedCat3] = useState("");
  const [selectedCat4, setSelectedCat4] = useState("");
  const [selectedCat5, setSelectedCat5] = useState("");
  const [selectedCat6, setSelectedCat6] = useState("");

  // non-empty cats only
  const selectedCats = [
    selectedCat1,
    selectedCat2,
    selectedCat3,
    selectedCat4,
    selectedCat5,
    selectedCat6,
  ].filter((elem) => elem !== "");

  const catOptions = possibleCats.map((cat) => {
    return {
      label: cat.name,
      value: cat.ID,
    };
  });

  const [screenState, setScreenState] = useState("start");

  const disabled = screenState !== "start";
  
  function reset() {
    setSelectedCat1("");
    setSelectedCat2("");
    setSelectedCat3("");
    setSelectedCat4("");
    setSelectedCat5("");
    setSelectedCat6("");
    setResultText("");
    setPatrolText("");
    setScreenState("start");
  
    const cats = clangenRunner.getCats();

    // TODO: not working & patrolled
    const temp = cats.filter((cat) => {
      return (
        !cat.dead &&
        !["elder", "kitten", "mediator", "mediator apprentice"].includes(
          cat.status,
        ) &&
        !cat.outside
      );
    });
    setPossibleCats(temp);
  }

  useEffect(() => {
    reset();
  }, [])

  function startPatrol() {
    setScreenState("in-progress");
    setPatrolText(clangenRunner.startPatrol(selectedCats, patrolType));
    setResultText("");
  }

  function endPatrol(action: "proceed" | "decline" | "antag") {
    const [outcomeText, outcomeResult] = clangenRunner.finishPatrol(action);
    setPatrolText(outcomeText);
    setResultText(outcomeResult);
    setScreenState("wrap-up");
  }

  return (
    <>
      <Nav />

      <fieldset>
        <legend>Cats</legend>
        <div>
          <Select
            value={selectedCat1}
            onChange={setSelectedCat1}
            disabled={disabled}
            options={catOptions.filter(
              (cat) =>
                cat.value === selectedCat1 || !selectedCats.includes(cat.value),
            )}
          />
        </div>
        <div>
          <Select
            value={selectedCat2}
            onChange={setSelectedCat2}
            disabled={disabled}
            options={catOptions.filter(
              (cat) =>
                cat.value === selectedCat2 || !selectedCats.includes(cat.value),
            )}
          />
        </div>
        <div>
          <Select
            value={selectedCat3}
            onChange={setSelectedCat3}
            disabled={disabled}
            options={catOptions.filter(
              (cat) =>
                cat.value === selectedCat3 || !selectedCats.includes(cat.value),
            )}
          />
        </div>
        <div>
          <Select
            value={selectedCat4}
            onChange={setSelectedCat4}
            disabled={disabled}
            options={catOptions.filter(
              (cat) =>
                cat.value === selectedCat4 || !selectedCats.includes(cat.value),
            )}
          />
        </div>
        <div>
          <Select
            value={selectedCat5}
            onChange={setSelectedCat5}
            disabled={disabled}
            options={catOptions.filter(
              (cat) =>
                cat.value === selectedCat5 || !selectedCats.includes(cat.value),
            )}
          />
        </div>
        <div>
          <Select
            value={selectedCat6}
            onChange={setSelectedCat6}
            disabled={disabled}
            options={catOptions.filter(
              (cat) =>
                cat.value === selectedCat6 || !selectedCats.includes(cat.value),
            )}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Patrol Type</legend>
        <div>
          <input
            id="hunt-radio"
            name="patrol-type"
            type="radio"
            disabled={disabled}
            checked={patrolType === "hunting"}
            onChange={() => setPatrolType("hunting")}
          />
          <label htmlFor="hunt-radio">Hunting</label>
        </div>

        <div>
          <input
            id="bord-radio"
            name="patrol-type"
            type="radio"
            disabled={disabled}
            checked={patrolType === "border"}
            onChange={() => setPatrolType("border")}
          />
          <label htmlFor="bord-radio">Border</label>
        </div>

        <div>
          <input
            id="train-radio"
            name="patrol-type"
            type="radio"
            disabled={disabled}
            checked={patrolType === "training"}
            onChange={() => setPatrolType("training")}
          />
          <label htmlFor="train-radio">Training</label>
        </div>

        <div>
          <input
            id="med-radio"
            name="patrol-type"
            type="radio"
            disabled={disabled}
            checked={patrolType === "med"}
            onChange={() => setPatrolType("med")}
          />
          <label htmlFor="med-radio">Herb Gathering</label>
        </div>
      </fieldset>

      <p>{patrolText}</p>

      <p>{resultText}</p>

      {screenState === "start" &&
        <button onClick={startPatrol}>Start Patrol</button>
      }

      {(screenState === "in-progress") && 
      <>
        <button onClick={() => endPatrol("proceed")}>Proceed</button>
        <button onClick={() => endPatrol("decline")}>Decline</button>
      </>
      }

    {(screenState === "wrap-up") && 
      <>
        <button onClick={reset}>New Patrol</button>
      </>
      }

    </>
  );
}

export default PatrolsPage;
