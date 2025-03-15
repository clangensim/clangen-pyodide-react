import { useEffect } from "react";
import { Link } from "react-router";
import { clangenRunner } from "../python/clangen";

function Navbar() {
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
    <nav className="navbar">
      <Link tabIndex={0} className=" nav-item" to="/">
        Home
      </Link>
      <Link tabIndex={0} className=" nav-item" to="/cats">
        Cats
      </Link>
      <Link tabIndex={0} className=" nav-item" to="/events">
        Events
      </Link>
      <Link tabIndex={0} className=" nav-item" to="/patrols">
        Patrol
      </Link>
      <Link tabIndex={0} className=" nav-item" to="/mediate">
        Mediate
      </Link>
      <Link tabIndex={0} className=" nav-item" to="/settings">
        Settings
      </Link>
    </nav>
  );
}

export default Navbar;
