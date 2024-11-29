import { Link } from "react-router";

function Nav() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/events">Events</Link>
        </li>
        <li>
          <Link to="/cats">Cats</Link>
        </li>
      </ul>
    </div>
  )
}

export default Nav;