import { useState } from "react";
import { clangenRunner } from "../python/clangen";

function EventsPage() {

  const [events, setEvents] = useState<Array<any>>();

  function handleMoonskip() {
    clangenRunner.moonskip();
    setEvents(clangenRunner.getEvents());
  };

  return (
    <>
      <button onClick={handleMoonskip}>Moonskip</button>
      <ul>
        {events?.map((obj, i) => {
          return <li key={i}>{obj.text}</li>;
        })}
      </ul>
    </>
  )
}

export default EventsPage;