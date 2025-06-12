"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FiDownload } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { Search } from "lucide-react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import api from "@/lib/favoritesDocService";
import { toast } from "react-toastify";

interface DecodedToken {
  userId: string;
}

interface SavedPresentation {
  id: string;
  favoriteId: number;
  title: string;
  author: string;
  thumbnail: string;
  views: number;
  downloads: number;
}

interface ApiResponse {
  content: Array<{
    id: number;
    post: {
      id: string;
      documentName: string;
      upLoader: {
        infoId: {
          fullName: string;
        };
      };
      documentImage: string;
      viewCount: number;
      originalDocument: {
        downloadCount: number;
      };
    };
  }>;
  totalPages: string;
}

export function SavedContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedItems, setSavedItems] = useState<SavedPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<number | null>(
    null
  ); // Sử dụng selectedFavoriteId

  // Fetch favorite documents
  const fetchFavorites = async (page: number, searchQuery: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        const accountId = Number(decodedToken.userId);

        const data: ApiResponse = await api.getFavoritesByAccountId(
          accountId,
          page,
          8,
          searchQuery
        );

        const items = data.content.map((item) => ({
          id: item.post.id,
          favoriteId: item.id, // Chỉ thêm vào đây
          title: item.post.documentName,
          author: item.post.upLoader.infoId.fullName,
          thumbnail: item.post.documentImage,
          views: item.post.viewCount,
          downloads: item.post.originalDocument.downloadCount,
        }));

        setSavedItems(items);
        setTotalPages(Number(data.totalPages));
      }
    } catch (error) {
      console.error("Error fetching favorite documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa tài liệu yêu thích
  const deleteFavoriteDocument = async (favoriteId: number) => {
    try {
      await api.deleteFavoriteDocument(favoriteId); // Dùng favoriteId ở đây
      toast.success("Xóa tài liệu yêu thích thành công!");
      setPage(0); // Reset trang
      fetchFavorites(0, searchQuery); // Tải lại danh sách
    } catch (error) {
      toast.error("Xóa tài liệu yêu thích thất bại.");
      console.error("Lỗi khi xóa tài liệu:", error);
    }
    setShowDeleteModal(false);
  };

  // Effect để gọi fetchFavorites khi `searchQuery` hoặc `page` thay đổi
  useEffect(() => {
    fetchFavorites(page, searchQuery);
  }, [page, searchQuery]);

  // Lọc tài liệu yêu thích
  const filteredItems = searchQuery
    ? savedItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : savedItems;

  return (
    <div className="container mx-auto px-6 lg:px-10 py-10">
      {/* Thanh tìm kiếm */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Tài liệu yêu thích</h1>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 pl-10"
          />
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Danh sách tài liệu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {loading ? (
          <p>Đang tải...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-gray-500">
            Không có tài liệu yêu thích
          </p>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group flex flex-col border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow h-[350px] w-full relative"
            >
              <Link href={`/slideshow/${item.id}`}>
                <div className="relative h-[200px] w-full overflow-hidden">
                  <img
                    src={item.thumbnail || "/default-thumbnail.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </Link>
              <CardContent className="flex flex-col flex-grow p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.author}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <FiDownload className="h-5 w-5 mr-1" />
                      {item.downloads}
                    </div>
                    <div className="flex items-center">
                      <AiOutlineEye className="h-5 w-5 mr-1" />
                      {item.views}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFavoriteId(item.favoriteId); // Lưu favoriteId khi xóa
                      setShowDeleteModal(true);
                    }}
                    className="text-lg font-bold"
                  >
                    ...
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Phân trang */}
      {!searchQuery && filteredItems.length > 0 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => {
                setPage(index);
              }}
              className={`px-4 py-2 rounded-md ${
                index === page
                  ? "bg-blue-500 text-white font-bold"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">
              Bạn muốn xóa bài viết này ra khỏi mục yêu thích chứ?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => deleteFavoriteDocument(selectedFavoriteId!)} // Dùng selectedFavoriteId để xóa
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Có
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
