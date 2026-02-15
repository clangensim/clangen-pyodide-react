import { Link } from "react-router";
import { Cat } from "../python/types";
import Pluralize from "./generic/Pluralize";
import { TbSparkles } from "react-icons/tb";

function CommaSeparatedProfileLinks({ cats }: { cats: Cat[] }) {
  return (
    <>
      {cats.map((cat, index) => {
        const divider = cats.length - 1 === index ? "" : ", ";
        return (
          <>
            <Link tabIndex={0} to={`/cats/${cat.ID}`}>
              {cat.name.display}
            </Link>
            {divider}
          </>
        );
      })}
    </>
  );
}

function CatProfile({ cat }: { cat: Cat }) {
  const parents = [];
  if (cat.parent1) {
    parents.push(cat.parent1);
  }
  if (cat.parent2) {
    parents.push(cat.parent2);
  }

  return (
    <>
      <ul className="row-list cat-profile__list">
        <li>{cat.gender}</li>
        <li>{cat.age}</li>
        <li>{cat.trait}</li>
        <li>{cat.skillString} </li>
        <li>
          {cat.moons.toString()} <Pluralize num={cat.moons}>moon</Pluralize>
        </li>
        <li>{cat.status} {cat.status == "leader" && !cat.dead && <Link tabIndex={0} to={"/ceremony"}><TbSparkles /></Link>} </li>
        <li>backstory: {cat.backstory}</li>
        <li>experience: {cat.experienceLevel}</li>
        {cat.mentor && (
          <li>
            mentor:{" "}
            <Link tabIndex={0} to={`/cats/${cat.mentor.ID}`}>
              {cat.mentor.name.display}
            </Link>
          </li>
        )}
        {cat.apprentices.length > 0 && (
          <li>
            <Pluralize num={cat.apprentices.length}>apprentice</Pluralize>:{" "}
            <CommaSeparatedProfileLinks cats={cat.apprentices} />
          </li>
        )}
        {cat.formerApprentices.length > 0 && (
          <li>
            <Pluralize num={cat.formerApprentices.length}>
              former apprentice
            </Pluralize>
            : <CommaSeparatedProfileLinks cats={cat.formerApprentices} />
          </li>
        )}
        {parents.length > 0 && (
          <li>
            <Pluralize num={parents.length}>parent</Pluralize>:{" "}
            <CommaSeparatedProfileLinks cats={parents} />
          </li>
        )}
        {cat.mates.length > 0 && (
          <li>
            <Pluralize num={cat.mates.length}>mate</Pluralize>:{" "}
            <CommaSeparatedProfileLinks cats={cat.mates} />
          </li>
        )}
      </ul>
    </>
  );
}

export default CatProfile;
