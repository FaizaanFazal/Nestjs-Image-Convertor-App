import { NavLink } from "react-router-dom";
import { Icon, type IconName } from "./Icon";

interface NavItemProps {
  to: string;
  icon: IconName;
  label: string;
}

export default function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        `flex items-center justify-center p-3 my-1 rounded-2xl hover:bg-purple-800/30 transition-colors ${
          isActive ? "bg-purple-700/80 text-purple-300" : "text-gray-400"
        }`
      }
    >
      <Icon name={icon} />
      <span className="sr-only">{label}</span>
    </NavLink>
  );
}
