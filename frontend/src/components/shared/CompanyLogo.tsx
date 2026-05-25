import { cn } from "@/lib/utils";

const BRAND_COLORS = [
  "#3B82F6", "#10B981", "#7C3AED", "#F97316", "#F43F5E",
  "#8B5CF6", "#EC4899", "#F59E0B", "#14B8A6", "#6366F1",
  "#84CC16",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getBrandColor(name: string): string {
  const index = hashString(name) % BRAND_COLORS.length;
  return BRAND_COLORS[index];
}

function getInitials(name: string): string {
  return name
    .split(/[\s&-]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface CompanyLogoProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-7 h-7 text-[10px] rounded-lg",
  md: "w-10 h-10 text-xs rounded-md",
  lg: "w-12 h-12 text-sm rounded-md",
};

export function CompanyLogo({ name, size = "md", className }: CompanyLogoProps) {
  const color = getBrandColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "flex items-center justify-center font-bold text-white shrink-0",
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  );
}

export function CompanyLogoSmall({ name, className }: { name: string; className?: string }) {
  const color = getBrandColor(name);
  return (
    <div
      className={cn(
        "w-2 h-2 rounded-full shrink-0",
        className
      )}
      style={{ backgroundColor: color }}
      title={name}
    />
  );
}

export { getBrandColor, getInitials };
