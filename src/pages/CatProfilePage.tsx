import { clangenRunner, Cat } from "../python/clangen";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import CatDisplay from "../components/CatDisplay";
import CatProfile from "../components/CatProfile";
import Breadcrumbs from "../components/Breadcrumbs";

function CatProfilePage() {
  const [cat, setCat] = useState<Cat>();
  const params = useParams();
  const catID = params.id as string;

  useEffect(() => {
    setCat(clangenRunner.getCat(catID));
  }, [catID]);

  return (
    <>
      <Navbar />
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
          ]}
        />
      )}

      {cat && (
        <>
          {cat.name.display} (#{cat.ID})
          <CatDisplay
            key={cat.ID}
            pelt={cat.pelt}
            age={cat.age}
            dead={cat.dead}
            darkForest={cat.inDarkForest}
          />
          <CatProfile cat={cat} />
          <Link tabIndex={0} to={`/cats/${catID}/relationships`}>Relationships</Link>{" "}
          <Link tabIndex={0} to={`/cats/${catID}/conditions`}>Conditions</Link>{" "}
          <Link tabIndex={0} to={`/cats/${catID}/edit`}>Edit</Link>{" "}
          <Link tabIndex={0} to={`/cats/${catID}/edit/dangerous`}>Dangerous</Link>
        </>
      )}
    </>
  );
}

export default CatProfilePage;
