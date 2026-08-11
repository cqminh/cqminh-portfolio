export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      {error && (
        <p className="text-sm text-red-500">
          Login failed ({error}). Please try again.
        </p>
      )}
      <a
        href="/api/auth/github"
        className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        Sign in with GitHub
      </a>
    </main>
  );
}
