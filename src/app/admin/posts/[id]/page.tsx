"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ApiService from "@/lib/postService";

interface PostDetail {
  id: number;
  documentName: string;
  originalDocument: {
    fileName: string;
    documentURL: string;
  };
  upLoader: {
    info: {
      fullName: string;
    };
  };
  documentDescription: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postId = params.id ? Number(params.id) : null;

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getPostById(postId!);
        setPost(response.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Không thể tải chi tiết bài viết.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDetail();
    } else {
      setError("ID bài viết không hợp lệ.");
      setLoading(false);
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!post) {
    return <div>Không tìm thấy chi tiết bài viết.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Chi tiết bài viết</h1>
        <Link href="/admin/posts">
          <Button
            variant="outline"
            className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Quay lại danh sách</span>
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            <span>Tên bài viết: </span>
            {post.documentName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-2">
            <span>Người tải lên:</span> {post.upLoader.info.fullName}
          </p>
          <p className="text-gray-700 mb-4">
            <span>Tên tài liệu:</span> {post.originalDocument.fileName}
          </p>
          <p className="text-gray-700 mb-4">
            <span>Mô trả:</span> {post.documentDescription}
          </p>
          <div className="mt-6">
            <strong className="text-lg">Xem tài liệu:</strong>
            <div className="overflow-hidden rounded-lg shadow-lg mt-4">
              <iframe
                src={post.originalDocument.documentURL}
                title={post.documentName}
                className="w-full max-w-4xl mx-auto border-none rounded-lg"
                style={{ height: "100vh" }}
                allowFullScreen
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
