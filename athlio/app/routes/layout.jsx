import { Outlet, useLocation } from "react-router";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";

export default function Layout() {
  const { pathname } = useLocation();

  const isAddPost =
    pathname === "/add-post" || pathname.startsWith("/add-post/");

  const hideNavbar =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/intro") ||
    pathname.startsWith("/setup-profile");

  return (
    <div className="app-layout">
      <Topbar />
      <main className="main-content">
        <Outlet />
      </main>
      {!isAddPost && !hideNavbar && <Navbar />}
    </div>
  );
}
