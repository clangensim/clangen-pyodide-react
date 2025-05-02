# Clangen Simulator

Clangen running in your browser using Pyodide with a frontend written in React.

## Requirements
* uv
* Node.js

## Run Dev Server

```
git clone --recurse-submodules https://github.com/clangensim/clangen-pyodide-react.git
cd clangen-pyodide-react
uv run vendors/clangen-lite/build.py vendors/clangen-lite public
npm install
npm run dev
```
