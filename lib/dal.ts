import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function verifySession() {
  const session = await getSession();
  if (!session || session.stage !== "authenticated") {
    redirect("/admin/login");
  }
  return { githubId: session.githubId };
}
