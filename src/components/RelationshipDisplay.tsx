import { Relationship } from "../python/clangen";

function RelationshipDisplay({ relationship }: { relationship: Relationship }) {
  return (
    <div className="raised">
      <h1>{relationship.cat_to_id}</h1>
      <ul>
        <li>
          romantic love
          <div
            className="progress-bar"
            aria-valuenow={relationship.romantic_love.valueOf()}
            style={{ width: "140px" }}
          >
            <div
              className="progress-bar-value"
              style={{ width: `${relationship.romantic_love.toString()}%` }}
            ></div>
          </div>
        </li>
        <li>
          platonic like
          <div
            className="progress-bar"
            aria-valuenow={relationship.platonic_like.valueOf()}
            style={{ width: "140px" }}
          >
            <div
              className="progress-bar-value"
              style={{ width: `${relationship.platonic_like.toString()}%` }}
            ></div>
          </div>
        </li>
        <li>
          dislike
          <div
            className="progress-bar"
            aria-valuenow={relationship.dislike.valueOf()}
            style={{ width: "140px" }}
          >
            <div
              className="progress-bar-value"
              style={{ width: `${relationship.dislike.toString()}%` }}
            ></div>
          </div>
        </li>
        <li>
          admiration
          <div
            className="progress-bar"
            aria-valuenow={relationship.admiration.valueOf()}
            style={{ width: "140px" }}
          >
            <div
              className="progress-bar-value"
              style={{ width: `${relationship.admiration.toString()}%` }}
            ></div>
          </div>
        </li>
        <li>
          comfort
          <div
            className="progress-bar"
            aria-valuenow={relationship.comfortable.valueOf()}
            style={{ width: "140px" }}
          >
            <div
              className="progress-bar-value"
              style={{ width: `${relationship.comfortable.toString()}%` }}
            ></div>
          </div>
        </li>
        <li>
          jealousy
          <div
            className="progress-bar"
            aria-valuenow={relationship.jealousy.valueOf()}
            style={{ width: "140px" }}
          >
            <div
              className="progress-bar-value"
              style={{ width: `${relationship.jealousy.toString()}%` }}
            ></div>
          </div>
        </li>
        <li>
          trust
          <div
            className="progress-bar"
            aria-valuenow={relationship.trust.valueOf()}
            style={{ width: "140px" }}
          >
            <div
              className="progress-bar-value"
              style={{ width: `${relationship.trust.toString()}%` }}
            ></div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default RelationshipDisplay;