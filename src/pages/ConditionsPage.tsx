import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { clangenRunner, Condition } from "../python/clangen";
import Nav from "../components/Nav";

function ConditionsPage() {
  const [conditions, setConditions] = useState<Condition[]>();
  const params = useParams();
  const catID = params.id as string;

  useEffect(() => {
    const c = (clangenRunner.getConditions(catID));
    setConditions(c);
  }, []);

  return (
    <>
      <Nav />

      {conditions === undefined || conditions.length == 0 && 
        <p>This cat has no conditions.</p>
      }
      {conditions?.map((condition) => (
          <>
            <ul>
              <li>{ condition.name } </li>
              <ul>
                <li>{ condition.type }</li>
                <li>{ condition.severity }</li>
                <li>has had for { condition.moonsWith } moon(s)</li>
              </ul>
            </ul>
          </>
        )
      )}
    </>
  );
}

export default ConditionsPage;
