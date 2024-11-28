import { loadPyodide } from "pyodide";

const pyodide = await loadPyodide({
  indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
});

export default pyodide;
