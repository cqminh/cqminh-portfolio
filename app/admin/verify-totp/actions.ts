"use server";

import { redirect } from "next/navigation";
import { createAuthenticatedSession, getSession } from "@/lib/session";
import { verifyTotpCode } from "@/lib/totp";

export async function verifyTotpAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.stage !== "pending") {
    redirect("/admin/login");
  }

  const code = String(formData.get("code") ?? "");

  if (!verifyTotpCode(code)) {
    redirect("/admin/verify-totp?error=invalid_code");
  }

  await createAuthenticatedSession(session.githubId);
  redirect("/admin");
}
