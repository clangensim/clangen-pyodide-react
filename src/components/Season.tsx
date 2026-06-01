import { TbLeaf, TbLeaf2, TbSeedingFilled, TbSnowflake } from "react-icons/tb";

function Season({ seasonName }: { seasonName: string | undefined }) {
  if (seasonName === undefined) {
    return <></>;
  }
  const season = seasonName.toLowerCase().replace("-", "");
  if (season === "leaffall") {
    return (
      <>
        <TbLeaf2 className="season_fall" /> {seasonName}
      </>
    );
  } else if (season === "leafbare") {
    return (
      <>
        <TbSnowflake className="season_winter" /> {seasonName}
      </>
    );
  } else if (season === "newleaf") {
    return (
      <>
        <TbSeedingFilled className="season_spring" /> {seasonName}
      </>
    );
  } else if (season === "greenleaf") {
    return (
      <>
        <TbLeaf className="season_summer" /> {seasonName}
      </>
    );
  }
  return <>{seasonName}</>;
}

export default Season;
