export function getSteps(role) {
  const base = ["basic", "role"];
  if (role === "athlete")
    return [...base, "sport", "measure", "club", "location", "goals", "review"];
  if (role === "scout")
    return [...base, "sport", "location", "scout", "review"];
  return [...base, "sport", "org", "location", "review"];
}
