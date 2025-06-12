"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ApiService from "@/lib/postService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";

interface Post {
  id: number;
  documentName: string;
  upLoader: {
    info: {
      fullName: string;
    };
  };
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const router = useRouter();

  const handleViewDocument = (id: number) => {
    router.push(`/admin/posts/${id}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await ApiService.getPosts(
          page,
          size,
          selectedCategory,
          searchQuery // Truyền searchQuery vào API
        );

        if (Array.isArray(response.data.content)) {
          setPosts(response.data.content);
        } else {
          console.error("Dữ liệu không phải là mảng:", response.data.content);
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };

    fetchPosts();
  }, [page, size, selectedCategory, searchQuery]);

  const handleApprove = async (id: number) => {
    try {
      await ApiService.approvePost(id);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, status: "APPROVED" } : post
        )
      );
      toast.success("Bài viết đã được duyệt!");
    } catch (error) {
      console.error("Lỗi khi duyệt bài viết:", error);
      toast.error("Có lỗi khi duyệt bài viết!");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await ApiService.rejectPost(id);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, status: "REJECTED" } : post
        )
      );
      toast.error("Bài viết đã bị từ chối!");
    } catch (error) {
      console.error("Lỗi khi từ chối bài viết:", error);
      toast.error("Có lỗi khi từ chối bài viết!");
    }
  };

  const handleDelete = (id: number) => {
    setDeletePostId(id);
  };

  const confirmDelete = async () => {
    if (deletePostId !== null) {
      try {
        await ApiService.deletePost(deletePostId);
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== deletePostId)
        );
        toast.success("Xóa bài viết thành công!");
        setDeletePostId(null);
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        toast.error("Có lỗi khi xóa bài viết!");
        setDeletePostId(null);
      }
    }
  };

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (selectedCategory !== "ALL") {
      filtered = posts.filter((post) => post.status === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((post) =>
        post.documentName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="rounded-lg bg-white shadow-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-blue-500">Quản lý bài viết</h1>

        <div className="mt-4 flex justify-between items-center">
          <Input
            placeholder="Tìm kiếm bài viết..."
            className="w-96 border-blue-500 focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật searchQuery khi nhập
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-lg text-gray-900 bg-white hover:bg-gray-300 active:bg-gray-400 focus:ring-2 focus:ring-gray-500 w-28"
              >
                {selectedCategory === "ALL" ? "Tất cả" : selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-md rounded-md py-1">
              <DropdownMenuItem onClick={() => setSelectedCategory("ALL")}>
                Tất cả
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("PENDING")}>
                Chờ duyệt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("APPROVED")}>
                Được duyệt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("REJECTED")}>
                Từ chối
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-lg border shadow-lg overflow-x-auto bg-blue-50 mt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 text-white">
                <TableHead className="text-left font-bold text-lg text-gray-200">
                  ID
                </TableHead>
                <TableHead className="text-left font-bold text-lg text-gray-200">
                  Tiêu đề
                </TableHead>
                <TableHead className="text-left font-bold text-lg text-gray-200">
                  Tác giả
                </TableHead>
                <TableHead className="text-left font-bold text-lg text-gray-200">
                  Trạng thái
                </TableHead>
                <TableHead className="text-center font-bold text-lg text-gray-200">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.documentName}</TableCell>
                  <TableCell>{post.upLoader.info.fullName}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-sm",
                        post.status === "PENDING" &&
                          "bg-yellow-100 text-yellow-800",
                        post.status === "APPROVED" &&
                          "bg-green-100 text-green-800",
                        post.status === "REJECTED" && "bg-red-100 text-red-800"
                      )}
                    >
                      {post.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="p-2 text-gray-500 hover:text-gray-800"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white shadow-md rounded-md py-1">
                        <DropdownMenuItem
                          onClick={() => handleApprove(post.id)}
                          className="hover:bg-gray-300 active:bg-gray-400"
                        >
                          Duyệt
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleReject(post.id)}
                          className="hover:bg-gray-300 active:bg-gray-400"
                        >
                          Từ chối
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post.id)}
                          className="hover:bg-gray-300 active:bg-gray-400"
                        >
                          Xóa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewDocument(post.id)}
                          className="hover:bg-gray-300 active:bg-gray-400"
                        >
                          Xem tài liệu
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center gap-4 mt-4 items-center">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            variant="outline"
            className="text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 rounded-full p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <span className="text-lg font-semibold text-gray-700">
            {page + 1}
          </span>

          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={filteredPosts.length < size}
            variant="outline"
            className="text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 rounded-full p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Dialog
        open={deletePostId !== null}
        onOpenChange={() => setDeletePostId(null)}
      >
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Xác nhận xóa
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600">
              Bạn có chắc chắn muốn xóa bài viết này không?
            </DialogDescription>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setDeletePostId(null)}>Hủy</Button>
              <Button onClick={confirmDelete}>Xóa</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
