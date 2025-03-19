import { clangenRunner, Cat } from "../python/clangen";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { TbPencil } from "react-icons/tb";
import { TbFileAlert } from "react-icons/tb";
import CatDisplay from "../components/CatDisplay";
import CatProfile from "../components/CatProfile";
import BasePage from "../layout/BasePage";

import "../styles/cat-profile-page.css";

function CatProfilePage() {
  const [cat, setCat] = useState<Cat>();
  const params = useParams();
  const catID = params.id as string;

  useEffect(() => {
    const c = clangenRunner.getCat(catID);
    setCat(c);

    if (c) {
      document.title = `${c.name.display} | Clangen Simulator`;
    }
  }, [catID]);

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
    ];
  }

  return (
    <BasePage crumbs={crumbs}>
      {cat && (
        <>
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
            <CatDisplay
              key={cat.ID}
              cat={cat}
              w="100px"
              h="100px"
            />
            <CatProfile cat={cat} />
          </div>
          <Link tabIndex={0} to={`/cats/${catID}/relationships`}>
            Relationships
          </Link>{" "}
          <Link tabIndex={0} to={`/cats/${catID}/conditions`}>
            Conditions
          </Link>
        </>
      )}
    </BasePage>
  );
}

export default CatProfilePage;
