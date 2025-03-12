import { Pelt } from "../python/clangen";
import drawCat from "../python/drawCat";
import { useEffect, useRef } from "react";

function CatDisplay({
  pelt,
  age,
  dead,
  darkForest,
}: {
  pelt: Pelt;
  age: string;
  dead?: boolean;
  darkForest?: boolean;
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
        style={{ imageRendering: "pixelated" }}
        width={50}
        height={50}
        ref={canvasRef}
      />
    </>
  );
}

export default CatDisplay;
