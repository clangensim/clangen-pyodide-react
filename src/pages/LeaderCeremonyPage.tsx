import { useEffect, useState } from "react";
import { Cat } from "../python/types";
import BasePage from "../layout/BasePage";
import { clangenRunner } from "../python/clangenRunner";
import CatDisplay from "../components/CatDisplay";

import "../styles/ceremony-page.css";

const crumbs = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/ceremony",
    label: "Ceremony",
  },
];

function LeaderCeremonyPage() {
  const [leader, setLeader] = useState<Cat>();
  const [ceremony, setCeremony] = useState<string>();

  function getLeaderAndCeremony() {
    clangenRunner.getCats().then(cats => setLeader(cats.filter(cat => cat.status == "leader")[0]));
    clangenRunner.getLeaderCeremony().then((cere) => setCeremony(cere));
  }

  useEffect(() => {
    getLeaderAndCeremony();
    document.title = "Leader Ceremony | ClanGen Simulator";
    localStorage.removeItem("newCeremony");
  }, []);

  return (
    <BasePage crumbs={crumbs}>
      {leader && 
        <div className="ceremony-container">
            <div>
                <CatDisplay cat={leader} w="100px" h="100px" />
                <div>{leader.name.display}'s Ceremony</div>
            </div>
            <div>
                {ceremony && ceremony.split("<br><br>").map(line => <p>{line}</p>)}
            </div>
        </div> || 
        <p>Your clan doesn't have a leader!</p>
      }
    </BasePage>
  );
}

export default LeaderCeremonyPage;
