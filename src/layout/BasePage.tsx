import { useQuery } from "@tanstack/react-query";
import Breadcrumbs from "./Breadcrumbs";
import { Breadcrumb } from "./Breadcrumbs";
import Navbar from "./Navbar";
import { clangenRunner } from "../python/clangenRunner";
import Pluralize from "../components/Pluralize";
import { Link } from "react-router";

function BasePage({
  children,
  crumbs,
}: {
  children: React.ReactNode;
  crumbs?: Breadcrumb[];
}) {
  const query = useQuery({
    queryKey: ["claninfo"],
    queryFn: clangenRunner.getClanInfo.bind(clangenRunner),
  });

  const clanInfo = query.data;

  if (query.status === "error") {
    return <>Error</>;
  }

  return (
    <>
      <div className="head">
        <div className="profile-info">
          <ul className="row-list">
            <li>
              {clanInfo?.name} - {clanInfo?.age}{" "}
              <Pluralize num={clanInfo?.age}>moon</Pluralize>
            </li>
            <li>{clanInfo?.season}</li>
          </ul>
          <Link to="/events" className="btn btn-secondary profile-info_next-moon">
            Next Moon →
          </Link>
        </div>
      </div>

      <div className="body">
        <Navbar />

        {crumbs && <Breadcrumbs crumbs={crumbs} />}

        <main>{children}</main>
      </div>
    </>
  );
}

export default BasePage;
