import { ReactElement } from "react";

const NavItem: React.FC<{ title: string; href: string; icon: ReactElement; newTab?: boolean }> = (props) => (
  <a
    title={props.title}
    href={props.href}
    className="hover:text-primary"
    {...(props.newTab && { target: "_blank", rel: "noreferrer" })}
  >
    {props.icon}
  </a>
);

export default NavItem;
