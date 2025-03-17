import Breadcrumbs from "../components/Breadcrumbs";
import { Breadcrumb } from "../components/Breadcrumbs";
import Navbar from "../components/Navbar";

function BasePage({ children, crumbs }: { children: React.ReactNode, crumbs?: Breadcrumb[] }) {

  return (
    <>
      <div className="head">
        <div className="profile-info">
          <ul className="row-list">
            <li>ClanName</li>
            <li>?? Moons</li>
          </ul>
          <a href="#" className="btn btn-secondary profile-info_next-moon">Next Moon →</a>
        </div>
      </div>

      <div className="body">
        <Navbar />

        { crumbs &&
          <Breadcrumbs 
          crumbs={crumbs}
          />
        }

        <main>
          { children }
        </main>
      </div>
    </>
  )
}

export default BasePage;