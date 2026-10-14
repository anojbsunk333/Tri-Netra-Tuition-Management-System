const EMAIL_PATTERN =
  /^(?=.{1,254}$)(?=.{1,64}@)(?:[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export function validateEmailFormat(email) {
  const normalized = String(email || "")
    .trim()
    .toLowerCase();
  const localPart = normalized.split("@")[0] || "";

  if (!EMAIL_PATTERN.test(normalized)) {
    return "Please enter a valid email address.";
  }

  if (!/[a-z]/i.test(localPart)) {
    return "Email address must contain at least one letter.";
  }

  return "";
}
