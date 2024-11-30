import { clangenRunner, Cat } from "../python/clangen"
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function CatProfilePage() {

  const [cat, setCat] = useState<Cat>();
  const params = useParams();

  useEffect(() => {
    setCat(clangenRunner.getCat(params.id));
  }, []);

  return (
    <>
      <Nav />
      { cat?.name }
    </>
  )
}

export default CatProfilePage;
