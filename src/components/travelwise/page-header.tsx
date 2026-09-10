import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero-gradient text-ink-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground/70">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm text-ink-foreground/80 md:text-base">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
