export function getSteps(role) {
  // Make 'role' the first step in the onboarding flow so users
  // pick their role before filling other profile details.
  const base = ["role", "sport"];
  // For athletes show a dedicated position step and a bio + premium screen
  if (role === "athlete")
    return [...base, "position", "basic", "club", "bio", "goals", "premium", "review"];
  if (role === "scout")
    return [...base, "basic", "location", "scout", "bio", "premium", "review"];
  return [...base, "basic", "sport", "org", "location", "bio", "premium", "review"];
}
