import { clangenRunner } from "../python/clangenRunner";
import { Link } from "react-router";
import CatDisplay from "../components/CatDisplay";
import { useEffect, useState } from "react";
import BasePage from "../layout/BasePage";

import "../styles/cats-page.css";
import { Cat } from "../python/types";
import { useQuery } from "@tanstack/react-query";

const crumbs = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/cats",
    label: "Cats",
  },
];

type ScreenState = "starclan" | "dark_forest" | "clan_cats" | "outside_cats" | "unknown_residence";
const selectedButtonClass = "btn-primary"
const deselectedButtonClass = "btn-secondary"

function CatsPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const query = useQuery({
    queryKey: ["claninfo"],
    queryFn: async () => await clangenRunner.getClanInfo(),
  });
  const clanInfo = query.data;


  let showLiving;
  let showDead;
  const [screenState, setScreenState] = useState<ScreenState>("clan_cats");
  if (screenState === "clan_cats" || screenState === "outside_cats") {
    showLiving = true;
    showDead = false;
  } else if (screenState === "starclan" || screenState === "dark_forest" || screenState === "unknown_residence") {
    showLiving = false;
    showDead = true;
  }

  useEffect(() => {
    document.title = "Cats | ClanGen Simulator";
    clangenRunner.getCats().then((c) => setCats(c));
  }, []);

  return (
    <BasePage crumbs={crumbs}>
      <div className="cats-list__nav">
        <div className="button-row" style={{marginLeft: "0.25em"}}>
          { showLiving && 
            <>
              <button className={screenState === "clan_cats" ? selectedButtonClass : deselectedButtonClass} onClick={() => setScreenState("clan_cats")}>{clanInfo ? clanInfo.name : "Clan"}</button>
              <button className={screenState === "outside_cats" ? selectedButtonClass : deselectedButtonClass} onClick={() => setScreenState("outside_cats")}>Cats Outside the Clan</button>
            </>
          }
          { showDead && 
            <>
              <button className={screenState === "starclan" ? selectedButtonClass : deselectedButtonClass} onClick={() => setScreenState("starclan")}>StarClan</button>
              <button className={screenState === "dark_forest" ? selectedButtonClass : deselectedButtonClass} onClick={() => setScreenState("dark_forest")}>Dark Forest</button>
              <button className={screenState === "unknown_residence" ? selectedButtonClass : deselectedButtonClass} onClick={() => setScreenState("unknown_residence")}>Unknown</button>
            </>
          }
        </div>

        <div className="cats-list__nav__toggle-living">
          {showDead && <button onClick={() => { setScreenState("clan_cats") }} className="link-button">Show living</button>}
          {showLiving && <button onClick={() => { setScreenState("starclan") }} className="link-button">Show deceased</button>}
        </div>
      </div>

      <div className="cats-list">
        {cats.map((cat, index) => {
          if (screenState === "dark_forest" && (!cat.dead || !cat.inDarkForest )) {
            return;
          } else if (screenState === "starclan" && (!cat.dead || cat.inDarkForest || cat.outside)) {
            return;
          } else if (screenState === "clan_cats" && (cat.dead || cat.outside)) {
            return;
          } else if (screenState === "outside_cats" && (cat.dead || !cat.outside)) {
            return;
          } else if (screenState === "unknown_residence" && (!cat.dead || cat.inDarkForest || !cat.outside)) {
            return;
          }
          return (
            <Link to={`/cats/${cat.ID}`} tabIndex={0}>
              <div className="cat" key={index}>
                <CatDisplay cat={cat} w="75px" h="75px" />
                <div>{cat.name.display}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </BasePage>
  );
}

export default CatsPage;
