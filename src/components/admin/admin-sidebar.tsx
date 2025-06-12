"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  FileText,
  Users,
  Menu,
  FolderTree,
  Tag,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Tổng quan", href: "/admin" },
  { icon: FileText, label: "Quản lý bài viết", href: "/admin/posts" },
  { icon: Users, label: "Quản lý tài khoản", href: "/admin/accounts" },
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
];

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gray-800 text-white">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <aside className="hidden md:flex md:flex-col md:w-64 md:border-r bg-gray-800 text-white">
        <SidebarContent />
      </aside>
    </>
  );
}

function SidebarContent() {
  const pathname = usePathname();

  return (
    <ScrollArea className="flex-1 p-4">
      <h2 className="text-xl font-semibold mb-6">Quản trị</h2>
      <nav className="space-y-3">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-700",
              pathname === item.href
                ? "bg-gray-700 text-white"
                : "text-gray-300"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </ScrollArea>
  );
}
