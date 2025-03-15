import { useEffect, useState } from "react";
import { Cat, clangenRunner } from "../python/clangen";
import Select from "../components/Select";
import { SelectOption } from "../components/Select";
import Checkbox from "../components/Checkbox";
import BasePage from "../layout/BasePage";

const crumbs = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/mediate",
    label: "Mediate",
  },
];

// TODO: switch to reducer
function MediationPage() {
  const [mediationText, setMediationText] = useState("");

  const [possibleMediators, setPossibleMediators] = useState<Cat[]>([]);
  const [possibleCats, setPossibleCats] = useState<Cat[]>([]);

  const [allowRomantic, setAllowRomantic] = useState<boolean>(false);

  const [selectedCat1, setSelectedCat1] = useState("");
  const [selectedCat2, setSelectedCat2] = useState("");
  const [selectedCat3, setSelectedCat3] = useState("");

  // non-empty cats only
  const selectedCats = [selectedCat1, selectedCat2, selectedCat3].filter(
    (elem) => elem !== "",
  );

  const mediatorOptions: SelectOption[] = possibleMediators.map((cat) => {
    return {
      label: `${cat.name.display} - ${cat.status}`,
      value: cat.ID,
    };
  });

  const catOptions: SelectOption[] = possibleCats.map((cat) => {
    return {
      label: `${cat.name.display} - ${cat.status}`,
      value: cat.ID,
    };
  });

  const [screenState, setScreenState] = useState("start");

  const disabled = screenState !== "start";

  function reset() {
    setSelectedCat1("");
    setSelectedCat2("");
    setSelectedCat3("");
    setMediationText("");
    setScreenState("start");

    setPossibleMediators(clangenRunner.getPossibleMediators());
    setPossibleCats(clangenRunner.getPossibleMediated());
  }

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    document.title = "Mediation | Clangen Simulator";
  }, []);

  function doMediate(kind: "sabotage" | "mediate", allowRomantic: boolean) {
    setScreenState("in-progress");
    var doSabotage;
    if (kind == "sabotage") {
      doSabotage = true;
    } else {
      doSabotage = false;
    }
    const m = clangenRunner.mediate(
      selectedCat1,
      selectedCat2,
      selectedCat3,
      doSabotage,
      allowRomantic,
    );
    setMediationText(m);
  }

  return (
    <BasePage
      crumbs={crumbs}
    >
      <p>
        A cat must have the "mediator" role to be allowed to mediate. Mediator
        cats cannot patrol.
      </p>

      <p>Roles can be set on a cat's edit page.</p>

      <fieldset>
        <legend>Mediator</legend>
        <div>
          <Select
            value={selectedCat1}
            onChange={setSelectedCat1}
            disabled={disabled}
            options={mediatorOptions.filter(
              (cat) =>
                cat.value === selectedCat1 || !selectedCats.includes(cat.value),
            )}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Mediated</legend>
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
      </fieldset>

      <fieldset>
        <legend>Options</legend>
        <Checkbox
          label="Allow effects on romantic like, if possible"
          checked={allowRomantic}
          onChange={() => setAllowRomantic(!allowRomantic)}
        />
      </fieldset>

      <p>{mediationText}</p>

      {screenState === "start" && (
        <>
          <button
            tabIndex={0}
            disabled={selectedCats.length < 3}
            onClick={() => doMediate("mediate", allowRomantic)}
          >
            Mediate
          </button>
          <button
            tabIndex={0}
            disabled={selectedCats.length < 3}
            onClick={() => doMediate("sabotage", allowRomantic)}
          >
            Sabotage
          </button>
        </>
      )}

      {screenState === "in-progress" && (
        <>
          <button tabIndex={0} onClick={reset}>
            Mediate Again
          </button>
        </>
      )}
    </BasePage>
  );
}

export default MediationPage;
