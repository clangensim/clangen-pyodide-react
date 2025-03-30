import * as Comlink from "Comlink";
import Clangen from "./clangen";

const clangen = new Clangen();

if ("SharedWorkerGlobalScope" in self) {
  addEventListener("connect", (event: any) => {
    const port = event.ports[0];
    Comlink.expose(clangen, port);
  });  
} else {
  Comlink.expose(clangen);
}
