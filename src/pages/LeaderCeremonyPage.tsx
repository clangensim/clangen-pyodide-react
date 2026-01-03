import { useEffect, useState } from "react";
import { Cat } from "../python/types";
import BasePage from "../layout/BasePage";
import { clangenRunner } from "../python/clangenRunner";

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
      {ceremony && ceremony.split("<br><br>").map(line => <p>{line}</p>)}
    </BasePage>
  );
}

export default LeaderCeremonyPage;
