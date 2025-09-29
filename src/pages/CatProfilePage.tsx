import { Cat, Relationship, Condition } from "../python/types";
import { clangenRunner } from "../python/clangenRunner";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { TbExclamationCircleFilled, TbPencil } from "react-icons/tb";
import { TbFileAlert } from "react-icons/tb";
import CatDisplay from "../components/CatDisplay";
import CatProfile from "../components/CatProfile";
import BasePage from "../layout/BasePage";

import "../styles/cat-profile-page.css";
import RelationshipsDisplay from "../components/RelationshipDisplay";
import ConditionsDisplay from "../components/ConditionsDisplay";

function CatProfilePage() {
  const [cat, setCat] = useState<Cat>();
  const [relationships, setRelationships] = useState<Relationship[]>();
  const [conditions, setConditions] = useState<Condition[]>();
  const [neighbourCats, setNeighbourCats] = useState<[string, string]>(["-1", "-1"]);
  const [ceremony, setCeremony] = useState<string>();

  const params = useParams();
  const catID = params.id as string;

  useEffect(() => {
    clangenRunner.getCat(catID).then((c) => {
      setCat(c);

      // have to set this here bc otherwise ceremonies appear w/ next/prev cat button
      setCeremony(undefined);
      if (c) {
        document.title = `${c.name.display} | ClanGen Simulator`;
        if (!c.dead && c.status === "leader") {
          clangenRunner.getLeaderCeremony().then((cere) => setCeremony(cere));
        }
      }
    });

    clangenRunner.getRelationships(catID).then((r) => setRelationships(r));
    clangenRunner.getConditions(catID).then((c) => setConditions(c));
    clangenRunner.getPrevAndNextCats(catID).then((c) => setNeighbourCats(c));
  }, [catID]);

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
    ];
  }

  return (
    <BasePage crumbs={crumbs}>
      {cat && (
        <>
        <div style={{
          display: neighbourCats[0] === "-1" && neighbourCats[1] === "-1" ? "none" : "flex",
          height: "auto"
        }}>
          <div style={{
            marginRight: "auto",
            visibility: neighbourCats[0] === "-1" ? "hidden" : "visible",
          }}>
            <Link style={{display: "inline-block"}} className="btn" to={`/cats/${neighbourCats[0]}`}>← Previous Cat</Link>
          </div>
          <div style={{
            marginLeft: "auto",
            visibility: neighbourCats[1] === "-1" ? "hidden" : "visible"
          }}>
            <Link style={{display: "inline-block"}} className="btn" to={`/cats/${neighbourCats[1]}`}>Next Cat →</Link>
          </div>
        </div>

          <div>
            <h2 className="cat-profile__header">{cat.name.display}</h2> #
            {cat.ID}
            <Link to={`/cats/${catID}/edit`} className="icon-button">
              <TbPencil size={25} />
            </Link>
            <Link to={`/cats/${catID}/edit/dangerous`} className="icon-button">
              <TbFileAlert size={25} />
            </Link>
            <div>{cat.thought}</div>
          </div>
          <div className="flex">
            <CatDisplay cat={cat} w="100px" h="100px" />
            <CatProfile cat={cat} />
          </div>

          <div>
            <details>
              <summary>Relationships</summary>
              <RelationshipsDisplay relationships={relationships} />
            </details>
          </div>
          <div>
            <details>
              <summary>
                Conditions
                {conditions && conditions.length > 0 && (
                  <TbExclamationCircleFilled />
                )}
              </summary>
              <ConditionsDisplay conditions={conditions} />
            </details>
          </div>
          {ceremony && 
            <div>
              <details>
                <summary>Leadership Ceremony</summary>
                {ceremony.split("<br><br>").map(line => <p>{line}</p>)}
              </details>
            </div>
          }
        </>
      )}
    </BasePage>
  );
}

export default CatProfilePage;
