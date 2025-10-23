import { useProfile } from "../../hooks/useProfile.js";

export default function Profile() {
  const { profile, loading } = useProfile();
  if (loading) return <p>Loading...</p>;
  return <h1>Welcome back, {profile.username}</h1>;
}
