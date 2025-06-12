import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderTree,
  Tag,
  Settings,
} from "lucide-react";

// Các mục điều hướng
const adminNavItems = [
  {
    label: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Quản lý bài viết",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    label: "Quản lý tài khoản",
    href: "/admin/accounts",
    icon: Users,
  },
  {
    label: "Danh mục",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Quản lý thẻ",
    href: "/admin/tags",
    icon: Tag,
  },
  {
    label: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto">
        <div className="flex justify-center">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-8 py-4 text-sm font-medium transition-colors hover:text-blue-600",
                pathname.startsWith(item.href)
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
