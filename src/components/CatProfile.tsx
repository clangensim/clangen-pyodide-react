import { Cat } from "../python/clangen";

function CatProfile({ cat }: { cat: Cat }) {
  return (
    <>
      <ul>
        <li>{cat.gender}</li>
        <li>{cat.age}</li>
        <li>{cat.trait}</li>
        <li>{cat.moons.toString()} moon(s)</li>
        <li>{cat.status} </li>
        <li>{cat.mentor}</li>
      </ul>
    </>
  );
}

export default CatProfile;
