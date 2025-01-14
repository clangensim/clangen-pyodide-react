import { Relationship } from "../python/clangen";
import CatDisplay from "./CatDisplay";
import ProgressBar from "./ProgressBar";

function RelationshipDisplay({ relationship }: { relationship: Relationship }) {
  return (
    <div className="raised">
      <CatDisplay pelt={relationship.cat_to.pelt} age={relationship.cat_to.age} />
      {relationship.cat_to.name}
      <ul>
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

export default RelationshipDisplay;
