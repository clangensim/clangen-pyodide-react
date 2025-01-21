import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import react from '@vitejs/plugin-react'

const PYODIDE_EXCLUDE = [
  "!**/*.{md,html}",
  "!**/*.d.ts",
  "!**/*.whl",
  "!**/node_modules",
];

export function viteStaticCopyPyodide() {
  const pyodideDir = dirname(fileURLToPath(import.meta.resolve("pyodide")));
  return viteStaticCopy({
    targets: [
      {
        src: [join(pyodideDir, "*")].concat(PYODIDE_EXCLUDE),
        dest: "assets",
      },
    ],
  });
}


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopyPyodide(),
  ],
  optimizeDeps: {
    exclude: [
      "pyodide",
    ],
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  }
})
