"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Upload, Settings, LogOut, ShieldCheck } from "lucide-react";
import { authService } from "@/lib/authService";
import { jwtDecode } from "jwt-decode";

export function UserDropdown() {
  const [role, setRole] = useState<string>("USER"); // Mặc định là USER
  const [fullName, setFullName] = useState<string>("User");
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode<{ role: string }>(token);
        setRole(decodedToken.role); // Chỉ set role từ token

        authService.getUserDetails().then((response) => {
          if (response) {
            setFullName(response.fullname);
            setAvatarUrl(response.image);
          }
        });
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 hover:opacity-80">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={`http://localhost:8080${avatarUrl}`}
            alt="User Avatar"
          />
          <AvatarFallback>{fullName[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium">{fullName}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/saved">
            <Bookmark className="mr-2 h-4 w-4" />
            Đã lưu
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <Upload className="mr-2 h-4 w-4" />
            Tài liệu của tôi
          </Link>
        </DropdownMenuItem>

        {/* Chỉ hiển thị nếu role là ADMIN */}
        {role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Quản trị viên
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Cài đặt tài khoản
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
