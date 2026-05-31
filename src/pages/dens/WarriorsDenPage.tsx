import { useEffect, useState } from "react";
import focusImage from "../../assets/images/usual_focus.png";

import Radiobox from "../../components/generic/Radiobox";
import BasePage from "../../layout/BasePage";
import { clangenRunner } from "../../python/clangenRunner";
import { OtherClan } from "../../python/types";
import Checkbox from "../../components/generic/Checkbox";
import Pluralize from "../../components/generic/Pluralize";
import useClanInfo from "../../hooks/useClanInfo";

const crumbs = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/dens",
    label: "Dens",
  },
  {
    url: "/warriors-den",
    label: "Warriors Den",
  },
];

const focuses = {
  "business as usual": {
    name: "Business as Usual",
    description: "The Clan has no specific focus and won't get any bonuses.",
    otherClans: false,
    classic: true,
  },
  hunting: {
    name: "Feeding the Clan",
    description:
      "The Clan will focus on hunting. Warriors and their apprentices will gather additional prey on each moonskip.",
    otherClans: false,
    classic: false,
  },
  "herb gathering": {
    name: "Assisting with Herb Gathering",
    description:
      "The Clan will focus on herb gathering. Medicine cats and their apprentices will gather additional herbs on each moonskip due to extra help from the warriors.",
    otherClans: false,
    classic: false,
  },
  "threaten outsiders": {
    name: "Threatening Outsiders",
    description:
      "The relationship with cats outside of the Clan decreases due to intentionally threatening behavior from your warriors.",
    otherClans: false,
    classic: true,
  },
  "seek outsiders": {
    name: "Entreating with Outsiders",
    description:
      "The relationship with cats outside of the Clan increases as your warriors make efforts to sow seeds of friendship.",
    otherClans: false,
    classic: true,
  },
  "rest and recover": {
    name: "Resting and Recovering",
    description:
      "The Clan will take more care and time in their tasks and therefore the rate of injuries, illnesses and outbreaks will be reduced.",
    otherClans: false,
    classic: true,
  },
  hoarding: {
    name: "Hoarding Resources",
    description:
      "Your warriors begin stockpiling as many resources as they can get their paws on, regardless of their own safety. Prey and herbs will increase each moonskip, but injuries and illnesses will also increase.",
    otherClans: false,
    classic: false,
  },
  "sabotage other clans": {
    name: "Sabotaging Other Clans",
    description:
      "Your mediator and warriors work together to undermine the other Clans.",
    otherClans: true,
    classic: true,
  },
  "aid other clans": {
    name: "Helping Other Clans",
    description:
      "Your mediator and warriors work together to help the other Clans with whatever they need.",
    otherClans: true,
    classic: true,
  },
  "raid other clans": {
    name: "Raiding Other Clans",
    description:
      "Your warriors begin crossing borders for resources. Prey and herbs will greatly increase each moonskip, but injuries and illnesses will increase and the relationship with other Clans decrease.",
    otherClans: true,
    classic: false,
  },
};

function WarriorsDenPage() {
  const [selectedFocus, setSelectedFocus] =
    useState<keyof typeof focuses>("business as usual");
  const [otherClans, setOtherClans] = useState<OtherClan[]>([]);
  const [targettedOtherClans, setTargettedOtherClans] = useState<Set<string>>(
    new Set(),
  );
  const [nextFocusChange, setNextFocusChange] = useState<number>(0);
  const clanInfo = useClanInfo();

  const canChangeFocus = nextFocusChange <= 0;

  useEffect(() => {
    document.title = "Warrior's Den | ClanGen Simulator";
    clangenRunner.getOtherClans().then((oc) => setOtherClans(oc));
    clangenRunner
      .getFocus()
      .then((f) => setSelectedFocus(f as keyof typeof focuses));
    clangenRunner.nextFocusChange().then((n) => setNextFocusChange(n));
    clangenRunner
      .getTargettedClans()
      .then((c) => setTargettedOtherClans(new Set(c)));
  }, []);

  function handleSubmit() {
    clangenRunner.setFocus(selectedFocus, Array.from(targettedOtherClans));
    clangenRunner.nextFocusChange().then((n) => setNextFocusChange(n));
  }

  function submitEnabled() {
    if (!canChangeFocus) { return false }
    if (selectedFocus !== undefined && focuses[selectedFocus].otherClans) {
      if (targettedOtherClans.size === 0) {
        return false;
      }
    }
    return true;
  }

  return (
    <BasePage crumbs={crumbs}>
      <>
        <img
          style={{
            objectFit: "none",
            height: "150px",
            width: "275px",
            objectPosition: "0 0",
            imageRendering: "pixelated",
          }}
          src={focusImage}
        />

        <p>
          Warriors can be managed by giving them a <b>focus</b> to prioritize.
          The focus can be changed once every three moons.
        </p>

        {!canChangeFocus && (
          <p>
            {clanInfo.data?.name}'s focus can be changed in {nextFocusChange}{" "}
            <Pluralize num={nextFocusChange}>moon</Pluralize>.
          </p>
        )}

        <fieldset>
          <legend>Focus</legend>
          {Object.entries(focuses)
            .filter(
              ([_, focusData]) =>
                (clanInfo.data?.gameMode === "classic" && focusData.classic) ||
                clanInfo.data?.gameMode !== "classic",
            )
            .map(([focusID, focusData]) => (
              <Radiobox
                label={
                  <>
                    <b>{focusData.name}</b> - {focusData.description}{" "}
                  </>
                }
                key={focusID}
                value={focusID}
                name="focuses"
                checked={focusID == selectedFocus}
                disabled={!canChangeFocus}
                onChange={() =>
                  setSelectedFocus(focusID as keyof typeof focuses)
                }
              />
            ))}
        </fieldset>

        {selectedFocus !== undefined && focuses[selectedFocus].otherClans && (
          <fieldset>
            <legend>Clans to Target</legend>

            {otherClans.map((v) => (
              <Checkbox
                label={`${v.name}Clan`}
                checked={targettedOtherClans.has(v.name)}
                disabled={!canChangeFocus}
                key={v.name}
                onChange={() => {
                  if (targettedOtherClans.has(v.name)) {
                    const newSet = new Set(targettedOtherClans);
                    newSet.delete(v.name);
                    setTargettedOtherClans(newSet);
                  } else {
                    setTargettedOtherClans(
                      new Set(targettedOtherClans).add(v.name),
                    );
                  }
                }}
              />
            ))}
          </fieldset>
        )}

        <button
          className="submit"
          disabled={!submitEnabled()}
          onClick={handleSubmit}
          tabIndex={0}
        >
          Submit
        </button>
      </>
    </BasePage>
  );
}

export default WarriorsDenPage;
