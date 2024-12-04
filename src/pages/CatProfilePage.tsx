import { clangenRunner, Cat } from "../python/clangen"
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

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

      { cat &&
        <>
          {cat.name}

          <Link to={`/cats/${catID}/relationships`}>Relationships</Link>
        </>
      }
    </>
  )
}

export default CatProfilePage;
