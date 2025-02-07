import { Link } from "react-router";
import FileUploadButton from "../components/FileUploadButton";
import Navbar from "../components/Navbar";
import { clangenRunner } from "../python/clangen";
import { download } from "../utils";
import { useEffect } from "react";
import ClanInfoDisplay from "../components/ClanInfoDisplay";

function HomePage() {
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

  useEffect(() => {
    document.title = " Clangen Simulator"
  }, []);

  return (
    <>
      <Navbar />

      <ClanInfoDisplay />

      <p>
        Welcome to <b>Clangen Simulator</b>, a project that aims to simulate
        Clan Generator in your browser. This site is a work in progress, so some features may
        be missing.
      </p>

      <p>
        <b>
          This site does not support being opened in multiple tabs. If you open
          it in multiple tabs, data may be lost.
        </b>
      </p>

      <p>
        Current Clangen version: <b>v0.11.2</b>
      </p>

      <p>Importing a save or starting a new Clan will delete your existing Clan. Be careful.</p>

      <div style={{marginBottom: "1em"}}>
        <Link tabIndex={0} className="button" to="/new-clan">New Clan</Link>
      </div>

      <FileUploadButton tabIndex={0} onChange={handleImportClan}>
        Import Save
      </FileUploadButton>
      <button tabIndex={0} onClick={handleExportClan}>Export Save</button>

      <p>See <Link to="/credits">here</Link> for credits information.</p>
    </>
  );
}

export default HomePage;
