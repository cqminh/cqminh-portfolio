import { verifySession } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { logoutAction } from "../actions";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifySession();

  return (
    <div className="flex h-screen flex-col overflow-hidden sm:flex-row">
      <AdminSidebar logoutAction={logoutAction} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
