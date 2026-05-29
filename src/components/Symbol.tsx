import { useEffect, useRef } from "react";
import symbolsIndex from "../assets/symbolsIndex.json";

import { loadImage } from "../utils";

type Symbol = keyof typeof symbolsIndex;

async function drawSymbol(symbol: Symbol, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;

  const symbolData = symbolsIndex[symbol];
  const symbolImage = await loadImage("/sprites/symbols.png");

  ctx.clearRect(0, 0, 50, 50);
  ctx.drawImage(
    symbolImage,
    symbolData.xOffset,
    symbolData.yOffset,
    50,
    50,
    0,
    0,
    50,
    50,
  );
}

function ClanSymbol({ symbol }: { symbol?: string }) {
  if (!symbol || !(symbol in symbolsIndex)) {
    return <></>;
  } // symbolName in symbolsIndex

  const canvasElement = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasElement.current) {
      return;
    }
    drawSymbol(symbol as Symbol, canvasElement.current);
  }, [canvasElement, symbol]);

  return <canvas width={50} height={50} ref={canvasElement}></canvas>;
}

export default ClanSymbol;
