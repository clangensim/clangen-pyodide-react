import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "../vendors/classic-stylesheets-win9x-2.0/win9x/theme.min.css";
import "../vendors/classic-stylesheets-win9x-2.0/win9x/skins/teal-2000.css";
import "./styles/base.css";

import App from "./App.tsx";
import EventsPage from "./pages/EventsPage.tsx";
import CatsPage from "./pages/CatsPage.tsx";
import CatProfilePage from "./pages/CatProfilePage.tsx";
import RelationshipsPage from "./pages/RelationshipsPage.tsx";
import ConditionsPage from "./pages/ConditionsPage.tsx";
import NewClanPage from "./pages/NewClanPage.tsx";
import PatrolsPage from "./pages/PatrolsPage.tsx";
import CatEditPage from "./pages/CatEditPage.tsx";
import ErrorNotFoundPage from "./pages/ErrorNotFoundPage.tsx";
import CreditsPage from "./pages/CreditsPage.tsx";
import CatDangerousEditPage from "./pages/CatDangerousEditPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/new-clan" element={<NewClanPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/patrols" element={<PatrolsPage />} />
        <Route path="/cats" element={<CatsPage />} />
        <Route path="/cats/:id" element={<CatProfilePage />} />
        <Route path="/cats/:id/edit" element={<CatEditPage />} />
        <Route path="/cats/:id/edit/dangerous" element={<CatDangerousEditPage />} />
        <Route path="/cats/:id/relationships" element={<RelationshipsPage />} />
        <Route path="/cats/:id/conditions" element={<ConditionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="*" element={<ErrorNotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
