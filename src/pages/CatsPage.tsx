import { clangenRunner } from "../python/clangen"

function CatsPage() {

  return (
    <ul>
      { clangenRunner.getCats().map((cat) => {
        return (
          <li>
            {cat.name} ({cat.ID})
          </li>
        )
      }) }
    </ul>
  )
}

export default CatsPage;
