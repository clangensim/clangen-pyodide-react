import { Condition } from "../python/types";
import Pluralize from "./Pluralize";

function ConditionsDisplay({conditions}: {conditions: Condition[] | undefined}) {
  return (
    <>
      {conditions === undefined ||
        (conditions.length == 0 && <p>This cat has no conditions.</p>)}
      {conditions?.map((condition) => (
        <>
          <ul>
            <li>{condition.name} </li>
            <ul>
              <li>{condition.type}</li>
              <li>{condition.severity}</li>
              <li>has had for {condition.moonsWith} <Pluralize num={condition.moonsWith}>moon</Pluralize></li>
            </ul>
          </ul>
        </>
      ))}
    </>
  );
}

export default ConditionsDisplay;
