import { useEffect, useState } from "react";
import { Cat } from "../python/types";
import { clangenRunner } from "../python/clangenRunner";
import Select from "../components/generic/Select";
import { SelectOption } from "../components/generic/Select";
import Checkbox from "../components/generic/Checkbox";
import BasePage from "../layout/BasePage";

import confusedCat from "../assets/images/gen_med_newmed.png";

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

function haveMediated(cat1: string, cat2: string, mediatedPairs: [string, string][]) {
  for (const pair of mediatedPairs) {
    if (pair.includes(cat1) && pair.includes(cat2)) {
      return true;
    }
  }
  return false;
}

// TODO: switch to reducer
function MediationPage() {
  const [mediationText, setMediationText] = useState("");

  const [possibleMediators, setPossibleMediators] = useState<Cat[]>([]);
  const [possibleCats, setPossibleCats] = useState<Cat[]>([]);
  const [mediatedPairs, setMediatedPairs] = useState<[string, string][]>([]);

  const [allowRomantic, setAllowRomantic] = useState<boolean>(false);

  const [selectedCat1, setSelectedCat1] = useState("");
  const [selectedCat2, setSelectedCat2] = useState("");
  const [selectedCat3, setSelectedCat3] = useState("");

  const alreadyMediated = haveMediated(selectedCat3, selectedCat2, mediatedPairs);

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

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  function reset() {
    setSelectedCat1("");
    setSelectedCat2("");
    setSelectedCat3("");
    setMediationText("");
    setScreenState("start");

    clangenRunner.getPossibleMediators().then((m) => setPossibleMediators(m));
    clangenRunner.getPossibleMediated().then((m) => setPossibleCats(m));
    clangenRunner.getMediatedPairs().then((m) => setMediatedPairs(m));
  }

  useEffect(() => {
    reset();
    setIsFirstLoad(false);
  }, []);

  useEffect(() => {
    document.title = "Mediation | ClanGen Simulator";
  }, []);

  function doMediate(kind: "sabotage" | "mediate", allowRomantic: boolean) {
    setScreenState("in-progress");
    let doSabotage;
    if (kind == "sabotage") {
      doSabotage = true;
    } else {
      doSabotage = false;
    }
    clangenRunner
      .mediate(
        selectedCat1,
        selectedCat2,
        selectedCat3,
        doSabotage,
        allowRomantic,
      )
      .then((m) => setMediationText(m))
      .catch((exception) => {
        alert(exception);
        reset();
      });
  }

  if (isFirstLoad) {
    return (
      <BasePage crumbs={crumbs}>
        <p>Loading...</p>
      </BasePage>
    );
  }

  if (possibleMediators.length <= 0) {
    return (
      <BasePage crumbs={crumbs}>
        <img style={{ imageRendering: "pixelated" }} src={confusedCat}></img>

        <p>
          No cats in the Clan can currently mediate. Cats with the “mediator” or
          "mediator apprentice" role without major injuries or illnesses can
          mediate once every moon.
        </p>
      </BasePage>
    );
  }

  return (
    <BasePage crumbs={crumbs}>
      <p>
        Cats with the “mediator” or "mediator apprentice" role without major injuries or
        illnesses can mediate once every moon. Mediator cats cannot patrol. Roles can be set on a cat's edit page.
      </p>

      <p>Any particular pair of cats can only be mediated once per moon.</p>

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

      {alreadyMediated && <p>This pair of cats has already been mediated together this moon.</p>}

      <p>{mediationText}</p>

      {screenState === "start" && (
        <div className="button-row">
          <button
            tabIndex={0}
            disabled={selectedCats.length < 3 || alreadyMediated}
            onClick={() => doMediate("mediate", allowRomantic)}
          >
            Mediate
          </button>
          <button
            tabIndex={0}
            disabled={selectedCats.length < 3 || alreadyMediated}
            onClick={() => doMediate("sabotage", allowRomantic)}
          >
            Sabotage
          </button>
        </div>
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
