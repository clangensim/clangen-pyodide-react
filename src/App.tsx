import FileUploadButton from "./components/FileUploadButton";
import Nav from "./components/Nav";
import { clangenRunner } from "./python/clangen";
import { download } from "./utils";

function App() {
  function handleExportClan() {
    const f: Int8Array = clangenRunner.exportClan();
    download(new Blob([f]));
  }

  function handleImportClan(e: any) {
    const f = e.target.files[0];
    f.arrayBuffer().then((buff: Int8Array) => {
      clangenRunner.importClan(buff);
    });
  }

  return (
    <>
      <Nav />

      <p>
        Welcome to <b>Clangen Simulator</b>, a project that aims to simulate
        Clan Generator in your browser.
      </p>

      <p>Importing a save will delete all existing Clans. Be careful.</p>

      <FileUploadButton onChange={handleImportClan}>
        Import Save
      </FileUploadButton>
      <button onClick={handleExportClan}>Export Save</button>
    </>
  );
}

export default App;
