import { useEffect, useState } from "react";
import { clangenRunner } from "../python/clangen";
import Nav from "../components/Nav";

function EventsPage() {
  const [events, setEvents] = useState<Array<any>>();
  const [clanAge, setClanAge] = useState<Number>(0);

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
      <Nav />
      <div>{clanAge.toString()} Moons</div>
      <button onClick={handleMoonskip}>Moonskip</button>
      <ul>
        {events?.map((event, i) => {
          if (!event.types.includes("interaction")) {
            return <li key={i}>{event.text}</li>;
          }
        })}
      </ul>
    </>
  );
}

export default EventsPage;
