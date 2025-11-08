export function validateStep({ stepId, role, form }) {
  if (stepId === "basic" && !full_name) return "Full name is required.";
  if (stepId === "role" && !role) return "Role is required.";
  if (stepId === "sport") {
    if (!form.sport || form.sport.length === 0)
      return "Choose at least on sport.";
    if (role === "athlete" && !form.primarySport)
      return "Choose a primary sport.";
    if (role === "athlete" && form.primarySport && (!Array.isArray(form.position) || form.position.length === 0))
      return "Choose a position.";
  }
  if (stepId === "measure") {
    return null;
  }
  if (stepId === "club") {
    return null;
  }
  if (stepId === "location") {
    return null;
  }
  if (stepId === "scout") {
    return null;
  }
  if (stepId === "org" && role === "organization" && !form.org_name)
    return "Organization name is required";
  return null;
}
