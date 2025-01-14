import { clangenRunner, Cat } from "../python/clangen";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import CatDisplay from "../components/CatDisplay";
import CatProfile from "../components/CatProfile";

function CatProfilePage() {
  const [cat, setCat] = useState<Cat>();
  const params = useParams();
  const catID = params.id as string;

  useEffect(() => {
    setCat(clangenRunner.getCat(catID));
  }, []);

  return (
    <>
      <Nav />

      {cat && (
        <>
          {cat.name.display} (#{cat.ID})
          <CatDisplay pelt={cat.pelt} age={cat.age} />
          <CatProfile cat={cat} />
          <Link to={`/cats/${catID}/relationships`}>Relationships</Link>{" "}
          <Link to={`/cats/${catID}/edit`}>Edit</Link>
        </>
      )}
    </>
  );
}

export default CatProfilePage;
