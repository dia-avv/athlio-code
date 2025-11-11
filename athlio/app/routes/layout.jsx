import { Outlet, useLocation } from "react-router";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";

const NAVBARLESS_PREFIXES = ["/", "/auth", "/intro", "/setup-profile"];
const TOPBARLESS_PREFIXES = ["/auth", "/intro", "/setup-profile"];

const BASENAME =
  (typeof import.meta !== "undefined" ? import.meta.env?.BASE_URL : "") || "";

function normalizePathname(pathname) {
  if (!BASENAME || BASENAME === "/" || !pathname.startsWith(BASENAME)) {
    return pathname;
  }
  const trimmed = pathname.slice(BASENAME.length);
  return trimmed.length ? trimmed : "/";
}

function matchesPrefix(pathname, prefixes) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function Layout() {
  const { pathname: rawPathname } = useLocation();
  const pathname = normalizePathname(rawPathname);

  const isAddPost =
    pathname === "/add-post" || pathname.startsWith("/add-post/");

  const hideNavbar = matchesPrefix(pathname, NAVBARLESS_PREFIXES);
  const hideTopbar = matchesPrefix(pathname, TOPBARLESS_PREFIXES);

  return (
    <div className="app-layout">
      {!hideTopbar && <Topbar />}
      <main className="main-content">
        <Outlet />
      </main>
      {!isAddPost && !hideNavbar && <Navbar />}
    </div>
  );
}
