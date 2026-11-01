import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Section({
  children,
  className,
  id,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section id={id} className={cn("relative py-20 sm:py-24", className)}>
      <Container>
        {(eyebrow || title || description) && (
          <header className="mb-12 max-w-3xl border-b border-line pb-10">
            {eyebrow && <p className="eyebrow mb-5 text-muted">{eyebrow}</p>}
            {title && <h1 className="section-heading text-text">{title}</h1>}
            {description && (
              <p className="mt-4 text-lg text-muted">{description}</p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
