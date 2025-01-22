import { Link } from "react-router";

type Breadcrumb = {
  url: string;
  label: string;
};

function Breadcrumbs({ crumbs }: { crumbs: Breadcrumb[] }) {
  return (
    <div>
      {crumbs.map((crumb, index) => {
        const separator = crumbs.length - 1 === index ? "" : " / ";
        if (index === crumbs.length - 1) {
          return <span key={index}>{crumb.label}</span>;
        }
        return (
          <span key={index}>
            <Link tabIndex={0} to={crumb.url}>{crumb.label}</Link>
            {separator}
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;
