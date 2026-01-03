import { useEffect, useState } from "react";
import BasePage from "../layout/BasePage";
import { Cat } from "../python/types";
import { clangenRunner } from "../python/clangenRunner";

import "../styles/allegiances-page.css";
import { useQuery } from "@tanstack/react-query";
import Pluralize from "../components/generic/Pluralize";
import { TbPrinter } from "react-icons/tb";

const crumbs = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/allegiances",
    label: "Allegiances",
  },
];

function AllegiancesPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const leader = cats.filter((c) => c.status === "leader");
  const deputy = cats.filter((c) => c.status === "deputy");
  const warriors = cats.filter((c) => c.status === "warrior");
  const medCats = cats.filter((c) => c.status === "medicine cat");
  const mediators = cats.filter((c) => c.status === "mediator");
  const kits = cats.filter(
    (c) => c.status === "kitten" || c.status === "newborn",
  );
  const elders = cats.filter((c) => c.status === "elder");

  // TODO: queens

  const query = useQuery({
    queryKey: ["claninfo"],
    queryFn: async () => await clangenRunner.getClanInfo(),
  });
  const clanInfo = query.data;

  useEffect(() => {
    document.title = "Allegiances | ClanGen Simulator";
    clangenRunner.getCats().then((c) => setCats(c));
  }, []);

  return (
    <>
      <BasePage crumbs={crumbs}>
        <button className="icon-button" tabIndex={0} onClick={() => window.print()}>
          <TbPrinter size={25} />
        </button>

        <div id="allegiances">
          <div className="allegiances__descriptions">
            <div></div>
            <div className="allegiances__clanname">{clanInfo?.name}</div>

            {leader.length > 0 && (
              <>
                <div className="allegiances__rank">Leader</div>
                <div className="allegiances__cats">
                  {leader.map((c) => (
                    <>
                      <div className="allegiances__entry">
                        <span className="allegiances__name">
                          {c.name.display} —{" "}
                        </span>
                        {c.description}
                      </div>
                      {c.apprentices.map((app) => (
                        <div className="allegiances__entry">
                          <span className="allegiances__name">
                            Apprentice, {app.name.display}{" "}
                          </span>
                          ({app.description})
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </>
            )}

            {deputy.length > 0 && (
              <>
                <div className="allegiances__rank">Deputy</div>
                <div className="allegiances__cats">
                  {deputy.map((c) => (
                    <>
                      <div className="allegiances__entry">
                        <span className="allegiances__name">
                          {c.name.display} —{" "}
                        </span>
                        {c.description}
                      </div>
                      {c.apprentices.map((app) => (
                        <div className="allegiances__entry">
                          <span className="allegiances__name">
                            Apprentice, {app.name.display}{" "}
                          </span>
                          ({app.description})
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </>
            )}

            {medCats.length > 0 && (
              <>
                <div className="allegiances__rank">
                  <Pluralize num={medCats.length}>Medicine Cat</Pluralize>
                </div>
                <div className="allegiances__cats">
                  {medCats.map((c) => (
                    <>
                      <div className="allegiances__entry">
                        <span className="allegiances__name">
                          {c.name.display} —{" "}
                        </span>
                        {c.description}
                      </div>
                      {c.apprentices.map((app) => (
                        <div className="allegiances__entry">
                          <span className="allegiances__name">
                            Apprentice, {app.name.display}{" "}
                          </span>
                          ({app.description})
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </>
            )}

            {mediators.length > 0 && (
              <>
                <div className="allegiances__rank">
                  <Pluralize num={mediators.length}>Mediator</Pluralize>
                </div>
                <div className="allegiances__cats">
                  {mediators.map((c) => (
                    <>
                      <div className="allegiances__entry">
                        <span className="allegiances__name">
                          {c.name.display} —{" "}
                        </span>
                        {c.description}
                      </div>
                      {c.apprentices.map((app) => (
                        <div className="allegiances__entry">
                          <span className="allegiances__name">
                            Apprentice, {app.name.display}{" "}
                          </span>
                          ({app.description})
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </>
            )}

            {warriors.length > 0 && (
              <>
                <div className="allegiances__rank">
                  <Pluralize num={warriors.length}>Warrior</Pluralize>
                </div>
                <div className="allegiances__cats">
                  {warriors.map((c) => (
                    <>
                      <div
                        className={
                          c.apprentices.length === 0
                            ? "allegiances__entry"
                            : "allegiances__entry_app"
                        }
                      >
                        <span className="allegiances__name">
                          {c.name.display} —{" "}
                        </span>
                        {c.description}
                      </div>
                      {c.apprentices.map((app) => (
                        <div className="allegiances__entry">
                          <span className="allegiances__name">
                            Apprentice, {app.name.display}{" "}
                          </span>
                          ({app.description})
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </>
            )}

            {elders.length > 0 && (
              <>
                <div className="allegiances__rank">
                  <Pluralize num={elders.length}>Elder</Pluralize>
                </div>
                <div className="allegiances__cats">
                  {elders.map((c) => (
                    <div className="allegiances__entry">
                      <span className="allegiances__name">
                        {c.name.display} —{" "}
                      </span>
                      {c.description}
                    </div>
                  ))}
                </div>
              </>
            )}

            {kits.length > 0 && (
              <>
                <div className="allegiances__rank">
                  <Pluralize num={kits.length}>Kit</Pluralize>
                </div>
                <div className="allegiances__cats">
                  {kits.map((c) => (
                    <div className="allegiances__entry">
                      <span className="allegiances__name">
                        {c.name.display} —{" "}
                      </span>
                      {c.description}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </BasePage>
    </>
  );
}

export default AllegiancesPage;
