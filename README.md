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

## Licenses

### Code (not including submodules or generated files)

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

### Assets

The following images:

* `assets/images/gen_med_newmed.png`
* `assets/images/pln_no_UFO.png` - Edited version of pln_UFO.png from Clangen to remove the UFO
* `public/static/bg.png` - Renamed from greenleaf_camp1_light.png

are by the Clangen team and are licensed under [https://creativecommons.org/licenses/by-nc/4.0/](CC BY-NC 4.0). The original images can be found at https://github.com/ClanGenOfficial/clangen/tree/development.

The full licenses text can be found in `LICENSE_MPL.txt` and `LICENSE_CC_BY_NC.txt`.
