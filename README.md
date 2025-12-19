# Clangen Simulator

Clangen running in your browser using Pyodide with a frontend written in React.

## Requirements
* uv
* Node.js

## Run Dev Server

```
git clone --recurse-submodules https://github.com/clangensim/clangen-pyodide-react.git
cd clangen-pyodide-react
uv sync
uv run vendors/clangen-lite/build.py vendors/clangen-lite public
npm install
npm run dev
```

## Project Structure
* `public` - These files will be copied directly into the base folder when the site is built. Mainly used for generated files that need to be accessed via direct paths, and files that need to have their paths retrieved dynamically.
* `src` - Most of the code lives here.
  * `src/assets` - Resources such as JSONs and images that don't need to be retrieved via direct path.
  * `src/components` - Various React components. `src/components/generic` is for general components like checkboxes or file upload buttons, while the rest are more specific to ClanGenSim.
  * `src/layout` - React components for the overall layout, including navigation and the base layout.
  * `src/pages` - Contains the React components representing the webpages for the site.
  * `src/python` - ClanGen simulation code and types related to it.
    * `clangen_api.py` - Python code that interfaces with the clangen-lite library so that functions are more easily callable.
    * `clangen.ts` - Typescript code that initializes Pyodide and calls the functions in `clangen_api.py`.
    * `clangenWorker.ts` - Simple wrapper for `clangen.ts` so it can be used as a Worker or SharedWorker using Comlink.
    * `clangenRunner.ts` - Initializes `clangenWorker` with Comlink and creates a global object that can have its functions called to interact with the simulation code.
    * `types.ts` - Types for interfacing with ClanGen.
  * `src/styles` - CSS styles for the site.
* `tests` - Tests. Organized by type.
* `vendors` - Contains a submodule for clangen-lite, a stripped down version of ClanGen with most of the UI code removed, which is packaged with ClanGenSim.
  The `uv.lock` and `pyproject.toml` are for packaging this library.

## Licenses

### Code (not including submodules or generated files)

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

### Assets

The following images:

* `assets/images/gen_med_newmed.png`
* `assets/images/pln_no_UFO.png` - Edited version of pln_UFO.png from Clangen to remove the UFO
* `public/static/bg.png` - Renamed from greenleaf_camp1_light.png

are by the Clangen team and are licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). The original images can be found at https://github.com/ClanGenOfficial/clangen/tree/development.

The full licenses text can be found in `LICENSE_MPL.txt` and `LICENSE_CC_BY_NC.txt`.
