import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import react from '@vitejs/plugin-react'

const PYODIDE_EXCLUDE = [
  "!**/*.{md,html}",
  "!**/*.d.ts",
  "!**/*.whl",
  "!**/node_modules",
  "!**/package.json",
  "!**/package-lock.json",
];
const DIR = dirname(fileURLToPath(import.meta.url));


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
  build: {
    rollupOptions: {
      input: {
        main: resolve(DIR, "index.html"),
        credits: resolve(DIR, "credits.html"),
        reset: resolve(DIR, "reset.html"),
        changelog: resolve(DIR, "changelog.html"),
      }
    }
  },
  optimizeDeps: {
    exclude: [
      "pyodide",
    ],
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  },
  worker: {
    format: "es",
  }
})
