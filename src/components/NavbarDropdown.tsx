import { ReactElement } from "react";

function NavbarDropdown({
  name,
  children
}: {
  name: string,
  children: ReactElement[] | ReactElement
}) {
  return (
    <div className="nav-item nav-dropdown">
      {name}
      <div className="nav-children">
        {children}
      </div>
    </div>
  );
}

export default NavbarDropdown;
