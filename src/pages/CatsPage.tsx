import { clangenRunner } from "../python/clangenRunner";
import { Link } from "react-router";
import CatDisplay from "../components/CatDisplay";
import { useEffect, useState } from "react";
import Checkbox from "../components/generic/Checkbox";
import BasePage from "../layout/BasePage";

import "../styles/cats-page.css";
import { Cat } from "../python/types";

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

function CatsPage() {
  const [showLiving, setShowLiving] = useState(true);
  const [showDead, setShowDead] = useState(false);
  const [showOutside, setShowOutside] = useState(false);
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    document.title = "Cats | ClanGen Simulator";
    clangenRunner.getCats().then((c) => setCats(c));
  }, []);

  return (
    <BasePage crumbs={crumbs}>
      <Checkbox
        label="Show living"
        checked={showLiving}
        onChange={() => setShowLiving(!showLiving)}
      />
      <Checkbox
        label="Show deceased"
        checked={showDead}
        onChange={() => setShowDead(!showDead)}
      />
      <Checkbox
        label="Show cats outside the Clan"
        checked={showOutside}
        onChange={() => setShowOutside(!showOutside)}
      />
      <div className="cats-list">
        {cats.map((cat, index) => {
          if (cat.dead && !showDead) {
            return;
          }
          if (!cat.dead && !showLiving) {
            return;
          }
          if (cat.outside && !showOutside) {
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
