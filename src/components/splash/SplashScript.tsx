import { SPLASH_KEY } from "@/lib/splash";

/**
 * Tiny blocking script placed in <head>. It runs before the first paint and:
 *  1. adds `html.js` so GSAP-revealed elements can start hidden only when JS works;
 *  2. flags low-power devices (`html[data-lite]`: Save-Data, ≤2 GB RAM or
 *     <4 CPU cores) so heavy scroll effects are skipped there;
 *  3. decides whether the intro splash plays — homepage only, once per browser
 *     session, never for people who prefer reduced motion.
 */
const code = `(function(){try{
var d=document.documentElement;d.classList.add('js');
var n=navigator,c=n.connection||{};
if(c.saveData||(n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<4))d.setAttribute('data-lite','1');
var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var seen=sessionStorage.getItem('${SPLASH_KEY}');
if(location.pathname==='/'&&!rm&&!seen)d.setAttribute('data-splash','1');
sessionStorage.setItem('${SPLASH_KEY}','1');
}catch(e){}})();`;

export function SplashScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
