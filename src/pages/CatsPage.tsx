import { clangenRunner } from "../python/clangen"
import Nav from "../components/Nav";
import { Link } from "react-router";
import CatDisplay from "../components/CatDisplay";

function CatsPage() {

  return (<>
    <Nav />
    <div className="list" role="listbox">
      <table className="detailed" >
        <thead>
          <th>ID</th>
          <th>Sprite</th>
          <th>Name</th>
        </thead>
        <tbody>
          { clangenRunner.getCats().map((cat) => {
            return (
              <tr>
                <td>{cat.ID}</td>
                <td><CatDisplay pelt={cat.pelt} age={cat.age}/></td>
                <td><Link to={`/cats/${cat.ID}`}> { cat.name } </Link></td>
              </tr>
            )
          }) }
        </tbody>
      </table>
    </div>
  </>)
}

export default CatsPage;
