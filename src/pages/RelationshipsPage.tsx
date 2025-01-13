import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { clangenRunner } from "../python/clangen";
import RelationshipDisplay from "../components/RelationshipDisplay";
import Nav from "../components/Nav";

function RelationshipsPage() {
  const [relationships, setRelationships] = useState<Array<any>>();
  const params = useParams();

  useEffect(() => {
    setRelationships(clangenRunner.getRelationships(params.id));
  }, []);

  return (
    <>
      <Nav />
      {relationships?.map((rel, index) => {
        return <RelationshipDisplay key={index} relationship={rel} />;
      })}
    </>
  );
}

export default RelationshipsPage;
