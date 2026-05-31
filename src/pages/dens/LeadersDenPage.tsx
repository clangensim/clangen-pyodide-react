import { useEffect, useState } from "react";
import BasePage from "../../layout/BasePage";
import { Cat, OtherClan } from "../../python/types";
import { clangenRunner } from "../../python/clangenRunner";
import ClanSymbol from "../../components/Symbol";
import Radiobox from "../../components/generic/Radiobox";
import CatDisplay from "../../components/CatDisplay";
import { Link } from "react-router";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const crumbs = [
  {
    url: "/",
    label: "Home",
  },
  {
    url: "/dens",
    label: "Dens",
  },
  {
    url: "/leaders-den",
    label: "Leader's Den",
  },
];

type OutsiderAction = {
  cat_id: string;
  action: "search" | "invite" | "drive" | "hunt";
};

type OtherClanInteraction = {
  other_clan_name: string;
  action: "offend" | "praise";
};

function LeadersDenPage() {
  const [otherClans, setOtherClans] = useState<OtherClan[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);

  const [outsiderAction, setOutsiderAction] = useState<OutsiderAction>();
  const [otherClanInteraction, setOtherClanInteraction] =
    useState<OtherClanInteraction>();

  useEffect(() => {
    clangenRunner.getOtherClans().then((oc) => setOtherClans(oc));
    clangenRunner
      .getCats()
      .then((c) =>
        setCats(c.filter((c) => c.outside && !c.dead && !c.isDrivenOff)),
      );
  }, []);

  function isLost(cat: Cat) {
    return (
      cat.outside &&
      !cat.exiled &&
      !["kittypet", "loner", "rogue", "former Clancat"].includes(cat.status)
    );
  }

  function submitOutsiderInteraction() {
    if (outsiderAction === undefined) {
      return;
    }
    clangenRunner.scheduleOutsiderInteraction(
      outsiderAction.cat_id,
      outsiderAction.action,
    );
  }

  function submitOtherClanInteraction() {
    if (otherClanInteraction === undefined) {
      return;
    }
    clangenRunner.scheduleOtherClanInteraction(
      otherClanInteraction.other_clan_name,
      otherClanInteraction.action,
    );
  }

  return (
    <BasePage crumbs={crumbs}>
      Manage relationships with other cats who live nearby.
      <TabGroup vertical>
        <TabList className="button-row">
          <ul className="below-header row-list">
            <li>
              <Tab className="link-button">Gatherings</Tab>
            </li>
            <li>
              <Tab className="link-button">Order a Search</Tab>
            </li>
          </ul>
        </TabList>

        <TabPanels>
          <TabPanel>
            <h2>Gatherings</h2>
            <p className="below-header">
              Determine how to treat another Clan at the next Gathering.
            </p>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Clan</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {otherClans.map((oc) => (
                  <tr>
                    <td>
                      <ClanSymbol symbol={oc.symbol} />
                    </td>
                    <td>
                      <b>{oc.name}Clan</b> <br />
                      {oc.temperament} <br /> neutral
                    </td>
                    <td>
                      <Radiobox
                        checked={
                          otherClanInteraction?.other_clan_name === oc.name &&
                          otherClanInteraction.action === "offend"
                        }
                        onChange={() =>
                          setOtherClanInteraction({
                            other_clan_name: oc.name,
                            action: "offend",
                          })
                        }
                        label="Offend"
                        name="action"
                      />{" "}
                      <Radiobox
                        checked={
                          otherClanInteraction?.other_clan_name === oc.name &&
                          otherClanInteraction.action === "praise"
                        }
                        onChange={() =>
                          setOtherClanInteraction({
                            other_clan_name: oc.name,
                            action: "praise",
                          })
                        }
                        label="Praise"
                        name="action"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setOtherClanInteraction(undefined)}
              tabIndex={0}
              className="link-button"
            >
              Clear selection
            </button>
            <button
              disabled={otherClanInteraction === undefined}
              onClick={submitOtherClanInteraction}
              tabIndex={0}
              className="submit"
            >
              Submit
            </button>
          </TabPanel>

          <TabPanel>
            <h2>Order a Search</h2>
            <ul className="below-header">
              <li>Search for - Search for this lost cat to bring them home.</li>
              <li>Hunt down - Hunt down this cat and kill them.</li>
              <li>
                Invite in - Find this cat to invite them to join the Clan.
              </li>
              <li>Drive off - Drive this cat away if you find them.</li>
            </ul>
            {cats.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Cat</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cats.map((c) => (
                      <tr>
                        <td>
                          <Link to={`/cats/${c.ID}`}>
                            <CatDisplay
                              cat={c}
                              fuzzy={true}
                              w="50px"
                              h="50px"
                            />
                          </Link>
                        </td>
                        <td>
                          <b>{c.name.display}</b> <br />
                          {c.status} <br />
                        </td>
                        <td>
                          {isLost(c) && (
                            <Radiobox
                              checked={
                                c.ID == outsiderAction?.cat_id &&
                                outsiderAction.action === "search"
                              }
                              onChange={() =>
                                setOutsiderAction({
                                  cat_id: c.ID,
                                  action: "search",
                                })
                              }
                              label="Search for"
                              name="outsider-action"
                            />
                          )}
                          <Radiobox
                            checked={
                              c.ID == outsiderAction?.cat_id &&
                              outsiderAction.action === "hunt"
                            }
                            onChange={() =>
                              setOutsiderAction({
                                cat_id: c.ID,
                                action: "hunt",
                              })
                            }
                            label="Hunt down"
                            name="outsider-action"
                          />{" "}
                          <Radiobox
                            checked={
                              c.ID == outsiderAction?.cat_id &&
                              outsiderAction.action === "invite"
                            }
                            onChange={() =>
                              setOutsiderAction({
                                cat_id: c.ID,
                                action: "invite",
                              })
                            }
                            label="Invite in"
                            name="outsider-action"
                          />
                          <Radiobox
                            checked={
                              c.ID == outsiderAction?.cat_id &&
                              outsiderAction.action === "drive"
                            }
                            onChange={() =>
                              setOutsiderAction({
                                cat_id: c.ID,
                                action: "drive",
                              })
                            }
                            label="Drive off"
                            name="outsider-action"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  tabIndex={0}
                  onClick={() => setOutsiderAction(undefined)}
                  className="link-button"
                >
                  Clear selection
                </button>
                <button
                  onClick={submitOutsiderInteraction}
                  tabIndex={0}
                  className="submit"
                  disabled={outsiderAction === undefined}
                >
                  Submit
                </button>
              </>
            ) : (
              <p>There is nobody to search for.</p>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </BasePage>
  );
}

export default LeadersDenPage;
