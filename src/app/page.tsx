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
  const href = `/products/${product.handle}`;

  return (
    <>
      <Hero productHref={href} />
      <Philosophy />
      <TanoraHighlight
        href={href}
        price={product.price.amount}
        summary={product.summary}
        ingredients={product.heroIngredients}
        cartItem={toCartItem(product)}
      />
      <ScienceOfGlow />
      <Marquee />
      <PraniteStandard />
      <TrackOrderBand />
    </>
  );
}
