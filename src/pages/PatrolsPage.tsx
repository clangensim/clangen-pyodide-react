import { useEffect, useState } from "react";
import { Cat, PatrolAction, PatrolType, ClanInfo } from "../python/types";
import { clangenRunner } from "../python/clangenRunner";
import BasePage from "../layout/BasePage";

import "../styles/patrol-page.css";

import confusedCat from "../assets/images/gen_med_newmed.png";
import { formatText } from "../utils";
import CatDisplay from "../components/CatDisplay";
import CatSearch from "../components/CatSearch";

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

function getPatrolArtPath(type: PatrolType | null, path: string | undefined) {
  if (path) {
    return `patrol_art/${path}.png`;
  }
  let name: string = "bord";

  if (type == "hunting") { name = "hunt" }
  else if (type == "border") { name = "bord" }
  else if (type == "training") { name = "train" }
  else if (type == "med") { name = "med" }

  return `patrol_art/${name}_general_intro.png`;
}

// TODO: switch to reducer
function PatrolsPage() {
  const [patrolText, setPatrolText] = useState("");
  const [canAntagonize, setCanAntagonize] = useState(false);
  const [resultText, setResultText] = useState("");

  const [patrolType, setPatrolType] = useState<PatrolType>("hunting");

  const [possibleCats, setPossibleCats] = useState<Cat[]>([]);

  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const [patrolUuid, setPatrolUuid] = useState("");

  const [clanInfo, setClanInfo] = useState<ClanInfo | null>();

  const [patrolArtUrl, setPatrolArtUrl] = useState("");

  const [screenState, setScreenState] = useState<ScreenState>("start");

  const disabled = screenState !== "start";

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  async function reset() {
    setSelectedCats([]);
    setResultText("");
    setPatrolText("");
    setScreenState("start");
    setPatrolArtUrl("");

    const cats = await clangenRunner.getPatrollableCats();
    const info = await clangenRunner.getClanInfo();

    setPossibleCats(cats);
    setClanInfo(info);
  }

  useEffect(() => {
    reset();
    setIsFirstLoad(false);
  }, []);

  useEffect(() => {
    document.title = "Patrols | ClanGen Simulator";
  }, []);

  async function startPatrol() {
    try {
      const p = await clangenRunner.startPatrol(selectedCats, patrolType);
      setPatrolArtUrl(getPatrolArtPath(patrolType, p.patrolArt));
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
    try {
      const [outcomeText, outcomeResult, art] =
      await clangenRunner.finishPatrol(patrolUuid, action);
      // outcome art is used rarely
      if (art) { setPatrolArtUrl(getPatrolArtPath(null, art)) }
      setPatrolText(outcomeText);
      setResultText(outcomeResult);
      setScreenState("wrap-up");
    } catch (exception: any) {
      alert(exception);
      reset();
    }
  }

  if (isFirstLoad) {
    return (
      <BasePage crumbs={crumbs}>
        <p>Loading...</p>
      </BasePage>
    );
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

      <p>If you edit a cat that is currently on patrol, the patrol will end.</p>

      <fieldset>
        <legend>Possible Cats</legend>
        <CatSearch 
          catsToSearch={possibleCats}
          catsPerPage={16}
          maxSelection={6}
          selectedCats={selectedCats}
          setSelectedCats={setSelectedCats}
        />
      </fieldset>

      <fieldset>
        <legend>Cats to Patrol</legend>
        {selectedCats.length === 0 && <>This patrol group is empty.</>}
        {selectedCats.length !== 0 &&
        <div className="selected-cats-list">
          {possibleCats
          .filter(cat => selectedCats.find(id => id == cat.ID))
          .map((cat, index) => {
            return (
              <div className="cat" key={index}>
                <CatDisplay cat={cat} w="50px" h="50px" />
                <div>{cat.name.display}</div>
                <div className="cat-search-select-status">{cat.status}</div>
              </div>
            );
          })}
          </div>
        }
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

      {patrolArtUrl && 
        <img src={patrolArtUrl}></img>
      }

      <p>{formatText(patrolText)}</p>

      <p>{formatText(resultText)}</p>

      {screenState === "start" && (
        <div>
          <button
            tabIndex={0}
            disabled={selectedCats.length == 0}
            onClick={startPatrol}
          >
            Start Patrol
          </button>
        </div>
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
