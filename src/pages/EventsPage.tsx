import { useEffect, useState } from "react";
import { clangenRunner } from "../python/clangenRunner";
import Checkbox from "../components/generic/Checkbox";
import BasePage from "../layout/BasePage";
import { useQuery } from "@tanstack/react-query";

import { formatText } from "../utils";

import "../styles/events-page.css";
import CatDisplay from "../components/CatDisplay";
import { Cat } from "../python/types";
import { Link } from "react-router";

const crumbs = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/events",
    label: "Events",
  },
];

function EventsPage() {
  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: async () => clangenRunner.getEvents(),
  });

  const events = eventsQuery.data === undefined ? [] : eventsQuery.data;
  const [cats, setCats] = useState<Record<string,Cat>>();

  const [showRelEvents, setShowRelEvents] = useState(false);
  const [showRegEvents, setShowRegEvents] = useState(true);

  useEffect(() => {
    clangenRunner.getCats().then((c) => {
      const temp: Record<string, Cat> = {};
      for (const cat of c) {
        temp[cat.ID] = cat;
      }
      return temp;
    }).then((c) => setCats(c));
  }, []);

  useEffect(() => {
    document.title = "Events | ClanGen Simulator";
  }, []);

  const regularEvents = events?.filter(
    (event) => !event.types.includes("interaction"),
  );

  let eventsDisplay;
  if (regularEvents !== undefined) {
    if (regularEvents.length === 0 && showRegEvents && !showRelEvents) {
      eventsDisplay = <li className="event-display">Nothing interesting happened this moon.</li>;
    } else {
      eventsDisplay = (
        <>
          {events.map((event, i) => {
            if (!showRelEvents && event.types.includes("interaction")) {
              return;
            }
            if (!showRegEvents && !event.types.includes("interaction")) {
              return;
            }
            return <li className="event-display" key={i}>
              <div className="event-display__text">{formatText(event.text)}</div>
              {event.cats_involved.length > 0 && cats &&
                <div className="event-display__cats">
                  {event.cats_involved.map((ID) => 
                    <Link to={`/cats/${ID}`}>
                      <CatDisplay fuzzy={true} w="35px" h="35px" cat={cats[ID]} />
                    </Link>
                  )}
                </div>
              }
            </li>
          })}
        </>
      );
    }
  }

  return (
    <BasePage crumbs={crumbs}>
      <Checkbox
        label="Show regular events"
        checked={showRegEvents}
        onChange={() => setShowRegEvents(!showRegEvents)}
      />
      <Checkbox
        label="Show relationship events"
        checked={showRelEvents}
        onChange={() => setShowRelEvents(!showRelEvents)}
      />

      <ul className="row-list">{eventsDisplay}</ul>
    </BasePage>
  );
}

export default EventsPage;
