import { Link } from "react-router";

type Breadcrumb = {
  url?: string;
  label: string;
};

function Breadcrumbs({ crumbs }: { crumbs: Breadcrumb[] }) {
  return (
    <div className="breadcrumbs">
      {crumbs.map((crumb, index) => {
        const separator = crumbs.length - 1 === index ? "" : " / ";
        if (index === crumbs.length - 1) {
          return <span key={index}>{crumb.label}</span>;
        }
        if (crumb.url === undefined) {
          return (
          <span key={index}>
            {crumb.label} {separator}
          </span>
          )
        }
        return (
          <span key={index}>
            <Link tabIndex={0} to={crumb.url}>
              {crumb.label}
            </Link>
            {separator}
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;
export type { Breadcrumb };
