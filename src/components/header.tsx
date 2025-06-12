"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { UserDropdown } from "@/components/user-dropdown";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import ApiService from "@/lib/postService"; 

interface HeaderProps {
  hideNavigation?: boolean;
}

export function Header({ hideNavigation = false }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false); 
  const [progress, setProgress] = useState(0); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (token && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setLoading(false); // Khi thanh tiến trình đầy, dừng loading
    }
  }, [progress]);

  // Cập nhật tiến trình tải (loading)
  const simulateProgress = () => {
    let value = 0;
    const interval = setInterval(() => {
      if (value >= 100) {
        clearInterval(interval); // Dừng tiến trình khi đạt 100%
      } else {
        value += 5; // Tăng tiến trình dần dần
        setProgress(value);
      }
    }, 50); // Cập nhật mỗi 50ms
  };

  const handleLogoClick = () => {
    setLoading(true); // Bắt đầu loading khi click vào logo
    simulateProgress(); // Bắt đầu tiến trình
    router.push("/"); // Chuyển hướng về trang chính
  };

  const handleUploadClick = () => {
    setLoading(true); // Bắt đầu loading khi nhấn "Tải lên"
    simulateProgress(); // Bắt đầu tiến trình
    router.push("/upload"); // Chuyển hướng đến trang "Tải lên"
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    window.location.reload();
  };

  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() !== "") {
      setLoading(true); 
      simulateProgress(); 
      try {
        const response = await ApiService.searchPostsByName(query, 0, 9);
        const results = response.data.content || [];

        if (results.length > 0) {
          router.push(`/search/${query}`); // Chuyển đến trang tìm kiếm
        } else {
          alert("Không tìm thấy kết quả phù hợp!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy kết quả tìm kiếm:", error);
        alert("Đã xảy ra lỗi khi tìm kiếm.");
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-sky-500 via-indigo-400 to-pink-500 shadow-lg sticky top-0 left-0 w-full z-50">
      {/* Thanh tiến trình tải */}
      {loading && (
        <div className="w-full h-1 bg-blue-500 fixed top-0 left-0 z-50">
          <div
            className="h-full bg-green-400"
            style={{
              width: `${progress}%`,
              transition: "width 0.05s ease-out",
            }}
          ></div>
        </div>
      )}

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <div
          className="flex items-center cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="flex items-center">
            <Image
              src="/pngegg.png" // Make sure the logo image exists in public folder
              alt="Document Share Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-white">
                <span className="text-white-600">Document</span>
                <span className="text-white">Share</span>
              </span>
              <span className="text-xs text-white">
                Nền tảng chia sẻ tài liệu
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {!hideNavigation && (
          <div className="flex-1 max-w-xl px-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/70" />
              <Input
                placeholder="Tìm kiếm bài thuyết trình"
                className="pl-8 pr-4 py-2 w-full bg-white/10 text-white placeholder:text-white/70 border-white/20 focus:border-white/40 transition-all text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch} // Khi nhấn Enter, gọi hàm tìm kiếm
              />
            </div>
          </div>
        )}

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <Button
              variant="ghost"
              asChild
              className="text-white hover:bg-white/20 transition-colors min-w-[80px] text-sm"
              onClick={handleUploadClick} // Thêm sự kiện click cho "Tải lên"
            >
              <span>Tải lên</span>
            </Button>
          )}

          {isLoggedIn ? (
            <UserDropdown username={username} onLogout={handleLogout} />
          ) : (
            <Button
              variant="secondary"
              asChild
              className="bg-white text-blue-600 hover:bg-white/90 transition-colors min-w-[100px] text-sm"
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
