import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Cat, clangenRunner, Condition } from "../python/clangen";
import BasePage from "../layout/BasePage";
import ConditionsDisplay from "../components/ConditionsDisplay";

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
    <BasePage crumbs={crumbs}>
      <ConditionsDisplay conditions={conditions} />
    </BasePage>
  );
}

export default ConditionsPage;
