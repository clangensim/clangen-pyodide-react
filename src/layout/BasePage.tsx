import Breadcrumbs from "../components/Breadcrumbs";
import { Breadcrumb } from "../components/Breadcrumbs";
import Navbar from "../components/Navbar";

function BasePage({ children, crumbs }: { children: React.ReactNode, crumbs?: Breadcrumb[] }) {

  return (
    <>
      <div className="head">
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