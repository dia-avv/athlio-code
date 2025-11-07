import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import Stepper from "../../components/wizard/Stepper";
import StepContainer from "../../components/wizard/StepContainer";
import TextInput from "../../components/inputs/TextInput";
import UnitInput from "../../components/inputs/UnitInput";
import RoleSelect from "../../components/domain/onboarding/RoleSelect";
import SportsSelect from "../../components/domain/onboarding/SportSelect";
import PositionSelect from "../../components/domain/onboarding/PositionSelect";
import ClubPicker from "../../components/domain/onboarding/ClubPicker";
import LocationFields from "../../components/domain/onboarding/LocationFields";
import GoalsField from "../../components/domain/onboarding/GoalsField";
import { getSteps } from "../../utils/steps";
import { buildProfilePayload } from "../../utils/payload";
import Textarea from "../../components/inputs/TextArea";

export default function Setup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("athlete");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    avatar_url: "",
    age: "",
    sports: [],
    primarySport: "",
    gender: "",
    height: "",
    weight: "",
    position: "",
    club_id: null,
    club_other_name: "",
    country: "",
    region: "",
    city: "",
    goals: "",
    talent_preferences: "",
    org_name: "",
    org_founded_year: "",
    org_team_size: "",
    org_description: "",
  });

  const steps = useMemo(() => getSteps(role), [role]);
  const [idx, setIdx] = useState(0);
  const stepId = steps[idx];

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate("/auth", { replace: true });
      const { data: profile, error: readErr } = await supabase
        .from("profiles")
        .select("*")
        .match({ id: user.id })
        .maybeSingle();
      if (!profile) {
        const { error: insertErr } = await supabase
          .from("profiles")
          .insert({ id: user.id });
      }

      if (profile) {
        const sports = Array.isArray(profile.sports) ? profile.sports : [];
        setRole(profile.role || "athlete");
        setForm((f) => ({
          ...f,
          full_name: profile.full_name || "",
          username: profile.username || "",
          avatar_url: profile.avatar_url || "",
          age: profile.age ?? "",
          sports,
          primarySport: profile.primary_sport || sports[0] || "",
          gender: profile.gender || "",
          height: profile.height_cm ?? "",
          weight: profile.weight_kg ?? "",
          position: profile.position || "",
          club_id: profile.club_id || null,
          club_other_name: profile.club_other_name || "",
          country: profile.country || "",
          region: profile.region || "",
          city: profile.city || "",
          goals: profile.goals || "",
          talent_preferences: profile.talent_preferences
            ? JSON.stringify(profile.talent_preferences)
            : "",
          org_name: profile.org_name || "",
          org_founded_year: profile.org_founded_year ?? "",
          org_team_size: profile.org_team_size ?? "",
          org_description: profile.org_description || "",
        }));
      }
    })();
  }, [navigate]);

  function set(v) {
    setForm((f) => ({ ...f, ...v }));
  }
  function next() {
    setIdx((i) => Math.min(i + 1, steps.length - 1));
  }
  function back() {
    setIdx((i) => Math.max(i - 1, 0));
  }

  async function finish() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const payload = buildProfilePayload({ role, form, heightUnit, weightUnit });
    console.log("Submitting profile payload:", payload);
    const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...payload }, { onConflict: "id" });

    // log any errors
    if (upsertErr) {
      console.error("PROFILE UPSERT ERROR", upsertErr);
    }

    navigate("/home");
  }

  return (
    <div>
      <Stepper steps={steps} current={idx} />
      <StepContainer
        onBack={back}
        onNext={next}
        onFinish={finish}
        showBack={idx > 0}
        showNext={idx < steps.length - 1}
        showFinish={idx === steps.length - 1}
      >
        {stepId === "basic" && (
          <div>
            <TextInput
              label="Full name"
              value={form.full_name}
              onChange={(v) => set({ full_name: v })}
            />
            <TextInput
              label="Username"
              value={form.username}
              onChange={(v) => set({ username: v })}
            />
            <TextInput
              label="Avatar URL"
              value={form.avatar_url}
              onChange={(v) => set({ avatar_url: v })}
            />
            <TextInput
              label="Age"
              value={form.age}
              onChange={(v) => set({ age: v })}
            />
          </div>
        )}

        {stepId === "role" && <RoleSelect role={role} onChange={setRole} />}

        {stepId === "sport" && (
          <div>
            <SportsSelect
              sports={form.sports}
              onChange={(arr) =>
                set({ sports: arr, primarySport: arr[0] || "", position: "" })
              }
              primarySport={form.primarySport}
              onPrimaryChange={(v) => set({ primarySport: v, position: "" })}
            />
            {role === "athlete" && form.primarySport ? (
              <PositionSelect
                sport={form.primarySport}
                value={form.position}
                onChange={(v) => set({ position: v })}
              />
            ) : null}
          </div>
        )}

        {stepId === "measure" && role === "athlete" && (
          <div>
            <UnitInput
              label="Height"
              value={form.height}
              onChange={(v) => set({ height: v })}
              unit={heightUnit}
              setUnit={setHeightUnit}
              unitOptions={["cm", "ft"]}
              placeholderCm="Height (cm)"
              placeholderAlt="Height (e.g. 5'11)"
            />
            <UnitInput
              label="Weight"
              value={form.weight}
              onChange={(v) => set({ weight: v })}
              unit={weightUnit}
              setUnit={setWeightUnit}
              unitOptions={["kg", "lb"]}
              placeholderCm="Weight (kg)"
              placeholderAlt="Weight (lb)"
            />
            <TextInput
              label="Gender"
              value={form.gender}
              onChange={(v) => set({ gender: v })}
            />
          </div>
        )}

        {stepId === "club" && role === "athlete" && (
          <ClubPicker
            sport={form.primarySport || "football"}
            value={{
              club_id: form.club_id,
              club_other_name: form.club_other_name,
            }}
            onChange={(v) => set(v)}
          />
        )}

        {stepId === "location" && (
          <LocationFields
            country={form.country}
            region={form.region}
            city={form.city}
            onChange={(v) => set(v)}
          />
        )}

        {stepId === "goals" && role === "athlete" && (
          <GoalsField value={form.goals} onChange={(v) => set({ goals: v })} />
        )}

        {stepId === "scout" && role === "scout" && (
          <Textarea
            label="Talent preferences"
            value={form.talent_preferences}
            onChange={(v) => set({ talent_preferences: v })}
          />
        )}

        {stepId === "org" && role === "organization" && (
          <div>
            <TextInput
              label="Organization name"
              value={form.org_name}
              onChange={(v) => set({ org_name: v })}
            />
            <TextInput
              label="Founded year"
              value={form.org_founded_year}
              onChange={(v) => set({ org_founded_year: v })}
            />
            <TextInput
              label="Team size"
              value={form.org_team_size}
              onChange={(v) => set({ org_team_size: v })}
            />
            <Textarea
              label="Organization description"
              value={form.org_description}
              onChange={(v) => set({ org_description: v })}
            />
          </div>
        )}

        {stepId === "review" && (
          <pre>{JSON.stringify({ role, ...form }, null, 2)}</pre>
        )}
      </StepContainer>
    </div>
  );
}
