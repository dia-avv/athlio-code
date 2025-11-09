import { Outlet, useLocation } from "react-router";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";

export default function Layout() {
  const location = useLocation();
  const isAddPost =
    location.pathname === "/add-post" ||
    location.pathname.startsWith("/add-post/");

const { pathname } = useLocation();
  const hideNavbar = pathname.startsWith("/auth") || pathname.startsWith("/intro") || pathname.startsWith("/setup-profile");
  return (
    <div className="app-layout">
      <Topbar />
      <main className="main-content">
        <Outlet />
      </main>
      {!isAddPost && {!hideNavbar && <Navbar />}}
    </div>
  );
}
