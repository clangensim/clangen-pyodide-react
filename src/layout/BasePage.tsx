import { useQuery } from "@tanstack/react-query";
import Breadcrumbs from "../components/Breadcrumbs";
import { Breadcrumb } from "../components/Breadcrumbs";
import Navbar from "../components/Navbar";
import { clangenRunner } from "../python/clangen";
import Pluralize from "../components/Pluralize";

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
          <a href="#" className="btn btn-secondary profile-info_next-moon">
            Next Moon →
          </a>
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
