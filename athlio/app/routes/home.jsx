import { useAuthGuard } from "../hooks/useAuthGuard.js";
import { useSession } from "../hooks/useSession.js";

export default function Home() {
  useAuthGuard();
  const session = useSession();

  if (!session) return <p>Loading...</p>;

  return <div>Welcome {session.user.email}</div>;
}
