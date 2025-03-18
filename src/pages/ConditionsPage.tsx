import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Cat, clangenRunner, Condition } from "../python/clangen";
import BasePage from "../layout/BasePage";

function ConditionsPage() {
  const [conditions, setConditions] = useState<Condition[]>();
  const [cat, setCat] = useState<Cat>();
  const params = useParams();
  const catID = params.id as string;

  useEffect(() => {
    const c = clangenRunner.getConditions(catID);
    setConditions(c);
    const c2 = clangenRunner.getCat(catID);
    document.title = `${c2.name.display}'s Conditions | Clangen Simulator`;
    setCat(c2);
  }, []);

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
        url: `/cats/${catID}`,
        label: "Conditions",
      },
    ];
  }

  return (
    <BasePage
      crumbs={crumbs}
    >
      {conditions === undefined ||
        (conditions.length == 0 && <p>This cat has no conditions.</p>)}
      {conditions?.map((condition) => (
        <>
          <ul>
            <li>{condition.name} </li>
            <ul>
              <li>{condition.type}</li>
              <li>{condition.severity}</li>
              <li>has had for {condition.moonsWith} moon(s)</li>
            </ul>
          </ul>
        </>
      ))}
    </BasePage>
  );
}

export default ConditionsPage;
