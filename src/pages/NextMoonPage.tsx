import { clangenRunner } from "../python/clangenRunner";
import { useEffect, useState } from "react";
import BasePage from "../layout/BasePage";

import nextMoonImage from "../assets/images/pln_no_UFO.png";
import { Cat } from "../python/types";
import Pluralize from "../components/generic/Pluralize";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function NextMoonPage() {
  const queryClient = useQueryClient();
  const clanInfoQuery = useQuery({
    queryKey: ["claninfo"],
    queryFn: async () => clangenRunner.getClanInfo(),
  });
  const clanInfo = clanInfoQuery.data;

  const [canPatrol, setCanPatrol] = useState<Cat[]>([]);
  const [canMediate, setCanMediate] = useState<Cat[]>([]);

  useEffect(() => {
    document.title = "Clangen Simulator";
    clangenRunner.getPatrollableCats().then((c) => setCanPatrol(c));
    clangenRunner.getPossibleMediators().then((c) => setCanMediate(c));
  }, []);

  function handleMoonskip() {
    clangenRunner.moonskip().then(() => {
      clangenRunner.getPatrollableCats().then((c) => setCanPatrol(c));
      clangenRunner.getPossibleMediators().then((c) => setCanMediate(c));  
      queryClient.invalidateQueries()
  });
  }

  return (
    <BasePage>
      <img style={{imageRendering: "pixelated"}} src={nextMoonImage}></img>

      <p>It has been <b>{clanInfo?.age} moons</b> since {clanInfo?.name} was founded. The current season is <b>{clanInfo?.season}</b>.</p>

      {canPatrol.length > 0 && 
        <p>{canPatrol.length} <Pluralize num={canPatrol.length}>cat</Pluralize> can still patrol this moon.</p>
      }
      {canMediate.length > 0 && 
        <p>{canMediate.length} <Pluralize num={canMediate.length}>mediator</Pluralize> can still mediate this moon.</p>
      }

      {clanInfo?.gameMode !== "classic" &&
        <p>
          Current Food: {clanInfo?.freshkill} <br />
          Food Required to Feed Everyone: {clanInfo?.requiredFreshkill}
        </p>
      }

      <button onClick={handleMoonskip}>Timeskip One Moon</button>
    </BasePage>
  );
}

export default NextMoonPage;
