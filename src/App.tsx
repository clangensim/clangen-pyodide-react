import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import NewClanPage from "./pages/NewClanPage";
import EventsPage from "./pages/EventsPage";
import PatrolsPage from "./pages/PatrolsPage";
import MediationPage from "./pages/MediationPage";
import CatsPage from "./pages/CatsPage";
import CatEditPage from "./pages/CatEditPage";
import CatProfilePage from "./pages/CatProfilePage";
import CatDangerousEditPage from "./pages/CatDangerousEditPage";
import RelationshipsPage from "./pages/RelationshipsPage";
import ConditionsPage from "./pages/ConditionsPage";
import SettingsPage from "./pages/SettingsPage";
import CreditsPage from "./pages/CreditsPage";
import ErrorNotFoundPage from "./pages/ErrorNotFoundPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new-clan" element={<NewClanPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/patrols" element={<PatrolsPage />} />
          <Route path="/mediate" element={<MediationPage />} />
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
    </>
  )
}

export default App;