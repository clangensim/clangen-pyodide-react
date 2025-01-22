import { useEffect, useState } from "react";
import { clangenRunner } from "../python/clangen";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";

function EventsPage() {
  const [events, setEvents] = useState<Array<any>>();
  const [clanAge, setClanAge] = useState<Number>(0);

  const regularEvents = events?.filter(
    (event) => !event.types.includes("interaction"),
  );

  var eventsDisplay;
  if (regularEvents !== undefined) {
    if (regularEvents.length === 0) {
      eventsDisplay = <li>Nothing interesting happened this moon.</li>;
    } else {
      eventsDisplay = (
        <>
          {regularEvents?.map((event, i) => {
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
    <>
      <Navbar />
      <Breadcrumbs
        crumbs={[
          {
            url: "/",
            label: "Home",
          },
          {
            url: "/events",
            label: "Events",
          },
        ]}
      />

      <div>{clanAge.toString()} Moons</div>
      <button tabIndex={0} onClick={handleMoonskip}>Moonskip</button>
      <ul>{eventsDisplay}</ul>
    </>
  );
}

export default EventsPage;
