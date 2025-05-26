import { useEffect, useState } from "react";
import { clangenRunner } from "../python/clangenRunner";
import Checkbox from "../components/generic/Checkbox";
import BasePage from "../layout/BasePage";
import { useQuery } from "@tanstack/react-query";

import { formatText } from "../utils";

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

  const [showRelEvents, setShowRelEvents] = useState(false);
  const [showRegEvents, setShowRegEvents] = useState(true);

  useEffect(() => {
    document.title = "Events | ClanGen Simulator";
  }, []);

  const regularEvents = events?.filter(
    (event) => !event.types.includes("interaction"),
  );

  let eventsDisplay;
  if (regularEvents !== undefined) {
    if (regularEvents.length === 0 && showRegEvents && !showRelEvents) {
      eventsDisplay = <li>Nothing interesting happened this moon.</li>;
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
            return <li key={i}>{formatText(event.text)}</li>;
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

      <ul>{eventsDisplay}</ul>
    </BasePage>
  );
}

export default EventsPage;
