"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllCategories } from "@/lib/categoriesService";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  categoryName: string;
}

export function Navigation() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [progress, setProgress] = useState(0); // Thêm trạng thái tiến trình
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const categoryId = parseInt(currentPath.split("/").pop() || "0");
    setActiveCategory(
      categories.find((category) => category.id === categoryId) || null
    );
  }, [router, categories]);

  useEffect(() => {
    if (loading && progress < 100) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
          }
          return newProgress;
        });
      }, 100);
    }
  }, [loading, progress]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth / 2;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCategorySelect = (category: Category | null) => {
    setLoading(true); // Bắt đầu loading khi chọn danh mục
    setActiveCategory(category);
    if (category) {
      router.push(`/category/${category.id}`); // Chuyển đến trang danh mục
    } else {
      router.push("/"); // Chuyển đến trang chủ
    }
  };

  return (
    <nav className="bg-white border-b shadow-sm relative">
      {/* Thanh tiến trình */}
      {loading && (
        <div className="w-full h-1 bg-green-400 fixed top-0 left-0 z-50">
          <div
            className="h-full bg-green-400"
            style={{ width: `${progress}%`, transition: "width 0.1s ease-out" }}
          ></div>
        </div>
      )}

      <div className="container mx-auto relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto py-3 px-4 w-full justify-between items-center gap-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            maxWidth: "100%",
          }}
        >
          <button
            className={cn(
              "px-4 py-2 text-base font-medium rounded-md whitespace-nowrap mx-1",
              !activeCategory
                ? "bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700"
            )}
            onClick={() => handleCategorySelect(null)}
          >
            Dành cho bạn
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className={cn(
                "px-4 py-2 text-base font-medium rounded-md whitespace-nowrap mx-1",
                activeCategory?.id === category.id
                  ? "bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700"
              )}
            >
              {category.categoryName}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white to-transparent p-2 z-50"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white to-transparent p-2 z-50"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </nav>
  );
}
