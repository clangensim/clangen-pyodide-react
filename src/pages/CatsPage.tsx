import { clangenRunner } from "../python/clangenRunner";
import { Link } from "react-router";
import CatDisplay from "../components/CatDisplay";
import { useEffect, useState } from "react";
import Checkbox from "../components/Checkbox";
import BasePage from "../layout/BasePage";

import "../styles/cats-page.css";

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

  useEffect(() => {
    document.title = "Cats | Clangen Simulator";
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
        {clangenRunner.getCats().map((cat, index) => {
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
            <Link to={`/cats/${cat.ID}`}>
              <div className="cat" key={index}>
                <CatDisplay
                  cat={cat}
                  w="75px"
                  h="75px"
                />
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
