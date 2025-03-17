import { useEffect, useState } from "react";
import { clangenRunner, Event } from "../python/clangen";
import Checkbox from "../components/Checkbox";
import BasePage from "../layout/BasePage";

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
  const [events, setEvents] = useState<Event[]>([]);
  const [clanAge, setClanAge] = useState<Number>(0);

  const [showRelEvents, setShowRelEvents] = useState(false);
  const [showRegEvents, setShowRegEvents] = useState(true);

  useEffect(() => {
    document.title = "Events | Clangen Simulator";
  }, []);

  const regularEvents = events?.filter(
    (event) => !event.types.includes("interaction"),
  );

  var eventsDisplay;
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
            return <li key={i}>{event.text}</li>;
          })}
        </>
      );
    }
  }

  function handleMoonskip() {
    clangenRunner.moonskip().then(() => {
      setEvents(clangenRunner.getEvents());
      setClanAge(clangenRunner.getClanAge());
    });
  }

  useEffect(() => {
    setClanAge(clangenRunner.getClanAge());
    setEvents(clangenRunner.getEvents());
  }, []);

  return (
    <BasePage
      crumbs={crumbs}>
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

      <div>{clanAge.toString()} Moons</div>
      <button tabIndex={0} onClick={handleMoonskip}>
        Moonskip
      </button>
      <ul>{eventsDisplay}</ul>
    </BasePage>
  );
}

export default EventsPage;
