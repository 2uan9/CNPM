"use client";
import { useParams } from "next/navigation"; // Import useParams để lấy query từ URL
import { SearchResults } from "@/components/search-results";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function SearchPage() {
  const { query } = useParams(); // Lấy tham số query từ URL

  // Kiểm tra và ép kiểu query là string
  const queryString = typeof query === "string" ? query : ""; // Nếu không phải string, gán mặc định là ""

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <SearchResults query={queryString} />{" "}
        {/* Truyền query vào SearchResults */}
      </main>
      <Footer />
    </div>
  );
}
