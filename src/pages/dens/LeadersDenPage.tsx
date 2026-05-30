import { useEffect, useState } from "react";
import BasePage from "../../layout/BasePage";
import { Cat, OtherClan } from "../../python/types";
import { clangenRunner } from "../../python/clangenRunner";
import ClanSymbol from "../../components/Symbol";
import Radiobox from "../../components/generic/Radiobox";
import CatDisplay from "../../components/CatDisplay";
import { Link } from "react-router";

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

function LeadersDenPage() {
  const [otherClans, setOtherClans] = useState<OtherClan[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    clangenRunner.getOtherClans().then((oc) => setOtherClans(oc));
    clangenRunner.getCats().then((c) => setCats(c));
  }, []);

  function isLost(cat: Cat) {
    return (
      cat.outside &&
      !cat.exiled &&
      !["kittypet", "loner", "rogue", "former Clancat"].includes(cat.status)
    );
  }

  return (
    <BasePage crumbs={crumbs}>
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
                <Radiobox label="Offend" name="action" />{" "}
                <Radiobox label="Praise" name="action" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="link-button">Clear selection</button>

      <h2>Order a Search</h2>
      <ul className="below-header">
        <li>
          Search for - Search for this lost cat to bring them home.
        </li>
        <li>Hunt down - Hunt down this cat and kill them.</li>
        <li>
          Invite in - Find this cat to invite them to join the Clan.
        </li>
        <li>Drive off - Drive this cat away if you find them.</li>
      </ul>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Cat</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cats
            .filter((c) => c.outside && !c.dead && !c.isDrivenOff)
            .map((c) => (
              <tr>
                <td>
                  <Link to={`/cats/${c.ID}`} >
                  <CatDisplay cat={c} fuzzy={true} w="50px" h="50px" />
                  </Link>
                </td>
                <td>
                  <b>{c.name.display}</b> <br />
                  {c.status} <br />
                </td>
                <td>
                  {isLost(c) && (
                    <Radiobox label="Search for" name="outsider-action" />
                  )}
                  <Radiobox label="Hunt down" name="outsider-action" />{" "}
                  <Radiobox label="Invite in" name="outsider-action" />
                  <Radiobox label="Drive off" name="outsider-action" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button className="link-button">Clear selection</button>
      <button className="submit">Submit</button>
    </BasePage>
  );
}

export default LeadersDenPage;
