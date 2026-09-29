import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { TanoraHighlight } from "@/components/home/TanoraHighlight";
import { ScienceOfGlow } from "@/components/home/ScienceOfGlow";
import { Marquee } from "@/components/home/Marquee";
import { PraniteStandard } from "@/components/home/PraniteStandard";
import { TrackOrderBand } from "@/components/home/TrackOrderBand";
import { getFeaturedProduct, toCartItem } from "@/lib/catalog";

export default async function HomePage() {
  const product = await getFeaturedProduct();
  const href = product ? `/products/${product.handle}` : "/catalog";

  return (
    <>
      <Hero productHref={href} />
      <Philosophy />
      {product && (
        <TanoraHighlight
          href={href}
          price={product.price.amount}
          summary={product.summary}
          ingredients={product.content?.heroIngredients ?? []}
          cartItem={toCartItem(product)}
          available={product.available}
        />
      )}
      <ScienceOfGlow />
      <Marquee />
      <PraniteStandard />
      <TrackOrderBand />
    </>
  );
}
