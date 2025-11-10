import { RouterProvider } from "react-router";
import { hydrateRoot } from "react-dom/client";
import { routes } from "@react-router/dev/routes"; // generated automatically

hydrateRoot(document, <RouterProvider routes={routes} />);
