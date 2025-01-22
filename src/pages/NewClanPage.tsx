import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Cat, clangenRunner } from "../python/clangen";
import CatDisplay from "../components/CatDisplay";

function NewClanPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [leader, setLeader] = useState<string>("");
  const [deputy, setDeputy] = useState<string>("");
  const [med, setMed] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    setCats(clangenRunner.initializeStarterCats());
  }, []);

  useEffect(() => {
    localStorage.setItem("queueCatRefresh", "true");
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;

    if (!target.reportValidity()) {
      return;
    }

    const otherCats: string[] = [];
    target["other-cats-checkbox"].forEach((el: any) => {
      if (el.value === leader) {
        return;
      }
      if (el.value === deputy) {
        return;
      }
      if (el.value === med) {
        return;
      }

      if (el.checked) {
        otherCats.push(el.value);
      }
    });

    clangenRunner
      .createClan(
        target["clan-name"].value,
        leader,
        deputy,
        med,
        target["biome"].value,
        "camp1",
        target["game-mode"].value,
        otherCats,
        target["season"].value,
      )
      .then(() => {
        localStorage.removeItem("queueCatRefresh");
        navigate("/cats");
      });
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
        <fieldset>
          <legend>Clan Name*</legend>
          <input
            tabIndex={0}
            type="text"
            name="clan-name"
            id="clan-name-input"
            required
          ></input>
          -Clan
        </fieldset>

        <fieldset>
          <legend>Game Mode</legend>
          <div>
            <input
              tabIndex={0}
              id="classic-radio"
              type="radio"
              name="game-mode"
              value="classic"
              defaultChecked
            ></input>
            <label htmlFor="classic-radio">Classic</label>
          </div>

          <div>
            <input
              tabIndex={0}
              id="expanded-radio"
              type="radio"
              name="game-mode"
              value="expanded"
            ></input>
            <label htmlFor="expanded-radio">Expanded</label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Cats</legend>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
          >
            {cats.map((cat) => (
              <div
                className="raised"
                style={{
                  display: "flex",
                  minWidth: 0,
                  width: "inherit",
                  flexDirection: "column",
                }}
              >
                <div>{cat.name.display}</div>
                <div>{cat.gender}</div>
                <div>{cat.age}</div>
                <div>{cat.trait}</div>
                <div>{cat.moons} moons</div>
                <CatDisplay pelt={cat.pelt} age={cat.age} />
              </div>
            ))}
          </div>

          <fieldset>
            <legend>Roles*</legend>
            <div>
              Leader
              <div className="dropdown">
                <select
                  name="leader"
                  size={1}
                  value={leader}
                  onChange={(e) => setLeader(e.target.value)}
                  required
                >
                  <option value={""}></option>
                  {cats.map((cat) => {
                    if (cat.ID === deputy) {
                      return;
                    }
                    if (cat.ID === med) {
                      return;
                    }
                    if (cat.status === "warrior") {
                      return <option value={cat.ID}>{cat.name.display}</option>;
                    }
                  })}
                </select>
                <div className="dropdown-button"></div>
              </div>
            </div>

            <div>
              Deputy
              <div className="dropdown">
                <select
                  name="deputy"
                  size={1}
                  value={deputy}
                  onChange={(e) => setDeputy(e.target.value)}
                  required
                >
                  <option value={""}></option>
                  {cats.map((cat) => {
                    if (cat.ID === leader) {
                      return;
                    }
                    if (cat.ID === med) {
                      return;
                    }
                    if (cat.status === "warrior") {
                      return <option value={cat.ID}>{cat.name.display}</option>;
                    }
                  })}
                </select>
                <div className="dropdown-button"></div>
              </div>
            </div>

            <div>
              Medicine Cat
              <div className="dropdown">
                <select
                  name="med"
                  size={1}
                  value={med}
                  onChange={(e) => setMed(e.target.value)}
                  required
                >
                  <option value={""}></option>
                  {cats.map((cat) => {
                    if (cat.ID === leader) {
                      return;
                    }
                    if (cat.ID === deputy) {
                      return;
                    }
                    if (cat.status === "warrior") {
                      return <option value={cat.ID}>{cat.name.display}</option>;
                    }
                  })}
                </select>
                <div className="dropdown-button"></div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Other Cats</legend>
            {cats.map((cat) => {
              const id = `${cat.ID}-cat-checkbox`;
              if (cat.ID === leader) {
                return;
              }
              if (cat.ID === deputy) {
                return;
              }
              if (cat.ID === med) {
                return;
              }
              return (
                <div>
                  <input
                    tabIndex={0}
                    id={id}
                    value={cat.ID}
                    name="other-cats-checkbox"
                    type="checkbox"
                  ></input>
                  <label htmlFor={id}>{cat.name.display}</label>
                </div>
              );
            })}
          </fieldset>
        </fieldset>

        <fieldset>
          <legend>Biome</legend>

          <div>
            <input
              tabIndex={0}
              type="radio"
              id="mountain-radio"
              value="Mountainous"
              name="biome"
            ></input>
            <label htmlFor="mountain-radio">Mountainous</label>
          </div>

          <div>
            <input
              tabIndex={0}
              type="radio"
              id="plains-radio"
              value="Plains"
              name="biome"
              defaultChecked
            ></input>
            <label htmlFor="plains-radio">Plains</label>
          </div>

          <div>
            <input
              tabIndex={0}
              type="radio"
              id="forest-radio"
              value="Forest"
              name="biome"
            ></input>
            <label htmlFor="forest-radio">Forest</label>
          </div>

          <div>
            <input
              tabIndex={0}
              type="radio"
              id="beach-radio"
              value="Beach"
              name="biome"
            ></input>
            <label htmlFor="beach-radio">Beach</label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Starting Season</legend>

          <div>
            <input
              tabIndex={0}
              type="radio"
              id="fall-radio"
              value="Leaf-fall"
              name="season"
            ></input>
            <label htmlFor="fall-radio">Leaf-fall (Fall)</label>
          </div>

          <div>
            <input
              tabIndex={0}
              type="radio"
              id="winter-radio"
              value="Leaf-bare"
              name="season"
            ></input>
            <label htmlFor="winter-radio">Leaf-bare (Winter)</label>
          </div>

          <div>
            <input
              tabIndex={0}
              type="radio"
              id="spring-radio"
              value="Newleaf"
              name="season"
              defaultChecked
            ></input>
            <label htmlFor="spring-radio">Newleaf (Spring)</label>
          </div>

          <div>
            <input
              tabIndex={0}
              type="radio"
              id="summer-radio"
              value="Greenleaf"
              name="season"
            ></input>
            <label htmlFor="summer-radio">Greenleaf (Summer)</label>
          </div>
        </fieldset>

        <div>
          <button tabIndex={0} type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}

export default NewClanPage;
