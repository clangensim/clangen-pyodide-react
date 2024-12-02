import { Relationship } from "../python/clangen";

function RelationshipDisplay({ relationship }: { relationship: Relationship}) {
  return (
    <>
      <h1>{ relationship.cat_to_id }</h1>
      <ul>
        <li>romantic love: { relationship.romantic_love.toString() }</li>
        <li>platonic like: { relationship.platonic_like.toString() }</li>
        <li>dislike: { relationship.dislike.toString() }</li>
        <li>admiration: { relationship.admiration.toString() }</li>
        <li>comfort: { relationship.comfortable.toString() }</li>
        <li>jealousy: { relationship.jealousy.toString() }</li>
        <li>trust: { relationship.trust.toString() }</li>
      </ul>
    </>
  )
}

export default RelationshipDisplay;