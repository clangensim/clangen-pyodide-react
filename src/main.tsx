import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// general fonts
// @ts-expect-error - fonts are missing type declarations
import "@fontsource-variable/outfit";
// @ts-expect-error - fonts are missing type declarations
import "@fontsource/bubblegum-sans";

// fonts for allegiances page
// @ts-expect-error - fonts are missing type declarations
import "@fontsource/balthazar";
// @ts-expect-error - fonts are missing type declarations
import "@fontsource-variable/eb-garamond";
// @ts-expect-error - fonts are missing type declarations
import "@fontsource/amatic-sc";
// @ts-expect-error - fonts are missing type declarations
import '@fontsource/almendra-sc';

import "./styles/misc.css";
import "./styles/themes.css";
import "./styles/base.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
