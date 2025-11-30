import { clangenRunner } from "../python/clangenRunner";
import Pluralize from "./generic/Pluralize";
import { useQuery } from "@tanstack/react-query";

function ClanInfoDisplay() {
  const query = useQuery({
    queryKey: ["claninfo"],
    queryFn: async () => await clangenRunner.getClanInfo(),
  });

  const clanInfo = query.data;

  if (query.status === "error") {
    console.error(query.error.message);
  }

  return (
    <div id="clan-info">
      <>
        <div className="clan-name">{clanInfo?.name}</div>
        <div className="clan-moons">{clanInfo?.age} <Pluralize num={clanInfo?.age}>moon</Pluralize></div>
        <div className="clan-season">Season: {clanInfo?.season}</div>
        <div className="clan-gamemode">Game Mode: {clanInfo?.gameMode}</div>
      </>
    </div>
  );
}

export default ClanInfoDisplay;
