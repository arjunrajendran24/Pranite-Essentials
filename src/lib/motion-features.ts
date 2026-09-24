/**
 * Motion features, loaded asynchronously by <LazyMotion>. Keeping this in its
 * own module lets the bundler split it out of the first-load JavaScript; the
 * `m` components render immediately and start animating once it arrives.
 */
import { domAnimation } from "motion/react";

export default domAnimation;
