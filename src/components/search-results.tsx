"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download } from "lucide-react";
import ApiService from "@/lib/postService"; // Import API service

interface Document {
  id: number;
  documentName: string;
  documentDescription: string;
  documentImage: string | null;
  originalDocument: {
    id: number;
    fileName: string;
    fileType: string;
    documentURL: string;
    thumbnailURL: string | null;
    downloadCount: number;
  };
  upLoader: {
    id: number;
    email: string;
    coins: number | null;
    infoId: {
      id: number;
      fullName: string;
      avatarURL: string | null;
      email: string;
      personalDescription: string;
      job: string;
      company: string;
    };
  };
  status: string;
  viewCount: number;
  postTags: {
    id: {
      postId: number;
      tagId: number;
    };
    tag: {
      id: number;
      tagName: string;
      tagDescription: string | null;
    };
  }[];
}

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [results, setResults] = useState<Document[]>([]);
  const [originalResults, setOriginalResults] = useState<Document[]>([]); // Lưu kết quả ban đầu
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(9);

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        try {
          const response = await ApiService.searchPostsByName(
            query,
            page,
            size,
            sortBy !== "all" ? sortBy : undefined // Truyền sortBy nếu không phải 'all'
          );
          if (response?.data.content) {
            setResults(response.data.content);
            setOriginalResults(response.data.content); // Lưu kết quả ban đầu
            setTotalPages(response.data.totalPages || 0);
          } else {
            setResults([]);
          }
        } catch (error) {
          console.error("Lỗi khi lấy kết quả tìm kiếm:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSearchResults();
    }
  }, [query, page, size, sortBy]); // Thêm sortBy vào dependencies

  const handleClearFilter = () => {
    setSortBy("relevance");
    setResults(originalResults); // Khôi phục danh sách ban đầu
  };

  const decodedQuery = decodeURIComponent(query);

  const highlightQuery = (documentName: string, query: string) => {
    const regex = new RegExp(`(${query})`, "gi");
    return documentName.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="font-bold text-blue-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl mb-4">
          <span className="font-normal">Kết quả tìm kiếm cho </span>
          <span className="font-bold text-blue-600">
            &quot;{decodedQuery}&quot;
          </span>
          <span className="text-gray-500 text-lg ml-2">
            ({results.length} kết quả)
          </span>
        </h1>
        <div className="flex flex-wrap gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="mostViewed">Xem nhiều nhất</SelectItem>
              <SelectItem value="mostDownloaded">
                Tải xuống nhiều nhất
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="link" onClick={handleClearFilter}>
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-center text-gray-500">Không tìm thấy kết quả nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {results.map((result) => (
            <Card
              key={result.id}
              className="group border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
            >
              <Link href={`/slideshow/${result.id}`}>
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={
                      result.originalDocument?.thumbnailURL ||
                      "/default-thumbnail.jpg"
                    }
                    alt={result.documentName || "Không có tiêu đề"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-4 bg-white">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                    {highlightQuery(result.documentName, query)}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="hover:text-blue-600 transition-colors">
                      {result.upLoader?.infoId?.fullName || "Ẩn danh"}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>{result.viewCount}</span>
                      <Download className="h-5 w-5" />
                      <span>{result.originalDocument.downloadCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4 space-x-2">
        <Button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border"
        >
          {"<"}
        </Button>
        <span className="px-4 py-2">{page + 1}</span>
        <Button
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border"
        >
          {">"}
        </Button>
      </div>
    </div>
  );
}
