import { clangenRunner } from "../python/clangen";
import Navbar from "../components/Navbar";
import { Link } from "react-router";
import CatDisplay from "../components/CatDisplay";
import Breadcrumbs from "../components/Breadcrumbs";

function CatsPage() {
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
              if (cat.dead || cat.outside) {
                return;
              }
              return (
                <tr key={index}>
                  <td>{cat.ID}</td>
                  <td>
                    <CatDisplay pelt={cat.pelt} age={cat.age} />
                  </td>
                  <td>
                    <Link tabIndex={0} to={`/cats/${cat.ID}`}> {cat.name.display} </Link>
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
