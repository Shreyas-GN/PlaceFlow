import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  innerClassName?: string;
}

export function Section({ children, className, innerClassName, id, ...props }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 px-6 border-t border-gray-200", className)} {...props}>
      <div className={cn("max-w-7xl mx-auto", innerClassName)}>
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-16 max-w-3xl">
      <h2 className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-widest">
        {subtitle}
      </h2>
      <h3 className="text-[clamp(28px,4vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-gray-900">
        {title}
      </h3>
    </div>
  );
}
