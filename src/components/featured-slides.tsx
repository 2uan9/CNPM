"use client";

import { useState, useEffect, useCallback } from "react";
import ApiService from "@/lib/postService"; // Dùng đúng API service cho việc tìm kiếm tài liệu
import FavoritesDocService from "@/lib/favoritesDocService"; // Import API service cho việc yêu thích
import Link from "next/link";
import { BiBookmark } from "react-icons/bi"; // Import bookmark icon
import { FiDownload } from "react-icons/fi"; // Import download icon
import { AiOutlineEye } from "react-icons/ai"; // Import eye icon for view count
import { toast, ToastContainer } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho Toastify

// Định nghĩa kiểu dữ liệu cho Slide
interface Slide {
  id: number;
  documentName: string;
  documentDescription: string;
  documentImage: string;
  documentURL: string;
  uploaderName: string;
  downloadCount: number; // Thêm thuộc tính downloadCount
  viewCount: number; // Thêm thuộc tính viewCount
}

// Định nghĩa kiểu dữ liệu cho phản hồi API
interface ApiResponse {
  content: {
    id: number;
    documentName: string;
    documentDescription: string;
    documentImage: string;
    viewCount: number;
    originalDocument: {
      thumbnailURL: string;
      documentURL: string;
      downloadCount: number;
    };
    upLoader: {
      infoId: {
        fullName: string;
      };
    };
  }[];
}

export function FeaturedSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái để theo dõi quá trình tải

  // Hàm lấy danh sách tài liệu đã được phê duyệt
  const fetchApprovedDocuments = async () => {
    if (loading) return; // Ngừng gọi API nếu dữ liệu đang được tải

    setLoading(true); // Đặt trạng thái loading là true khi bắt đầu gọi API
    console.log("Đang gọi API để lấy tài liệu...");
    try {
      const response = await ApiService.searchApprovedDocuments(0, 8); // page=0, size=8
      const fetchedSlides = (response.data as ApiResponse).content.map(
        (doc) => ({
          id: doc.id,
          documentName: doc.documentName,
          documentDescription: doc.documentDescription,
          documentImage: doc.documentImage || doc.originalDocument.thumbnailURL,
          documentURL: doc.originalDocument.documentURL,
          uploaderName: doc.upLoader.infoId.fullName,
          downloadCount: doc.originalDocument.downloadCount, // Lấy downloadCount từ API
          viewCount: doc.viewCount, // Lấy viewCount từ API
        })
      );
      setSlides(fetchedSlides);
    } catch (error) {
      console.error("Lỗi khi tải tài liệu đã phê duyệt:", error);
    } finally {
      setLoading(false); // Đặt trạng thái loading là false khi API kết thúc
    }
  };

  // Hàm xử lý thêm tài liệu vào danh sách yêu thích (dùng useCallback để tránh render lại nhiều lần)
  const handleAddFavorite = useCallback(
    async (postId: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Ngừng sự kiện lan tỏa lên phần tử cha
      try {
        await FavoritesDocService.addFavoriteDocument(postId); // Gọi API thêm tài liệu vào yêu thích
        toast.success("Tài liệu đã được thêm vào yêu thích!"); // Hiển thị thông báo thành công
      } catch (error) {
        console.error("Lỗi khi thêm tài liệu yêu thích:", error);
        toast.error("Lỗi khi thêm tài liệu yêu thích."); // Hiển thị thông báo lỗi
      }
    },
    [] // Hàm này chỉ được tạo lại khi dependencies thay đổi (ở đây là không có dependency)
  );

  // Lấy tài liệu khi component được mount
  useEffect(() => {
    fetchApprovedDocuments();
  }, []); // Đảm bảo chỉ gọi 1 lần khi component mount

  return (
    <div className="space-y-12 py-12 bg-gray-50">
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Tài liệu mới được tải lên
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="group flex flex-col border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow h-[350px] w-full relative"
            >
              {/* Phần hình ảnh */}
              <Link href={`/slideshow/${slide.id}`}>
                <div className="relative h-[200px] w-full overflow-hidden">
                  <img
                    src={slide.documentImage}
                    alt={slide.documentName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </Link>

              {/* Phần nội dung */}
              <div className="flex flex-col flex-grow p-4 bg-white">
                {/* Tiêu đề */}
                <Link href={`/slideshow/${slide.id}`}>
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                    {slide.documentName}
                  </h3>
                </Link>
                {/* Phần footer */}
                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                  <span className="hover:text-blue-600 transition-colors">
                    {slide.uploaderName}
                  </span>
                  {/* Số lượt tải và biểu tượng tải */}
                  <div className="flex items-center text-gray-600 space-x-1">
                    <FiDownload className="h-5 w-5" />
                    <span className="text-sm">{slide.downloadCount}</span>
                  </div>
                  {/* Số lượt xem và biểu tượng mắt */}
                  <div className="flex items-center text-gray-600 space-x-1">
                    <AiOutlineEye className="h-5 w-5" />
                    <span className="text-sm">{slide.viewCount}</span>
                  </div>
                  {/* Nút đánh dấu yêu thích */}
                  <button
                    className="flex items-center text-blue-600 cursor-pointer"
                    onClick={(e) => handleAddFavorite(slide.id, e)} // Ngừng sự kiện lan tỏa khi click
                  >
                    <BiBookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ToastContainer để hiển thị thông báo */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000} // Tự động đóng sau 3 giây
        hideProgressBar={true} // Ẩn thanh tiến trình
        newestOnTop={true} // Thông báo mới nhất sẽ xuất hiện ở trên cùng
        closeOnClick
        rtl={false}
      />
    </div>
  );
}
