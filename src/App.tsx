import Nav from "./components/Nav";
import { clangenRunner } from "./python/clangen";
import { download } from "./utils";

function App() {
  function handleExportClan() {
    const f: Int8Array = clangenRunner.exportClan();
    download(new Blob([f]));
  }

  return (
    <>
      <Nav />

      <p>
        Welcome to <b>Clangen Simulator</b>, a project that aims to simulate Clan Generator in your browser.
      </p>

      <button onClick={handleExportClan}>Export Save</button>
    </>
  );
}

export default App;
