import { Link } from "react-router";
import { Relationship } from "../python/types";
import CatDisplay from "./CatDisplay";
import ProgressBar from "./generic/ProgressBar";
import { TbFileDots } from "react-icons/tb";

// TODO: switch alert to Dialog
function RelationshipDisplay({ relationship }: { relationship: Relationship }) {
  return (
    <div className="raised">
      <Link to={`/cats/${relationship.cat_to_id}`}>
        <CatDisplay cat={relationship.cat_to}/>
        {relationship.cat_to.name.display}
      </Link>
      {" "}
      <button onClick={() => {
        if (relationship.log.length === 0) { alert("No relationship log found.") }
        else { alert(relationship.log.join("\n\n")) }
      }} className="icon-button">
        <TbFileDots />
      </button>
      <ul className="row-list">
        <li>
          romantic love
          <ProgressBar value={relationship.romantic_love.valueOf()} />
        </li>
        <li>
          platonic like
          <ProgressBar value={relationship.platonic_like.valueOf()} />
        </li>
        <li>
          dislike
          <ProgressBar value={relationship.dislike.valueOf()} />
        </li>
        <li>
          admiration
          <ProgressBar value={relationship.admiration.valueOf()} />
        </li>
        <li>
          comfort
          <ProgressBar value={relationship.comfortable.valueOf()} />
        </li>
        <li>
          jealousy
          <ProgressBar value={relationship.jealousy.valueOf()} />
        </li>
        <li>
          trust
          <ProgressBar value={relationship.trust.valueOf()} />
        </li>
      </ul>
    </div>
  );
}

function RelationshipsDisplay({ relationships }: { relationships: Relationship[] | undefined}) {
  return (
    <>
      {relationships === undefined ||
        (relationships.length <= 0 && (
          <p>This cat has no relationships you can view.</p>
        ))}
      <div className="relationships-list">
        {relationships?.map((rel) => {
          return (
            <>
              <RelationshipDisplay
                key={`${rel.cat_from_id}_${rel.cat_to_id}`}
                relationship={rel}
              />
            </>
          );
        })}
      </div>
    </>
  )
}

export default RelationshipsDisplay;
