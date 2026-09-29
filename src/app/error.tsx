"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { LeafMark } from "@/components/decor/LeafMark";

/** Shown if a page fails to render, e.g. when the store (Shopify) can't be reached. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="wash-botanical">
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <LeafMark className="h-32 w-auto" />
        <p className="eyebrow mt-10">Something went wrong</p>
        <h1 className="text-h2 mt-4 max-w-xl text-forest-900">
          Our shelves are taking <span className="italic-accent text-forest-600">a breather.</span>
        </h1>
        <p className="mt-4 max-w-md text-ink-500">We couldn’t load this page just now. Please try again in a moment.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="secondary">
            Back to home
          </ButtonLink>
          <Button onClick={reset} icon="arrow-right">
            Try again
          </Button>
        </div>
      </div>
    </section>
  );
}
