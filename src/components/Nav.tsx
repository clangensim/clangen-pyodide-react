import { Link } from "react-router";

function Nav() {
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
    </div>
  );
}

export default Nav;
