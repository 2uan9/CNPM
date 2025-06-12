"use client";

import { useState, useEffect } from "react";
import {
  getApprovedPostsByCategory,
  getCategoryById,
} from "@/lib/categoriesService";
import Link from "next/link";
import { BiBookmark } from "react-icons/bi";
import FavoritesDocService from "@/lib/favoritesDocService";
import { FiDownload } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Interfaces
interface Post {
  id: number;
  documentName: string;
  documentDescription: string;
  documentImage: string | null;
  originalDocument: {
    documentURL: string;
    downloadCount: number;
  };
  upLoader: {
    infoId: {
      fullName: string;
    };
  };
  postTags: {
    tag: {
      tagName: string;
    };
  }[];
  viewCount: number;
}

interface Category {
  id: number;
  categoryName: string;
  description: string;
}

interface PresentationGridProps {
  categoryId: string;
}

const handleAddFavorite = async (postId: number) => {
  try {
    await FavoritesDocService.addFavoriteDocument(postId);
    toast.success("Tài liệu đã được thêm vào yêu thích!");
  } catch (error) {
    console.error("Lỗi khi thêm tài liệu yêu thích:", error);
    toast.error("Lỗi khi thêm tài liệu yêu thích.");
  }
};

export function PresentationGrid({ categoryId }: PresentationGridProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(Number(categoryId));
        setCategory(response);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin danh mục:", err);
        setError("Không thể lấy thông tin danh mục");
      }
    };

    fetchCategory();

    const fetchPosts = async () => {
      try {
        const response = await getApprovedPostsByCategory(
          Number(categoryId),
          currentPage,
          8,
          filter // Thêm filter vào API call
        );
        if (response.categoryId === Number(categoryId)) {
          setPosts(response.posts.content);
          setTotalPages(response.posts.totalPages);
        } else {
          setError("Không có bài viết cho danh mục này.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra, vui lòng thử lại sau!");
        console.error("Lỗi khi lấy bài viết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoryId, currentPage, filter]); // Thêm `filter` vào dependencies

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      setLoading(true);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  if (error) return <p className="text-center py-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">
          Danh Mục&nbsp;
          {category?.categoryName || "Danh mục không xác định"}
        </h1>

        {/* Filter */}
        <div className="flex items-center gap-4">
          <Select
            defaultValue="all"
            onValueChange={(value) => setFilter(value)} // Khi thay đổi lọc, cập nhật state filter
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="mostViewed">Xem nhiều nhất</SelectItem>
              <SelectItem value="mostDownloaded">Tải về nhiều nhất</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="link"
            className="text-blue-600"
            onClick={() => setFilter("all")}
          >
            Clear all
          </Button>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group flex flex-col border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow h-[350px] w-full relative"
          >
            <Link href={`/slideshow/${post.id}`}>
              <div className="relative h-[200px] w-full overflow-hidden">
                <img
                  src={post.documentImage || "/default-thumbnail.jpg"}
                  alt={post.documentName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </Link>

            <div className="flex flex-col flex-grow p-4 bg-white">
              <Link href={`/slideshow/${post.id}`}>
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.documentName}
                </h3>
              </Link>

              <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                <span className="hover:text-blue-600 transition-colors">
                  {post.upLoader.infoId.fullName}
                </span>

                <div className="flex items-center text-gray-600 space-x-1">
                  <FiDownload className="h-5 w-5" />
                  <span className="text-sm">
                    {post.originalDocument.downloadCount}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 space-x-1">
                  <AiOutlineEye className="h-5 w-5" />
                  <span className="text-sm">{post.viewCount}</span>
                </div>

                <button
                  className="flex items-center text-blue-600 cursor-pointer"
                  onClick={() => handleAddFavorite(post.id)}
                >
                  <BiBookmark className="h-5 w-5 mr-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          className={`px-4 py-2 border rounded-md ${
            currentPage === 0 ? "text-gray-400 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {"<"}
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
          {currentPage + 1}
        </button>
        <button
          className={`px-4 py-2 border rounded-md ${
            currentPage === totalPages - 1
              ? "text-gray-400 cursor-not-allowed"
              : ""
          }`}
          disabled={currentPage === totalPages - 1}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {">"}
        </button>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
      />
    </div>
  );
}
