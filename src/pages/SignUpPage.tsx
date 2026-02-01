import { clangenRunner } from "../python/clangenRunner";
import { Link, useNavigate } from "react-router";
import "../styles/sign-up-page.css";
import FileUploadButton from "../components/generic/FileUploadButton";
import { useEffect } from "react";
import { setCustomCss } from "../utils";

function SignUpPage() {
  const navigate = useNavigate();

  function handleImportClan(e: any) {
    const f = e.target.files[0];
    f.arrayBuffer()
      .then((buff: Int8Array) => {
        clangenRunner.importClan(buff);
      })
      .then(() => clangenRunner.reloadClan())
      .then(() => navigate("/"));
  }

  useEffect(() => {
    document.title = "Welcome! | ClanGen Simulator";
  })

  useEffect(() => {
    setCustomCss();
  }, []);

  return (
    <>
      <div id="signup">
        <p>
          Welcome to <b>ClanGen Simulator</b>, a project that aims to simulate
          Clan Generator in your browser.
        </p>

        <p>
          This site is a work in progress, so some
          features may be missing and there may be bugs.
        </p>

        <div className="signup-buttons">
          <Link className="btn" to="/new-clan">Create New Clan</Link>
          <div className="or">or</div>
          <FileUploadButton
            accept=".sav,.zip"
            tabIndex={0}
            onChange={handleImportClan}
          >
          Import Save
        </FileUploadButton>
        </div>
        <div className="footer">
          <a target="_blank" rel="noopener noreferrer" href="/credits">Credits</a> | <a target="_blank" rel="noopener noreferrer" href="https://github.com/clangensim/clangen-pyodide-react">Source</a>
        </div>
      </div>
    </>
  )
}

export default SignUpPage;
