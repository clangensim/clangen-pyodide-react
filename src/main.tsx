import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// @ts-ignore 
import '@fontsource-variable/outfit';
// @ts-ignore 
import "@fontsource/bubblegum-sans";
import "./styles/misc.css";
import "./styles/base.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
