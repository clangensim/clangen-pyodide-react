import { Pelt } from "../python/clangen";
import spritesIndex from "../assets/spritesIndex.json";
import spriteNumbers from "../assets/spritesOffsetMap.json";
import { useEffect, useRef } from "react";

function getSpritePosition(spriteName: string, spriteNumber: number) {
  const spriteKey = spriteName as keyof typeof spritesIndex;
  const spriteXPosition = spriteNumbers[spriteNumber].x;
  const spriteYPosition = spriteNumbers[spriteNumber].y;

  return {
    url: `/sprites/${spritesIndex[spriteKey].spritesheet}.png`,
    x: spritesIndex[spriteKey].xOffset + 50 * spriteXPosition,
    y: spritesIndex[spriteKey].yOffset + 50 * spriteYPosition,
  };
}

async function loadImage(url: string) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    img.addEventListener("load", () => {
      resolve(img);
    });
  });
}

async function drawSprite(spriteName: string, spriteNumber: number, ctx: any) {
  const spritePosition = getSpritePosition(spriteName, spriteNumber);

  const img = await loadImage(spritePosition.url);
  ctx.drawImage(img, spritePosition.x, spritePosition.y, 50, 50, 0, 0, 50, 50);
}

async function drawMaskedSprite(
  spriteName: string,
  maskSpriteName: string,
  spriteNumber: number,
  ctx: any,
) {
  const offscreen = new OffscreenCanvas(50, 50);
  const offscreenContext = offscreen.getContext("2d");

  if (offscreenContext !== null) {
    await drawSprite(maskSpriteName, spriteNumber, offscreenContext);
    offscreenContext.globalCompositeOperation = "source-in";
    await drawSprite(spriteName, spriteNumber, offscreenContext);

    ctx.drawImage(offscreen, 0, 0);
  }
}

/* 
  TODO:
    tints, scars, dead lineart
*/
function CatDisplay({ pelt, age }: { pelt: Pelt; age: string }) {
  const canvasRef = useRef<any>(null);
  const catSprite = pelt.catSprites[age];

  useEffect(() => {
    if (canvasRef.current !== null) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const drawCat = async () => {
        if (pelt.name !== "Tortie" && pelt.name !== "Calico") {
          await drawSprite(`${pelt.spritesName}${pelt.colour}`, catSprite, ctx);
        } else {
          await drawSprite(`${pelt.tortieBase}${pelt.colour}`, catSprite, ctx);

          var tortiePattern;
          if (pelt.tortiePattern == "Single") {
            tortiePattern = "SingleColour";
          } else {
            tortiePattern = pelt.tortiePattern;
          }

          await drawMaskedSprite(
            `${tortiePattern}${pelt.tortieColour}`,
            `tortiemask${pelt.pattern}`,
            catSprite,
            ctx,
          );
        }

        if (pelt.whitePatches !== undefined) {
          await drawSprite(`white${pelt.whitePatches}`, catSprite, ctx);
        }
        if (pelt.points !== undefined) {
          await drawSprite(`white${pelt.points}`, catSprite, ctx);
        }
        if (pelt.vitiligo !== undefined) {
          await drawSprite(`white${pelt.vitiligo}`, catSprite, ctx);
        }
        await drawSprite(`eyes${pelt.eyeColour}`, catSprite, ctx);
        if (pelt.eyeColour2 !== undefined) {
          await drawSprite(`eyes2${pelt.eyeColour}`, catSprite, ctx);
        }
        await drawSprite("lines", catSprite, ctx);
      };
      drawCat();
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
