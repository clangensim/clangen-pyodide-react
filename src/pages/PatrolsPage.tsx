import { useEffect, useState } from "react";
import { Cat, PatrolAction, PatrolType, ClanInfo } from "../python/types";
import { clangenRunner } from "../python/clangenRunner";
import Select from "../components/generic/Select";
import { SelectOption } from "../components/generic/Select";
import BasePage from "../layout/BasePage";

import confusedCat from "../assets/images/gen_med_newmed.png";

type ScreenState = "start" | "in-progress" | "wrap-up"
const crumbs = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/patrols",
    label: "Patrol",
  },
];

// TODO: switch to reducer
function PatrolsPage() {
  const [patrolText, setPatrolText] = useState("");
  const [canAntagonize, setCanAntagonize] = useState(false);
  const [resultText, setResultText] = useState("");

  const [patrolType, setPatrolType] = useState<PatrolType>("hunting");

  const [possibleCats, setPossibleCats] = useState<Cat[]>([]);

  const [selectedCat1, setSelectedCat1] = useState("");
  const [selectedCat2, setSelectedCat2] = useState("");
  const [selectedCat3, setSelectedCat3] = useState("");
  const [selectedCat4, setSelectedCat4] = useState("");
  const [selectedCat5, setSelectedCat5] = useState("");
  const [selectedCat6, setSelectedCat6] = useState("");

  const [patrolUuid, setPatrolUuid] = useState("");

  const [clanInfo, setClanInfo] = useState<ClanInfo>();

  // non-empty cats only
  const selectedCats = [
    selectedCat1,
    selectedCat2,
    selectedCat3,
    selectedCat4,
    selectedCat5,
    selectedCat6,
  ].filter((elem) => elem !== "");

  const catOptions: SelectOption[] = possibleCats.map((cat) => {
    return {
      label: `${cat.name.display} - ${cat.status}`,
      value: cat.ID,
    };
  });

  const [screenState, setScreenState] = useState<ScreenState>("start");

  const disabled = screenState !== "start";

  async function reset() {
    setSelectedCat1("");
    setSelectedCat2("");
    setSelectedCat3("");
    setSelectedCat4("");
    setSelectedCat5("");
    setSelectedCat6("");
    setResultText("");
    setPatrolText("");
    setScreenState("start");

    const cats = await clangenRunner.getPatrollableCats();
    const info = await clangenRunner.getClanInfo();

    setPossibleCats(cats);
    setClanInfo(info);
  }

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    document.title = "Patrols | Clangen Simulator";
  }, []);

  async function startPatrol() {
    try {
      const p = await clangenRunner.startPatrol(selectedCats, patrolType);
      setPatrolText(p.text);
      setCanAntagonize(p.canAntagonize);
      setPatrolUuid(p.uuid);
      setResultText("");
      setScreenState("in-progress");
    } catch (exception) {
      alert(exception);
      reset();
    }
  }

  async function endPatrol(action: PatrolAction) {
    const [outcomeText, outcomeResult] =
      await clangenRunner.finishPatrol(patrolUuid, action);
    setPatrolText(outcomeText);
    setResultText(outcomeResult);
    setScreenState("wrap-up");
  }

  if (possibleCats.length <= 0) {
    return (
      <BasePage crumbs={crumbs}>
        <img style={{ imageRendering: "pixelated" }} src={confusedCat}></img>

        <p>
          No cats in the Clan can currently patrol. Cats without major injuries
          or illnesses can patrol once every moon.
        </p>
      </BasePage>
    );
  }

  return (
    <BasePage crumbs={crumbs}>
      <p>
        If a medicine cat or medicine cat apprentice is added to the patrol, the
        selected patrol type will be ignored, and the patrol will automatically
        become a herb gathering patrol.
      </p>

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
        <div className="radio-row">
          <input
            tabIndex={0}
            id="hunt-radio"
            name="patrol-type"
            type="radio"
            disabled={disabled}
            checked={patrolType === "hunting"}
            onChange={() => setPatrolType("hunting")}
          />
          <label htmlFor="hunt-radio">Hunting</label>
        </div>

        <div className="radio-row">
          <input
            tabIndex={0}
            id="bord-radio"
            name="patrol-type"
            type="radio"
            disabled={disabled}
            checked={patrolType === "border"}
            onChange={() => setPatrolType("border")}
          />
          <label htmlFor="bord-radio">Border</label>
        </div>

        <div className="radio-row">
          <input
            tabIndex={0}
            id="train-radio"
            name="patrol-type"
            type="radio"
            disabled={disabled}
            checked={patrolType === "training"}
            onChange={() => setPatrolType("training")}
          />
          <label htmlFor="train-radio">Training</label>
        </div>
      </fieldset>

      {clanInfo && clanInfo.gameMode !== "classic" && (
        <>
          <div>Current Food: {clanInfo.freshkill}</div>
          <div>Required Food: {clanInfo.requiredFreshkill}</div>
        </>
      )}

      <p>{patrolText}</p>

      <p>{resultText}</p>

      {screenState === "start" && (
        <button
          tabIndex={0}
          disabled={selectedCats.length == 0}
          onClick={startPatrol}
        >
          Start Patrol
        </button>
      )}

      {screenState === "in-progress" && (
        <div className="button-row">
          <button tabIndex={0} onClick={() => endPatrol("proceed")}>
            Proceed
          </button>
          <button tabIndex={0} onClick={() => endPatrol("decline")}>
            Decline
          </button>
          {canAntagonize && (
            <button tabIndex={0} onClick={() => endPatrol("antag")}>
              Antagonize
            </button>
          )}
        </div>
      )}

      {screenState === "wrap-up" && (
        <>
          <button tabIndex={0} onClick={reset}>
            New Patrol
          </button>
        </>
      )}
    </BasePage>
  );
}

export default PatrolsPage;
