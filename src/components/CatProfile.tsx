import { Link } from "react-router";
import { Cat } from "../python/clangen";

function CommaSeparatedProfileLinks({ cats }: { cats: string[] }) {
  return (
    <>
      {cats.map((cat, index) => {
        const divider = cats.length - 1 === index ? "" : ", ";
        return (
          <>
            <Link to={`/cats/${cat}`}>#{cat}</Link>
            {divider}
          </>
        );
      })}
    </>
  );
}

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
        {cat.apprentices.length > 0 && 
          <li>
            apprentice(s): <CommaSeparatedProfileLinks cats={cat.apprentices} />
          </li>
        }
        {cat.formerApprentices.length > 0 && 
          <li>
            former apprentice(s): <CommaSeparatedProfileLinks cats={cat.formerApprentices} />
          </li>
        }
        {parents.length > 0 && (
          <li>
            parent(s): <CommaSeparatedProfileLinks cats={parents} />
          </li>
        )}
      </ul>
    </>
  );
}

export default CatProfile;
