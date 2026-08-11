import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { verifyTotpAction } from "./actions";

export default async function VerifyTotpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session || session.stage !== "pending") {
    redirect("/admin/login");
  }

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-semibold">Enter verification code</h1>
      <p className="max-w-sm text-sm text-neutral-500">
        Open your authenticator app (Google Authenticator/Authy) and enter the current 6-digit code.
      </p>
      {error && <p className="text-sm text-red-500">Incorrect code, please try again.</p>}
      <form action={verifyTotpAction} className="flex flex-col items-center gap-4">
        <input
          name="code"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoFocus
          required
          autoComplete="one-time-code"
          className="w-40 rounded-lg border border-neutral-300 px-4 py-2 text-center text-xl tracking-widest dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Verify
        </button>
      </form>
    </main>
  );
}
