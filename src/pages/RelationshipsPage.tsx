import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { clangenRunner } from "../python/clangen";

function RelationshipsPage() {

  const [relationships, setRelationships] = useState<Array<any>>([]);
  const params = useParams();

  useEffect(() => {
    setRelationships(clangenRunner.getRelationships(params.id));
  }, []);

  return (
    <>
    </>
  );
}

export default RelationshipsPage;