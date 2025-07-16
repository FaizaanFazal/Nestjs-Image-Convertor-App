import NavItem from "../ui/NavItem";
import { type IconName } from "../ui/Icon";

type Link = {
    to: string;
    icon: IconName;
    label: string;
};

const links: Link[] = [
    { to: "/", icon: "home", label: "Convertor" },
    { to: "/tools", icon: "tools", label: "Tools" },
    { to: "/compressor", icon: "compressor", label: "Compressor" },
];

export default function Sidebar() {
    return (
        <nav className="flex flex-row md:flex-col fixed bottom-0 md:top-0 md:left-0 z-30 w-full md:w-20 h-16 md:h-screen bg-[#2b272b] border-t md:border-r border-[#2b272b]/90 justify-evenly md:justify-start items-center md:items-center transition-all">
            <div className="flex flex-row md:flex-col flex-1">
                {links.map((link) => (
                    <NavItem key={link.to} {...link} />
                ))}
            </div>
            {/* Contact always at end */}
            <div className="hidden md:flex flex-col flex-shrink-0 mb-6 mt-auto">
                <NavItem to="/contact" icon="contact" label="Contact" />
            </div>
            {/* On mobile, show contact inline */}
            <div className="md:hidden flex">
                <NavItem to="/contact" icon="contact" label="Contact" />
            </div>
        </nav>
    );
}
