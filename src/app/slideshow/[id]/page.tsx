"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ApiService from "@/lib/postService";
import { SlideViewer } from "@/components/slide-viewer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function SlideshowPage() {
  const [slideData, setSlideData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postId, setPostId] = useState<number | null>(null);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const parsedId = Array.isArray(id) ? Number(id[0]) : Number(id);
      if (!isNaN(parsedId)) {
        setPostId(parsedId);
      } else {
        setError("ID không hợp lệ.");
        setIsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    if (postId !== null) {
      const fetchSlideData = async () => {
        try {
          const response = await ApiService.getPostById(postId);
          setSlideData(response.data);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setError("Không thể tải dữ liệu tài liệu.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSlideData();
    }
  }, [postId]);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  if (!slideData) {
    return <div>Không tìm thấy tài liệu</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <SlideViewer id={postId || 0} /> {/* Truyền id qua SlideViewer */}
      </main>
      <Footer />
    </div>
  );
}
