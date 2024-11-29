import { useState } from "react";
import { clangenRunner } from "../python/clangen";
import Nav from "../components/Nav";

function EventsPage() {

  const [events, setEvents] = useState<Array<any>>();

  function handleMoonskip() {
    clangenRunner.moonskip();
    setEvents(clangenRunner.getEvents());
  };

  return (
    <>
      <Nav />
      <button onClick={handleMoonskip}>Moonskip</button>
      <ul>
        {events?.map((event, i) => {
          if (!event.types.includes('interaction')) {
            return <li key={i}>{event.text}</li>;
          }
        })}
      </ul>
    </>
  )
}

export default EventsPage;