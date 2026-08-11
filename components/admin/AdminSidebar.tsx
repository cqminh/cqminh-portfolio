"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/stats", label: "Stats", icon: LayoutDashboard },
  { href: "/admin/content", label: "Site content", icon: FileText },
];

interface AdminSidebarProps {
  logoutAction: () => void;
}

export function AdminSidebar({ logoutAction }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-b border-[var(--card-border)] bg-[var(--card-bg)] sm:w-56 sm:border-b-0 sm:border-r">
      <div>
        <div className="px-5 py-5 text-sm font-semibold text-[var(--text-primary)]">Admin</div>
        <nav className="flex gap-1 px-3 sm:flex-col">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-[var(--accent-light)] text-[var(--accent-text)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--card-bg-hover)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <form action={logoutAction} className="p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-bg-hover)]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </form>
    </aside>
  );
}
