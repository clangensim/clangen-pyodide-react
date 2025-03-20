import { Cat, Pelt } from "../python/types";
import drawCat from "../python/drawCat";
import { useEffect, useRef } from "react";

function CatDisplay({
  cat,
  w = "50px",
  h = "50px",
}: {
  cat: Cat;
  w?: string;
  h?: string;
}) {
  return (
    <CatSprite
      pelt={cat.pelt}
      age={cat.age}
      dead={cat.dead}
      darkForest={cat.inDarkForest}
      w={w}
      h={h}
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
}: {
  pelt: Pelt;
  age: string;
  dead?: boolean;
  darkForest?: boolean;
  w?: string;
  h?: string;
}) {
  const canvasRef = useRef<any>(null);
  const catSprite = pelt.catSprites[age];

  useEffect(() => {
    if (canvasRef.current !== null) {
      drawCat(canvasRef.current, pelt, catSprite, dead, darkForest);
    }
  }, [canvasRef]);

  return (
    <>
      <canvas
        style={{ imageRendering: "pixelated", width: w, height: h }}
        width={50}
        height={50}
        ref={canvasRef}
      />
    </>
  );
}

export default CatDisplay;
