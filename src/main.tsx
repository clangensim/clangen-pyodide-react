import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../vendors/classic-stylesheets-win9x-2.0/win9x/theme.min.css";
import "../vendors/classic-stylesheets-win9x-2.0/win9x/skins/teal-2000.css";
import "./styles/base.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
