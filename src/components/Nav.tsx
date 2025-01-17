import { useEffect } from "react";
import { Link } from "react-router";
import { clangenRunner } from "../python/clangen";

function Nav() {

  /* 
    TODO: maybe this should be moved?
    it's only here because this element is on every page.

    it forcibly refreshes cats
    bc example cats that get created when you hit new clan
    get added to the "all_cats_list",
    which adds them to users clans.

    regular clangen runs a function to remove outside cats
    whenever you navigate to the start screen, but we can't
    control what screens users go to.
  */
  useEffect(() => {
    if (localStorage.getItem("queueCatRefresh")) {
      localStorage.removeItem("queueCatRefresh");
      clangenRunner.refreshCats();
    }
  }, []);

  return (
    <div style={{ marginBottom: "1em" }}>
      <Link className="button" to="/">
        Home
      </Link>
      <Link className="button" to="/cats">
        Cats
      </Link>
      <Link className="button" to="/events">
        Events
      </Link>
      <Link className="button" to="/patrols">
        Patrols
      </Link>
    </div>
  );
}

export default Nav;
