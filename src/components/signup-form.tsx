"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { authService } from "@/lib/authService";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra mật khẩu nhập vào có khớp không
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Bắt đầu quá trình đăng ký
    setIsLoading(true);
    setError(null);

    try {
      const userData = { email, password, confirmPassword };
      const response = await authService.register(userData); // Gọi API đăng ký
      console.log("Registration successful:", response);

      // Xóa tất cả các thông báo cũ

      // Chuyển sang trang đăng nhập sau khi đăng ký thành công
      router.push("/login");
    } catch (err: unknown) {
      // Xử lý lỗi
      if (err instanceof Error) {
        console.error("Registration error:", err.message);
        setError(err.message);
      } else {
        console.error("An unexpected error occurred:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Kết thúc quá trình loading
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign up for Document Share
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Đăng ký với gmail
              </span>
            </div>
          </div>
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
              />
            </div>
            <div className="grid gap-2 mt-4">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : "Sign Up"}{" "}
              {/* Hiệu ứng loading */}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Đã có tài khoản ?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Toast container để hiển thị thông báo */}
    </>
  );
}
