import { hydrateRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "react-router";
import { routes } from "./routes";

const router = createRouter({
  routes,
  hydrationData: window.__staticRouterHydrationData,
});
hydrateRoot(document, <RouterProvider router={router} />);
