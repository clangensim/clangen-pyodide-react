import { clangenRunner } from "../python/clangen";
import Nav from "../components/Nav";
import { Link } from "react-router";
import CatDisplay from "../components/CatDisplay";

function CatsPage() {
  return (
    <>
      <Nav />
      <div className="list" role="listbox">
        <table className="detailed">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Sprite</th>
              <th>Name</th>
              <th>Age (moons)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clangenRunner.getCats().map((cat) => {
              if (cat.dead || cat.outside) {
                return;
              }
              return (
                <tr>
                  <td>{cat.ID}</td>
                  <td>
                    <CatDisplay pelt={cat.pelt} age={cat.age} />
                  </td>
                  <td>
                    <Link to={`/cats/${cat.ID}`}> {cat.name} </Link>
                  </td>
                  <td> {cat.moons} </td>
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
