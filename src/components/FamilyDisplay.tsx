import { Link } from "react-router";
import { Family } from "../python/types";
import CatDisplay from "./CatDisplay";
import "../styles/family.css";

function FamilyDisplay({ family }: { family: Family }) {
  return (
    <>
      <div className="family__section">
        <div className="family__section__title">
          Parents:
        </div>
        <div className="family__section__cats">
          {family.parents.length === 0 && <>This cat's parents are unknown.</>}
          {family.parents.map((p) =>
            <Link className="family__section__cat" to={`/cats/${p.ID}`}>
              <CatDisplay cat={p} />
              {p.name.display}
            </Link>
          )}
        </div>
      </div>

      <div className="family__section">
        <div className="family__section__title">
          Siblings:
        </div>
        <div className="family__section__cats">
          {family.siblings.length === 0 && <>This cat has no siblings.</>}
          {family.siblings.map((p) =>
            <Link className="family__section__cat" to={`/cats/${p.ID}`}>
              <CatDisplay cat={p} />
              {p.name.display}
            </Link>
          )}
        </div>
      </div>

      <div className="family__section">
        <div className="family__section__title">
          Children:
        </div>
        <div className="family__section__cats">
          {family.children.length === 0 && <>This cat has no children.</>}
          {family.children.map((p) =>
            <Link className="family__section__cat" to={`/cats/${p.ID}`}>
              <CatDisplay cat={p} />
              {p.name.display}
            </Link>
          )}
        </div>
      </div>

    </>
  )
}

export default FamilyDisplay;