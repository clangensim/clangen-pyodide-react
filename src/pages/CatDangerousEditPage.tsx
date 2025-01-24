import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Cat, clangenRunner } from "../python/clangen";
import Breadcrumbs from "../components/Breadcrumbs";
import Dialog from "../components/Dialog";

const defaultDeathHistory = "This cat was killed by a higher power";

// TODO: support killing the leader
function CatDangerousEditPage() {
  const [cat, setCat] = useState<Cat>();
  const params = useParams();
  const catID = params.id as string;

  const navigate = useNavigate();

  const [killModalOpen, setKillModalOpen] = useState(false);
  const [deathHistory, setDeathHistory] = useState(defaultDeathHistory);

  useEffect(() => {
    setCat(clangenRunner.getCat(catID));
  }, [catID]);

  function handleDeath() {
    clangenRunner.killCat(catID, deathHistory);
    navigate(`/cats/${catID}`);
  }

  function handleExile() {
    clangenRunner.exileCat(catID);
    navigate(`/cats/${catID}`);
  }

  function handleDestroyAccessory() {
    clangenRunner.destroyAccessory(catID);
    navigate(`/cats/${catID}`);
  }

  return (
    <>
      <Navbar />
      {cat && (
        <Breadcrumbs
          crumbs={[
            {
              url: "/",
              label: "Home",
            },
            {
              url: "/cats",
              label: "Cats",
            },
            {
              url: `/cats/${catID}`,
              label: cat.name.display,
            },
            {
              url: `/cats/${catID}/edit/dangerous`,
              label: "Dangerous",
            },
          ]}
        />
      )}

      <Dialog
        opened={killModalOpen}
        onClose={() => setKillModalOpen(false)}
        title={`Kill ${cat?.name.display}`}
      >
        <div className="dialog-body">
          <label>How did this cat die?</label>
          <textarea
            value={deathHistory}
            onChange={(e) => setDeathHistory(e.currentTarget.value)}
            style={{ resize: "none", minWidth: "100%" }}
          />
        </div>
        <div className="dialog-footer">
          <button onClick={handleDeath}>OK</button>
        </div>
      </Dialog>

      {cat && (
        <div style={{ marginTop: "1em" }}>
          <button
            disabled={cat.dead || cat.status === "leader"}
            onClick={() => {
              setKillModalOpen(true);
              setDeathHistory(defaultDeathHistory);
            }}
          >
            Kill
          </button>
          <button disabled={cat.dead || cat.outside} onClick={handleExile}>
            Exile
          </button>
          <button
            disabled={!cat.pelt.accessory}
            onClick={handleDestroyAccessory}
          >
            Destroy accessory
          </button>
          {cat.status === "leader" && (
            <p>NOTE: Killing the leader is currently not supported.</p>
          )}
        </div>
      )}
    </>
  );
}

export default CatDangerousEditPage;
