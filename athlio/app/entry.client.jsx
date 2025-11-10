import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

hydrateRoot(
  document.getElementById("root"),
  <RouterProvider router={router} />,
);
