import pyodide from "./pyodide";
import Clangen from "./clangen";

const clangenRunner = new Clangen(pyodide);
await clangenRunner.loadClangen();

export { clangenRunner };
