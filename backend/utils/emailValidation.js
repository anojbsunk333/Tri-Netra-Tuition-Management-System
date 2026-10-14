import { getCollection } from "./db.js";

const EMAIL_PATTERN =
  /^(?=.{1,254}$)(?=.{1,64}@)(?:[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

export function validateEmailFormat(email) {
  const normalized = normalizeEmail(email);
  const localPart = normalized.split("@")[0] || "";

  if (!EMAIL_PATTERN.test(normalized)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  if (!/[a-z]/i.test(localPart)) {
    return {
      ok: false,
      message: "Email address must contain at least one letter.",
    };
  }

  return { ok: true, normalized };
}

export async function checkEmailUniqueness(email, excludeUserId = null) {
  const normalized = normalizeEmail(email);
  const users = await getCollection("users");
  const duplicate = users.some(
    (user) =>
      String(user.id) !== String(excludeUserId) &&
      normalizeEmail(user.email) === normalized,
  );

  return duplicate
    ? {
        ok: false,
        status: 409,
        message: "This email address is already registered.",
      }
    : { ok: true, normalized };
}

export async function validateUniqueEmail(email, excludeUserId = null) {
  const format = validateEmailFormat(email);
  if (!format.ok) return { ...format, status: 400 };

  const uniqueness = await checkEmailUniqueness(
    format.normalized,
    excludeUserId,
  );
  return uniqueness.ok ? format : uniqueness;
}
