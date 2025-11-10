import { feetToCm, lbToKg } from "./units";

// somewhere near buildProfilePayload
const POSITION_LABELS = {
  // football
  lw: "Left Winger",
  st: "Striker",
  rw: "Right Winger",
  cm_l: "Central Midfielder (Left)",
  cdm: "Defensive Midfielder",
  cm_r: "Central Midfielder (Right)",
  lb: "Left Back",
  cb_l: "Center Back (Left)",
  cb_r: "Center Back (Right)",
  rb: "Right Back",
  gk: "Goalkeeper",
  // basketball
  pg: "Point Guard",
  sg: "Shooting Guard",
  sf: "Small Forward",
  pf: "Power Forward",
  c: "Center",
};

function idsToFullNames(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return null;
  return ids.map((id) => POSITION_LABELS[id] || id);
}

//This is the object that gets sent to Supabase
export function buildProfilePayload({ role, form, heightUnit, weightUnit }) {
  let height_cm = null;
  let weight_kg = null;

  if (form.height) {
    height_cm =
      heightUnit === "ft" ? feetToCm(form.height) : Number(form.height);
    if (!Number.isFinite(height_cm)) height_cm = null;
    else height_cm = Math.round(height_cm);
  }
  if (form.weight) {
    weight_kg = weightUnit === "lb" ? lbToKg(form.weight) : Number(form.weight);
    if (!Number.isFinite(weight_kg)) weight_kg = null;
    else weight_kg = Math.round(weight_kg);
  }

  //This assures that everything is the right data type and converts empty fields to NULL
  const payload = {
    role,
    full_name: form.full_name || null,
    username: form.username || null,
    avatar_url: form.avatar_url || null,
    primary_sport: form.primarySport || null,
    gender: role === "athlete" ? form.gender || null : null,
    age: role === "athlete" ? (form.age ? Number(form.age) : null) : null,
    height_cm: role === "athlete" ? height_cm : null,
    weight_kg: role === "athlete" ? weight_kg : null,
    position:
      role === "athlete"
        ? form.primarySport
          ? idsToFullNames(form.position) // now stores ["Goalkeeper"] etc.
          : null
        : null,
    club_id: role === "athlete" ? form.club_id || null : null,
    club_other_name:
      role === "athlete"
        ? form.club_id
          ? null
          : form.club_other_name || null
        : null,
    country: form.country || null,
    region: form.region || null,
    city: form.city || null,
    goals: role === "athlete" ? form.goals || null : null,
    talent_preferences:
      role === "scout"
        ? form.talent_preferences
          ? tryParseJSON(form.talent_preferences)
          : {}
        : {},
    org_name: role === "organization" ? form.org_name || null : null,
    org_founded_year:
      role === "organization"
        ? form.org_founded_year
          ? Number(form.org_founded_year)
          : null
        : null,
    org_team_size:
      role === "organization"
        ? form.org_team_size
          ? Number(form.org_team_size)
          : null
        : null,
    org_description:
      role === "organization" ? form.org_description || null : null,
    bio: form.bio || null,
    onboarded: true,
  };

  // NOTE: the `sports` column was removed from the DB schema; we only
  // persist `primary_sport` now. Do NOT include `sports` in the payload.

  // Defensive cleanup: remove keys with null/undefined values so we don't send
  // columns that don't exist in the target table (PostgREST will error).
  const cleaned = {};
  for (const k of Object.keys(payload)) {
    const v = payload[k];
    if (v !== null && v !== undefined) cleaned[k] = v;
  }

  return cleaned;
}

function tryParseJSON(s) {
  try {
    return JSON.parse(s);
  } catch {
    return { notes: s };
  }
}
