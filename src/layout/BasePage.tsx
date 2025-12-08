import { useQuery } from "@tanstack/react-query";
import Breadcrumbs from "./Breadcrumbs";
import { Breadcrumb } from "./Breadcrumbs";
import Navbar from "./Navbar";
import { clangenRunner } from "../python/clangenRunner";
import Pluralize from "../components/generic/Pluralize";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";

function BasePage({
  children,
  crumbs,
}: {
  children: React.ReactNode;
  crumbs?: Breadcrumb[];
}) {
  const navigator = useNavigate();
  const query = useQuery({
    queryKey: ["claninfo"],
    queryFn: async () => await clangenRunner.getClanInfo(),
  });

  const clanInfo = query.data;

  useEffect(() => {
    // set site theme before custom css so it can be overwritten
    let siteTheme = localStorage.getItem("site-theme");
    if (!siteTheme) {
      localStorage.setItem("site-theme", "theme-light");
      siteTheme = "theme-light";
    }
    // probably a better way of clearing the class list but oh well
    let classList = document.documentElement.classList;
    classList.forEach((element) => {
      classList.remove(element);
    });
    classList.add(siteTheme);

    const customCssElement = document.getElementById("custom-css");
    const customCss = localStorage.getItem("custom-css");
    // need the last condition or there will be flash of unstyled content
    if (customCssElement && customCss && customCssElement.textContent !== customCss) {
      customCssElement.textContent = customCss;
    }
  }, []);

  useEffect(() => {
    const headerElement = document.getElementById("heading-inject-css");

    if (headerElement) {
      var textContent = `.head { background-image: url("/camp_bg/forest/${clanInfo?.season.toLowerCase().replace("-", "")}_${clanInfo?.campBg}_light.png"); }`;
      if (headerElement.textContent !== textContent) {
        headerElement.textContent = `.head { background-image: url("/camp_bg/forest/${clanInfo?.season.toLowerCase().replace("-", "")}_${clanInfo?.campBg}_light.png"); }`;
      }
    }
  }, [clanInfo]);

  if (query.status === "pending") {
    return (
      <div id="preloader-container">
        <div id="preloader" />
        Loading Clan...
      </div>
    );
  }

  if (query.status === "error") {
    console.error(query.error);
    return <>Error: {query.error.message}</>;
  }

  if (clanInfo === null) {
    navigator("/signup");
    return <></>;
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
          <Link to="/moonskip" tabIndex={0} className="btn btn-secondary profile-info_next-moon">
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
