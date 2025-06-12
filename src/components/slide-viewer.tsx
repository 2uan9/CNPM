import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import ApiService from "@/lib/postService";
import docsService from "@/lib/docsService";
import { FiDownload, FiLink } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SlideViewerProps {
  id: number;
}

interface DocumentPost {
  documentName: string;
  documentDescription: string;
  viewcount: number;
  upLoader: {
    info: {
      fullName: string;
      avatarURL: string;
      username: string;
    };
  };
  originalDocument: {
    id: number;
    documentURL: string;
    downloadCount: number;
  };
  tags: string[];
  category: {
    name: string;
  };
  downloadCount: number;
}

export function SlideViewer({ id }: SlideViewerProps) {
  const [documentPost, setDocumentPost] = useState<DocumentPost | null>(null);

  // Hàm tăng số lượt xem khi tài liệu được mở
  const incrementViewCount = async () => {
    try {
      await ApiService.incrementViewCount(id); // Gọi API để tăng số lượt xem
    } catch (error) {
      console.error("Lỗi khi tăng số lượt xem:", error);
    }
  };

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const response = await ApiService.getPostById(id);
        const newData = response.data;

        // Kiểm tra nếu dữ liệu từ API khác dữ liệu trong localStorage
        const storedData = localStorage.getItem(`postData_${id}`);
        if (storedData) {
          const { data: oldData } = JSON.parse(storedData);
          if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
            // Dữ liệu thay đổi, cập nhật vào localStorage
            localStorage.setItem(
              `postData_${id}`,
              JSON.stringify({
                data: newData,
                timestamp: Date.now(),
              })
            );
            setDocumentPost(newData);
            incrementViewCount(); // Tăng số lượt xem khi tài liệu được tải
          } else {
            // Dữ liệu không thay đổi
            setDocumentPost(oldData);
          }
        } else {
          // Không có dữ liệu trong localStorage, lưu dữ liệu mới
          localStorage.setItem(
            `postData_${id}`,
            JSON.stringify({
              data: newData,
              timestamp: Date.now(),
            })
          );
          setDocumentPost(newData);
          incrementViewCount(); // Tăng số lượt xem khi tài liệu được tải
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bài viết:", error);

        // Nếu lỗi, sử dụng dữ liệu cũ từ localStorage (nếu có)
        const storedData = localStorage.getItem(`postData_${id}`);
        if (storedData) {
          const { data } = JSON.parse(storedData);
          setDocumentPost(data);
        }
      }
    };

    fetchPostById();
  }, [id]);

  if (!documentPost) {
    return <div className="text-center text-gray-500">Đang tải...</div>;
  }

  const {
    documentName,
    documentDescription,
    upLoader,
    originalDocument,
    tags,
    category,
  } = documentPost;

  const authorName = upLoader?.info?.fullName || "Tác giả không xác định";
  const authorAvatar =
    upLoader?.info?.avatarURL || "/path/to/default-avatar.jpg";
  const documentUrl = originalDocument?.documentURL || "#";
  const categoryName = category?.name || "Chưa có thể loại";

  const copyLink = () => {
    navigator.clipboard.writeText(documentUrl);
    toast.success("Link tài liệu đã được sao chép!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleDownload = async () => {
    try {
      await docsService.downloadDocumentById(originalDocument.id);
      toast.success("Tải xuống tài liệu thành công!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Lỗi khi tải tài liệu.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-[9/8]">
          <iframe
            src={documentUrl}
            className="absolute inset-0 w-full h-full"
            sandbox="allow-scripts allow-same-origin"
            allow="autoplay"
            scrolling="yes"
            frameBorder="0"
          ></iframe>
        </div>

        <div className="flex justify-start gap-4 mt-6 bg-gray-100 p-4 rounded-lg shadow-lg">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg shadow-md hover:bg-gray-300 text-sm"
          >
            <FiDownload /> Tải xuống
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg shadow-md hover:bg-gray-300 text-sm"
          >
            <FiLink /> Copy link tài liệu
          </button>
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Lượt tải: </span>
            <span>{originalDocument.downloadCount}</span>
          </div>
        </div>
      </div>

      <div className="lg:w-[400px] w-full space-y-6">
        <Card className="space-y-6 shadow-xl p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800">{documentName}</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            {documentDescription}
          </p>

          <div className="flex items-center gap-4">
            <img
              src={`http://localhost:8080${authorAvatar}`}
              alt={authorName}
              className="w-14 h-14 rounded-full object-cover shadow-md"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{authorName}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Danh mục:</strong>
              <span className="inline-block px-3 py-1 bg-gray-200 text-black rounded-full text-xs font-bold shadow-sm hover:shadow-lg transition-all">
                {categoryName}
              </span>
            </p>
            <p>
              <strong>Tags:</strong>
              {tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-gray-200 text-black rounded-full text-xs font-bold shadow-sm hover:shadow-lg transition-all mr-2 mb-2"
                >
                  {tag}
                </span>
              ))}
            </p>
          </div>
        </Card>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
