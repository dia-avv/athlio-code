import { Outlet, useLocation } from "react-router";
import Topbar from "../components/Topbar";
import Navbar from "../components/NavBar";

export default function Layout() {
const { pathname } = useLocation();
  const hideNavbar = pathname.startsWith("/auth") || pathname.startsWith("/intro") || pathname.startsWith("/setup-profile");
  return (
    <div className="app-layout">
      <Topbar />
      <main className="main-content">
        <Outlet />
      </main>
      {!hideNavbar && <Navbar />}
    </div>
  );
}
