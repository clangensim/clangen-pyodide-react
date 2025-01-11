import { Relationship } from "../python/clangen";
import ProgressBar from "./ProgressBar";

function RelationshipDisplay({ relationship }: { relationship: Relationship }) {
  return (
    <div className="raised">
      <h1>{relationship.cat_to_id}</h1>
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
