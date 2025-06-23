import Clangen from "./clangen";

import * as Comlink from "comlink";

let worker;
if ("SharedWorker" in window) {
  worker = new SharedWorker(new URL("./ClangenWorker.ts", import.meta.url), {
    type: "module",
  }).port;
} else {
  worker = new Worker(new URL("./ClangenWorker.ts", import.meta.url), {
    type: "module",
  });
}

const clangenRunner = Comlink.wrap<Clangen>(worker);
await clangenRunner.loadClangen();

export { clangenRunner };
