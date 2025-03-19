import { clangenRunner } from "../python/clangen";
import { useQuery } from "@tanstack/react-query";

function ClanInfoDisplay() {
  const query = useQuery({
    queryKey: ["claninfo"],
    queryFn: clangenRunner.getClanInfo.bind(clangenRunner),
  });

  const clanInfo = query.data;

  if (query.status === "error") {
    console.error(query.error.message);
  }

  return (
    <div id="clan-info">
      <>
        <div className="clan-name">{clanInfo?.name}</div>
        <div className="clan-moons">{clanInfo?.age} moon(s)</div>
        <div className="clan-season">Season: {clanInfo?.season}</div>
        <div className="clan-gamemode">Game Mode: {clanInfo?.gameMode}</div>
      </>
    </div>
  );
}

export default ClanInfoDisplay;
