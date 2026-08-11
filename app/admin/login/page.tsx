export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-semibold">Đăng nhập admin</h1>
      {error && (
        <p className="text-sm text-red-500">
          Đăng nhập thất bại ({error}). Vui lòng thử lại.
        </p>
      )}
      <a
        href="/api/auth/github"
        className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        Đăng nhập bằng GitHub
      </a>
    </main>
  );
}
