import { Fragment } from "react";
import type { PolicyBlock } from "@/content/policies";

/**
 * Minimal inline formatter for migrated copy:
 *   **bold**, [label](url), bare e-mail addresses and +91 phone numbers → links.
 * Deliberately tiny — no markdown dependency shipped for a few policy pages.
 */
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|[\w.+-]+@[\w-]+\.[\w.]+|\+91[\d\s]{10,13}\d)/g;

export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((p) => p !== "");
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i}>
              <Inline text={part.slice(2, -2)} />
            </strong>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const external = /^https?:/.test(link[2]);
          return (
            <a key={i} href={link[2]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {link[1]}
            </a>
          );
        }
        if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
          return (
            <a key={i} href={`mailto:${part}`}>
              {part}
            </a>
          );
        }
        if (/^\+91[\d\s]+$/.test(part)) {
          return (
            <a key={i} href={`tel:${part.replace(/\s/g, "")}`}>
              {part}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function RichText({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <div className="prose-pranite">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return <h2 key={i}>{b.text}</h2>;
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "p":
            return (
              <p key={i}>
                <Inline text={b.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    {it.lead && <strong>{it.lead}: </strong>}
                    <Inline text={it.text} />
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
