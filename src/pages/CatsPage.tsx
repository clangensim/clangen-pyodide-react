import { clangenRunner } from "../python/clangen"
import Nav from "../components/Nav";

function CatsPage() {

  return (<>
    <Nav />
    <ul>
      { clangenRunner.getCats().map((cat) => {
        return (
          <li>
            {cat.name} ({cat.ID})
          </li>
        )
      }) }
    </ul>
  </>)
}

export default CatsPage;
