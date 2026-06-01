import useClanInfo from "../hooks/useClanInfo";
import Pluralize from "./generic/Pluralize";

function ClanInfoDisplay() {
  const query = useClanInfo();

  const clanInfo = query.data;

  if (query.status === "error") {
    console.error(query.error.message);
  }

  return (
    <div id="clan-info">
      <>
        <div className="clan-name">{clanInfo?.name}</div>
        <div className="clan-moons">
          {clanInfo?.age} <Pluralize num={clanInfo?.age}>moon</Pluralize>
        </div>
        <div className="clan-season">Season: {clanInfo?.season}</div>
        <div className="clan-gamemode">Game Mode: {clanInfo?.gameMode}</div>
      </>
    </div>
  );
}

export default ClanInfoDisplay;
