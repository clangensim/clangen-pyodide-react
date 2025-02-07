import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Cat, clangenRunner } from "../python/clangen";
import Breadcrumbs from "../components/Breadcrumbs";
import Dialog from "../components/Dialog";
import Checkbox from "../components/Checkbox";

const defaultDeathHistory = "killed by a higher power";

function CatDangerousEditPage() {
  const [cat, setCat] = useState<Cat>();
  const params = useParams();
  const catID = params.id as string;

  const navigate = useNavigate();

  const [killModalOpen, setKillModalOpen] = useState(false);
  const [takeNineLives, setTakeNineLives] = useState(false);
  const [deathHistory, setDeathHistory] = useState("");

  useEffect(() => {
    const c = clangenRunner.getCat(catID);
    if (c) {
      document.title = `Editing ${c.name.display} | Clangen Simulator`;
    }
    setCat(c);
  }, [catID]);

  function handleDeath() {
    clangenRunner.killCat(catID, deathHistory, takeNineLives);
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
        title={`${cat?.name.display}'s Cause of Death`}
      >
        <div className="dialog-body">
          <label htmlFor="death-cause">This cat died when they were...</label>
          <textarea
            id="death-cause"
            value={deathHistory}
            onChange={(e) => setDeathHistory(e.currentTarget.value)}
            style={{ resize: "none", minWidth: "100%" }}
          />
          {cat && cat.status === "leader" && (
            <Checkbox
              label="Take all the leader's lives"
              checked={takeNineLives}
              onChange={() => setTakeNineLives(!takeNineLives)}
            />
          )}
        </div>
        <div className="dialog-footer">
          <button onClick={handleDeath}>OK</button>
        </div>
      </Dialog>

      {cat && (
        <div style={{ marginTop: "1em" }}>
          <button
            tabIndex={0}
            disabled={cat.dead}
            onClick={() => {
              setKillModalOpen(true);
              setDeathHistory(defaultDeathHistory);
            }}
          >
            Kill
          </button>
          <button
            tabIndex={0}
            disabled={cat.dead || cat.outside}
            onClick={handleExile}
          >
            Exile
          </button>
          <button
            tabIndex={0}
            disabled={!cat.pelt.accessory}
            onClick={handleDestroyAccessory}
          >
            Destroy accessory
          </button>
        </div>
      )}
    </>
  );
}

export default CatDangerousEditPage;
