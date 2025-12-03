import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Cat, Condition } from "../../python/types";
import { clangenRunner } from "../../python/clangenRunner";
import BasePage from "../../layout/BasePage";
import ConditionsDisplay from "../../components/ConditionsDisplay";

function ConditionsPage() {
  const [conditions, setConditions] = useState<Condition[]>();
  const [cat, setCat] = useState<Cat>();
  const params = useParams();
  const catID = params.id as string;

  useEffect(() => {
    clangenRunner.getConditions(catID).then((c) => setConditions(c));
    clangenRunner.getCat(catID).then((c) => {
      document.title = `${c.name.display}'s Conditions | ClanGen Simulator`;
      setCat(c);
    });
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
