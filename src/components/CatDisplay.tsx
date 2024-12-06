import { Pelt } from "../python/clangen";
import spritesIndex from "../assets/spritesIndex.json";
import spriteNumbers from "../assets/spritesOffsetMap.json";

function Sprite({ spriteName, spriteNumber }: { spriteName: string, spriteNumber: number }) {
  const spriteKey = spriteName as keyof typeof spritesIndex;
  const spriteXPosition = spriteNumbers[spriteNumber].x;
  const spriteYPosition = spriteNumbers[spriteNumber].y;

  const spriteXOffset = spritesIndex[spriteKey].xOffset + 50 * spriteXPosition;
  const spriteYOffset = spritesIndex[spriteKey].yOffset + 50 * spriteYPosition;

  return (
    <>
      <div style={{
        background: `url(/sprites/${spritesIndex[spriteKey].spritesheet}.png) -${spriteXOffset}px -${spriteYOffset}px`,
        height: '50px',
        width: '50px',
        imageRendering: 'pixelated',
        position: 'absolute'
      }}>
      </div>
    </>
  )
}

/* 
  TODO:
    tortie/calico, tints, masks, scars, dead lineart
*/
function CatDisplay({ pelt, age }: { pelt: Pelt, age: string }) {
  const catSprite = pelt.catSprites[age]

  if (pelt.name === 'Tortie' || pelt.name === 'Calico') { return <>ERROR</> }
  return (
    <>
      <div style={{height: '50px', width: '50px', position: 'relative'}}>
        <Sprite spriteName={`${pelt.spritesName}${pelt.colour}`} spriteNumber={catSprite} />

        { pelt.whitePatches !== undefined && 
          <Sprite spriteName={`white${pelt.whitePatches}`} spriteNumber={catSprite} />
        }

        { pelt.points !== undefined && 
          <Sprite spriteName={`white${pelt.points}`} spriteNumber={catSprite} />
        }

        { pelt.vitiligo !== undefined && 
          <Sprite spriteName={`white${pelt.vitiligo}`} spriteNumber={catSprite} />
        }

        <Sprite spriteName={`eyes${pelt.eyeColour}`} spriteNumber={catSprite} />

        { pelt.eyeColour2 !== undefined && 
          <Sprite spriteName={`eyes2${pelt.eyeColour2}`} spriteNumber={catSprite} />
        }

        <Sprite spriteName="lines" spriteNumber={catSprite} />
      </div>
    </>
  )
}

export default CatDisplay;