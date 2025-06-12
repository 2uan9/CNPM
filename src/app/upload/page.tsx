// UploadPage.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Dùng useRouter để chuyển hướng
import { Header } from "@/components/header";
import { UploadSection } from "@/components/upload-section";
import { Footer } from "@/components/footer";

export default function UploadPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Nếu không có token thì chuyển hướng đến trang login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <UploadSection />
      </main>
      <Footer />
    </div>
  );
}
