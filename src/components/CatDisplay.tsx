import { Pelt } from "../python/clangen";
import Sprite from "./Sprite";


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