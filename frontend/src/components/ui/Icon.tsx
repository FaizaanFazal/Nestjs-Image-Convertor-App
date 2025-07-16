import { Home, Settings, Mail, Scissors, type LucideIcon } from "lucide-react";

const icons = {
  home: Home,
  tools: Settings,
  contact: Mail,
  compressor: Scissors,
} as const;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 28,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const LucideIconComponent: LucideIcon = icons[name];
  return <LucideIconComponent size={size} className={className} />;
}
