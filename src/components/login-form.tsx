"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Dùng để điều hướng, không phải lấy query params trong App Router
import { useSearchParams } from "next/navigation"; // Import useSearchParams để lấy query params
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { authService } from "@/lib/authService"; // Đảm bảo authService đã được tạo
import { jwtDecode } from "jwt-decode";

// Khai báo interface cho decodedToken
interface DecodedToken {
  role: string;
  username: string;
  exp?: number; // Thời gian hết hạn của token
  [key: string]: unknown;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Thêm state để điều khiển thông báo thành công
  const router = useRouter();
  const searchParams = useSearchParams(); // Sử dụng useSearchParams để lấy query params

  // Kiểm tra query parameter success=true khi trang load
  useEffect(() => {
    const success = searchParams.get("success"); // Truy xuất query parameter 'success'
    if (success === "true") {
      setShowSuccessMessage(true); // Hiển thị thông báo thành công
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;

        // Kiểm tra xem token đã hết hạn chưa
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          localStorage.clear(); // Xóa token nếu hết hạn
        } else {
          router.push("/"); // Chuyển hướng đến trang chính nếu token hợp lệ
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear(); // Xóa token nếu không hợp lệ
      }
    }
  }, [searchParams, router]);

  // Xử lý đăng nhập
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Gọi API đăng nhập
      const response = await authService.login({ email, password });
      const token = response && typeof response === "string" ? response : null;

      if (!token) {
        throw new Error("Token is missing in the response");
      }

      // Giải mã token
      const decodedToken = jwtDecode<DecodedToken>(token);

      // Lưu thông tin vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", decodedToken.username || "User");
      localStorage.setItem("role", decodedToken.role || "User");

      // Chuyển hướng dựa trên vai trò
      if (decodedToken.role === "ADMIN") {
        router.push("/"); // Trang dành cho ADMIN
      } else {
        router.push("/"); // Trang chính cho người dùng
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back!
        </CardTitle>
        <div className="w-full h-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Hiển thị thông báo thành công nếu success=true */}
        {showSuccessMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
            Bạn đã đăng ký thành công! Vui lòng đăng nhập để tiếp tục.
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Đăng nhập để trải nghiệm website
            </span>
          </div>
        </div>
        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="grid gap-2 mt-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
            />
          </div>
          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
          <Button
            className="w-full mt-6 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white transition-all duration-300 transform hover:scale-105"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loading size={20} /> : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <p className="mt-2 text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
