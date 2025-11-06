import { Outlet } from "react-router-dom";

export default function AddPostLayout() {
  return (
    <section>
      <main>
        <Outlet />
      </main>
    </section>
  );
}
