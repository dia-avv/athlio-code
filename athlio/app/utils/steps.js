export function getSteps(role) {
  // 'role' first so the rest tailors to selection.
  const base = ["role", "sport"];

  if (role === "athlete") {
    // Add 'location' immediately after basic profile (same placement as scout flow request)
    return [
      ...base,
      "position",
      "basic",
      "location", // newly inserted
      "club",
      "bio",
      "goals",
      "follow",
      "premium",
      "review",
    ];
  }

  if (role === "scout") {
    return [...base, "basic", "location", "scout", "bio", "premium", "review"];
  }

  // organization default flow
  return [...base, "basic", "sport", "org", "location", "bio", "premium", "review"];
}
