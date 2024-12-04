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

export default Sprite;
