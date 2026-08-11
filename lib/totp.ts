import { Secret, TOTP } from "otpauth";

function getTotp() {
  const secret = process.env.TOTP_SECRET;
  if (!secret) {
    throw new Error("TOTP_SECRET is not set");
  }
  return new TOTP({
    issuer: "cqminh-portfolio",
    label: "admin",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
}

export function verifyTotpCode(code: string): boolean {
  const cleaned = code.trim();
  if (!/^\d{6}$/.test(cleaned)) return false;
  const delta = getTotp().validate({ token: cleaned, window: 1 });
  return delta !== null;
}
