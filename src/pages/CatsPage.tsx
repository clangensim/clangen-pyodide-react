import { clangenRunner } from "../python/clangen";
import Navbar from "../components/Navbar";
import { Link } from "react-router";
import CatDisplay from "../components/CatDisplay";
import Breadcrumbs from "../components/Breadcrumbs";
import { useEffect, useState } from "react";
import Checkbox from "../components/Checkbox";

function CatsPage() {
  const [showLiving, setShowLiving] = useState(true);
  const [showDead, setShowDead] = useState(false);
  const [showOutside, setShowOutside] = useState(false);

  useEffect(() => {
    document.title = "Cats | Clangen Simulator";
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumbs
        crumbs={[
          {
            url: "/",
            label: "Home",
          },
          {
            url: "/cats",
            label: "Cats",
          },
        ]}
      />

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

      <div className="list" role="listbox">
        <table className="detailed">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Sprite</th>
              <th>Name</th>
              <th>Age (moons)</th>
              <th>Trait</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
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
                <tr key={index}>
                  <td>{cat.ID}</td>
                  <td>
                    <CatDisplay
                      pelt={cat.pelt}
                      age={cat.age}
                      dead={cat.dead}
                      darkForest={cat.inDarkForest}
                    />
                  </td>
                  <td>
                    <Link tabIndex={0} to={`/cats/${cat.ID}`}>
                      {" "}
                      {cat.name.display}{" "}
                    </Link>
                  </td>
                  <td> {cat.moons} </td>
                  <td>{cat.trait}</td>
                  <td>{cat.status} </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CatsPage;
