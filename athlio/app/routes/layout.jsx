import { Outlet } from "react-router";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="app-layout">
      <Topbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
}
