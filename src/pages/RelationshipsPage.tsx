import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Cat, Relationship } from "../python/types";
import { clangenRunner } from "../python/clangenRunner";
import RelationshipsDisplay from "../components/RelationshipDisplay";
import BasePage from "../layout/BasePage";

import "../styles/relationships-page.css";

function RelationshipsPage() {
  const [relationships, setRelationships] = useState<Relationship[]>();
  const params = useParams();
  const catID = params.id as string;

  const [cat, setCat] = useState<Cat>();

  let crumbs = undefined;
  if (cat) {
    crumbs = [
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
    ];
  }

  useEffect(() => {
    clangenRunner.getRelationships(catID).then((r) => setRelationships(r));

    clangenRunner.getCat(catID).then((c) => {
      if (c) {
        document.title = `${c.name.display}'s Relationships | ClanGen Simulator`;
      }
      setCat(c);
    });
  }, [catID]);

  return (
    <BasePage crumbs={crumbs}>
      <RelationshipsDisplay relationships={relationships} />
    </BasePage>
  );
}

export default RelationshipsPage;
