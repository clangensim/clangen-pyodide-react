import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Cat, clangenRunner, Relationship } from "../python/clangen";
import RelationshipDisplay from "../components/RelationshipDisplay";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";

function RelationshipsPage() {
  const [relationships, setRelationships] = useState<Relationship[]>();
  const params = useParams();
  const catID = params.id as string;

  const [cat, setCat] = useState<Cat>();

  useEffect(() => {
    setRelationships(clangenRunner.getRelationships(catID));
    setCat(clangenRunner.getCat(catID));
  }, [catID]);

  return (
    <>
      <Navbar />
      {cat && (
        <Breadcrumbs
          crumbs={[
            {
              url: "/",
              label: "Home",
            },
            {
              url: "/cats",
              label: "Cats",
            },
            {
              url: `/cats/${catID}`,
              label: cat.name.display,
            },
            {
              url: `/cats/${catID}/relationships`,
              label: "Relationships",
            },
          ]}
        />
      )}

      {relationships?.map((rel) => {
        return (
          <>
            <RelationshipDisplay key={`${catID}_${rel.cat_to_id}`} relationship={rel} />
          </>
        );
      })}
    </>
  );
}

export default RelationshipsPage;
