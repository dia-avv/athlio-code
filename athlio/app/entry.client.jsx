import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "react-router"; // yes, name is cursed, it’s React Router’s client

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser basename="/athlio-code" />
    </StrictMode>,
  );
});
