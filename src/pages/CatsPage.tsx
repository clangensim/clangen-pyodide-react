import { clangenRunner } from "../python/clangen"
import Nav from "../components/Nav";
import { Link } from "react-router";
import CatDisplay from "../components/CatDisplay";

function CatsPage() {

  return (<>
    <Nav />
    <ul>
      { clangenRunner.getCats().map((cat) => {
        return (
          <li>
            <CatDisplay pelt={cat.pelt} age={cat.age}/>
            <Link to={`/cats/${cat.ID}`}> { cat.name } </Link>
          </li>
        )
      }) }
    </ul>
  </>)
}

export default CatsPage;
