import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import "./app.css";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/NavBar";

export function Layout({ children }) {
  const { pathname } = useLocation();
  const hideNavbar =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/intro") ||
    pathname.startsWith("/setup-profile");
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Athlio</title>
        <link
          href="https://fonts.cdnfonts.com/css/tt-firs-neue-trl"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <UserProvider>
          {!hideNavbar && <Navbar />}
          {children}
        </UserProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main
      style={{
        paddingTop: 64,
        padding: 16,
        maxWidth: 1024,
        margin: "0 auto",
      }}
    >
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ width: "100%", padding: 16, overflowX: "auto" }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
