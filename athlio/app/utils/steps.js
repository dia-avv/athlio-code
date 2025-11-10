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
    ];
  }

  if (role === "scout") {
    // Order: choose role/sport -> basic info -> location -> club -> bio -> goals -> follow -> premium -> review
    return [...base, "basic", "location", "club", "bio", "scout", "follow", "premium"];
  }

  // organization default flow
  return [...base, "basic", "sport", "org", "location", "bio", "premium"];
}
