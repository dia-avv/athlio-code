import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";

export default function Layout() {
  const location = useLocation();
  const isAddPost =
    location.pathname === "/add-post" ||
    location.pathname.startsWith("/add-post/");

  return (
    <div className="app-layout">
      <Topbar />
      <main className="main-content">
        <Outlet />
      </main>
      {!isAddPost && <Navbar />}
    </div>
  );
}
