import { Link } from "react-router";
import { Cat } from "../python/clangen";

function CatProfile({ cat }: { cat: Cat }) {
  const mentorLink = `/cats/${cat.mentor}`;

  const parents = [];
  if (cat.parent1) {
    parents.push(cat.parent1);
  }
  if (cat.parent2) {
    parents.push(cat.parent2);
  }

  return (
    <>
      <ul>
        <li>{cat.gender}</li>
        <li>{cat.age}</li>
        <li>{cat.trait}</li>
        <li>{cat.skillString} </li>
        <li>{cat.moons.toString()} moon(s)</li>
        <li>{cat.status} </li>
        {cat.mentor && (
          <li>
            mentor: <Link to={mentorLink}>#{cat.mentor}</Link>
          </li>
        )}
        {parents.length > 0 && (
          <li>
            parent(s):{" "}
            {parents.map((parent, index) => {
              const divider = parents.length - 1 === index ? "" : ", ";
              return (
                <>
                  <Link to={`/cats/${parent}`}>#{parent}</Link>
                  {divider}
                </>
              );
            })}
          </li>
        )}
      </ul>
    </>
  );
}

export default CatProfile;
