import { clangenRunner } from "../python/clangen"
import Nav from "../components/Nav";
import { Link } from "react-router";

function CatsPage() {

  return (<>
    <Nav />
    <ul>
      { clangenRunner.getCats().map((cat) => {
        return (
          <li>
            <Link to={`/cats/${cat.ID}`}>{cat.name} ({cat.ID})</Link>
          </li>
        )
      }) }
    </ul>
  </>)
}

export default CatsPage;
