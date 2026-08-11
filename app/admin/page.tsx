import { verifySession } from "@/lib/dal";
import { logoutAction } from "./actions";

export default async function AdminPage() {
  await verifySession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-sm text-neutral-500">Đăng nhập thành công. Nội dung quản trị sẽ thêm ở bước tiếp theo.</p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium dark:border-neutral-700"
        >
          Đăng xuất
        </button>
      </form>
    </main>
  );
}
