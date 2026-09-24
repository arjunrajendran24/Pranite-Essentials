import { ButtonLink } from "@/components/ui/Button";
import { LeafMark } from "@/components/decor/LeafMark";

export default function NotFound() {
  return (
    <section className="wash-botanical">
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <LeafMark className="h-32 w-auto" />
        <p className="eyebrow mt-10">404</p>
        <h1 className="text-h2 mt-4 max-w-xl text-forest-900">
          This path has gone back to <span className="italic-accent text-forest-600">nature.</span>
        </h1>
        <p className="mt-4 max-w-md text-ink-500">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/catalog" variant="secondary">
            Browse the catalog
          </ButtonLink>
          <ButtonLink href="/" icon="arrow-right">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
