import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Cat, clangenRunner, Relationship } from "../python/clangen";
import RelationshipDisplay from "../components/RelationshipDisplay";
import Nav from "../components/Nav";
import Breadcrumbs from "../components/Breadcrumbs";

function RelationshipsPage() {
  const [relationships, setRelationships] = useState<Relationship[]>();
  const params = useParams();
  const catID = params.id as string;

  const [cat, setCat] = useState<Cat>();

  useEffect(() => {
    setRelationships(clangenRunner.getRelationships(catID));
    setCat(clangenRunner.getCat(catID));
  }, []);

  return (
    <>
      <Nav />
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

      {relationships?.map((rel, index) => {
        return (
          <>
            <RelationshipDisplay key={index} relationship={rel} />
          </>
        );
      })}
    </>
  );
}

export default RelationshipsPage;
