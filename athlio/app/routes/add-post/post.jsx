import { Outlet, useNavigate } from "react-router-dom";

export default function AddPostLayout() {
  const navigate = useNavigate();

  return (
    <section>
      <main>
        <Outlet />
      </main>
    </section>
  );
}
