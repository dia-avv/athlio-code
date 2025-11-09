import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../../lib/supabase";
import Button from "../../../components/UI/Button";
import TextInput from "../../../components/inputs/TextInput";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, username")
        .eq("id", user.id)
        .single();

      if (error) setError(error.message);
      else setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  async function handleSave() {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        username: profile.username,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) setError(error.message);
    else navigate("/profile/me");
  }

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <main style={{ padding: "20px" }}>
      <h2>Edit Profile (Test)</h2>

      <TextInput
        label="Full name"
        value={profile.full_name || ""}
        onChange={(v) => setProfile({ ...profile, full_name: v })}
      />

      <TextInput
        label="Username"
        value={profile.username || ""}
        onChange={(v) => setProfile({ ...profile, username: v })}
      />

      <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
        <Button
          type="outline"
          size="medium"
          label="Cancel"
          onClick={() => navigate("/profile/me")}
        />
        <Button
          type="primary"
          size="medium"
          label={saving ? "Saving..." : "Save"}
          onClick={handleSave}
          disabled={saving}
        />
      </div>
    </main>
  );
}
