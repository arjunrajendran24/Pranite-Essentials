/** Shown while the catalog is fetched from Shopify (first visit after a cache refresh). */
export default function CatalogLoading() {
  return (
    <div className="container-page pb-8 pt-16 md:pt-24" aria-busy="true" aria-label="Loading products">
      <div className="h-4 w-24 animate-pulse rounded-full bg-sand-200/60" />
      <div className="mt-6 h-14 w-72 max-w-full animate-pulse rounded-2xl bg-sand-200/60" />
      <ul className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <li key={i}>
            <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-sand-200/50" />
            <div className="mt-5 h-6 w-2/3 animate-pulse rounded-full bg-sand-200/60" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-sand-200/50" />
            <div className="mt-5 h-12 animate-pulse rounded-full bg-sand-200/50" />
          </li>
        ))}
      </ul>
    </div>
  );
}
