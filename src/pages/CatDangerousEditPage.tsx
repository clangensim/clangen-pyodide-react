import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Cat } from "../python/types";
import { clangenRunner } from "../python/clangenRunner";
import Dialog from "../components/generic/Dialog";
import Checkbox from "../components/generic/Checkbox";
import BasePage from "../layout/BasePage";

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
    clangenRunner.getCat(catID).then((c) => {
      if (c) {
        document.title = `Editing ${c.name.display} | ClanGen Simulator`;
      }
      setCat(c);
    });
  }, [catID]);

  function handleDeath() {
    clangenRunner
      .killCat(catID, deathHistory, takeNineLives)
      .then(() => navigate(`/cats/${catID}`));
    navigate(`/cats/${catID}`);
  }

  function handleExile() {
    clangenRunner.exileCat(catID).then(() => navigate(`/cats/${catID}`));
  }

  function handleDestroyAccessory() {
    clangenRunner
      .destroyAccessory(catID)
      .then(() => navigate(`/cats/${catID}`));
  }

  let crumbs = undefined;
  if (cat) {
    crumbs = [
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
    ];
  }

  return (
    <BasePage crumbs={crumbs}>
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
            style={{ resize: "none", minWidth: "99%" }}
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
        <div className="button-row">
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
    </BasePage>
  );
}

export default CatDangerousEditPage;
