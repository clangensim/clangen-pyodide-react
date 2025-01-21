import { Link } from "react-router";
import { Cat } from "../python/clangen";

function CatProfile({ cat }: { cat: Cat }) {
  const mentorLink = `/cats/${cat.mentor}`;
  return (
    <>
      <ul>
        <li>{cat.gender}</li>
        <li>{cat.age}</li>
        <li>{cat.trait}</li>
        <li>{cat.moons.toString()} moon(s)</li>
        <li>{cat.status} </li>
        {cat.mentor && (
          <li>
            mentor: <Link to={mentorLink}>#{cat.mentor}</Link>
          </li>
        )}
      </ul>
    </>
  );
}

export default CatProfile;
