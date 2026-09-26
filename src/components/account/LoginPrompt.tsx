import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * "Have an account? Log in to check out faster." — same prompt as the live
 * store. Links to the Shopify-hosted customer account sign-in (passwordless:
 * email + one-time code, or Shop). After signing in, Shopify pre-fills the
 * customer's details at checkout.
 */
export function LoginPrompt({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <p className={cn("text-sm text-ink-500", className)}>
      Have an account?{" "}
      <a href={site.accountUrl} onClick={onNavigate} className="link-underline font-semibold text-forest-700">
        Log in
      </a>{" "}
      to check out faster.
    </p>
  );
}
