import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Cat, clangenRunner, Relationship } from "../python/clangen";
import RelationshipDisplay from "../components/RelationshipDisplay";
import BasePage from "../layout/BasePage";

import "../styles/relationships-page.css";

function RelationshipsPage() {
  const [relationships, setRelationships] = useState<Relationship[]>();
  const params = useParams();
  const catID = params.id as string;

  const [cat, setCat] = useState<Cat>();

  var crumbs = undefined;
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
    setRelationships(clangenRunner.getRelationships(catID));
    const c = clangenRunner.getCat(catID);
    if (c) {
      document.title = `${c.name.display}'s Relationships | Clangen Simulator`;
    }
    setCat(c);
  }, [catID]);

  return (
    <BasePage
      crumbs={crumbs}
    >

      {relationships === undefined ||
        (relationships.length <= 0 && (
          <p>This cat has no relationships you can view.</p>
        ))}
      <div className="relationships-list">
        {relationships?.map((rel) => {
          return (
            <>
              <RelationshipDisplay
                key={`${catID}_${rel.cat_to_id}`}
                relationship={rel}
              />
            </>
          );
        })}
      </div>
    </BasePage>
  );
}

export default RelationshipsPage;
