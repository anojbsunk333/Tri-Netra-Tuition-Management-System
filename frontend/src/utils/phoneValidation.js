const NEPAL_MOBILE_REGEX = /^(97|98)\d{8}$/;

export const INVALID_NEPAL_MOBILE_MESSAGE =
  "Please enter a valid 10-digit Nepali mobile number.";

export function isValidNepalMobile(phone) {
  return typeof phone === "string" && NEPAL_MOBILE_REGEX.test(phone.trim());
}
