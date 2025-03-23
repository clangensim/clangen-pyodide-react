import { loadPyodide } from "pyodide";

import Clangen from "./clangen";

const pyodide = await loadPyodide();
const clangenRunner = new Clangen(pyodide);
await clangenRunner.loadClangen();

export { clangenRunner };
