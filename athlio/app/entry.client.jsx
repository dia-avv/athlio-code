import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@react-router/react";

const BASENAME = "/athlio";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser basename={BASENAME} />
    </StrictMode>,
  );
});
