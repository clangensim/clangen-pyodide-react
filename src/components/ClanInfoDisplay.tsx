import { useEffect, useState } from "react";
import { clangenRunner, ClanInfo } from "../python/clangen";

function ClanInfoDisplay() {
  const [clanInfo, setClanInfo] = useState<ClanInfo>();

  useEffect(() => {
    setClanInfo(clangenRunner.getClanInfo());
  }, []);

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
