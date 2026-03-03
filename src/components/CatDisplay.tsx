import { Cat, Pelt } from "../python/types";
import drawCat from "../python/drawCat";
import { useEffect, useRef } from "react";

function CatDisplay({
  cat,
  fuzzy = false,
  w = "50px",
  h = "50px",
  className,
}: {
  cat: Cat | undefined; // sometimes cat doesn't exist?
  fuzzy?: boolean;
  w?: string;
  h?: string;
  className?: string;
}) {
  var forceSprite;

  if (!cat) { // just to prevent crash
    return <></>
  }

  if (!cat.canWork && cat.age !== "newborn") {
    if (cat.age === "kitten" || cat.age === "adolescent") {
      forceSprite = 19;
    } else {
      forceSprite = 18;
    }
  }

  return (
    <CatSprite
      pelt={cat.pelt}
      age={cat.age}
      dead={cat.dead}
      darkForest={cat.inDarkForest}
      fuzzy={fuzzy}
      w={w}
      h={h}
      className={className}
      forceSprite={forceSprite}
    />
  );
}

function CatSprite({
  pelt,
  age,
  dead,
  darkForest,
  w = "50px",
  h = "50px",
  fuzzy = false,
  forceSprite,
  className,
}: {
  pelt: Pelt;
  age: string;
  dead?: boolean;
  darkForest?: boolean;
  w?: string;
  h?: string;
  fuzzy: boolean;
  forceSprite?: number;
  className?: string;
}) {
  const canvasRef = useRef<any>(null);

  var catSprite: number;
  if (forceSprite === undefined) {
    catSprite = pelt.catSprites[age];
  } else {
    catSprite = forceSprite;
  }

  useEffect(() => {
    const shadingEnabled = localStorage.getItem("shading-enabled") !== null;
    if (canvasRef.current !== null) {
      drawCat(canvasRef.current, pelt, catSprite, dead, darkForest, shadingEnabled);
    }
  }, [canvasRef, pelt, catSprite, darkForest, dead]);

  return (
    <>
      <canvas
        style={{ imageRendering: fuzzy ? "auto" : "pixelated", width: w, height: h }}
        width={50}
        height={50}
        ref={canvasRef}
        className={className}
      />
    </>
  );
}

export default CatDisplay;
