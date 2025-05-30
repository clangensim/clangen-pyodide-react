import { Link } from "react-router";
import FileUploadButton from "../components/generic/FileUploadButton";
import { clangenRunner } from "../python/clangenRunner";
import { download } from "../utils";
import { useEffect } from "react";
import ClanInfoDisplay from "../components/ClanInfoDisplay";
import BasePage from "../layout/BasePage";
import { useQueryClient } from "@tanstack/react-query";

function HomePage() {
  const queryClient = useQueryClient();
  async function handleExportClan() {
    const f: ArrayBuffer = await clangenRunner.exportClan();
    download(new Blob([f]));
  }

  function handleImportClan(e: any) {
    const f = e.target.files[0];
    f.arrayBuffer()
      .then((buff: Int8Array) => {
        clangenRunner.importClan(buff);
      })
      .then(() => clangenRunner.reloadClan())
      .then(() => queryClient.invalidateQueries());
  }

  useEffect(() => {
    document.title = " ClanGen Simulator";
  }, []);

  return (
    <BasePage>
      <ClanInfoDisplay />

      <p>
        Welcome to <b>ClanGen Simulator</b>, a project that aims to simulate
        Clan Generator in your browser. This site is a work in progress, so some
        features may be missing and there may be bugs.
      </p>

      {!("SharedWorker" in window) && 
        <p>
          <b>Your browser does not support opening this site in multiple tabs.</b> If you try, data may be lost.
        </p>
      }

      <p>
        Current Clangen version: <b>v0.11.2</b>
      </p>

      <p>
        Importing a save or starting a new Clan will delete your existing Clan.
        Be careful.
      </p>

      <div style={{ marginBottom: "1em" }}>
        <Link className="btn" tabIndex={0} to="/new-clan">
          New Clan
        </Link>
      </div>

      <div className="button-row">
        <FileUploadButton
          accept=".sav"
          tabIndex={0}
          onChange={handleImportClan}
        >
          Import Save
        </FileUploadButton>
        <button tabIndex={0} onClick={handleExportClan}>
          Export Save
        </button>
      </div>

      <p>
        See <a target="_blank" rel="noopener noreferrer" href="/credits">here</a> for credits information.
        See <a target="_blank" rel="noopener noreferrer" href="https://github.com/clangensim/clangen-pyodide-react">here</a> for source code.
      </p>
    </BasePage>
  );
}

export default HomePage;
