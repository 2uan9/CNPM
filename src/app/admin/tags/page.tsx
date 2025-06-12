"use client";
import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import tagApi from "@/lib/tagApi";

interface Tag {
  id: number;
  tagName: string;
  tagDescription: string;
}

export default function TagsManagement() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState<string>("");
  const [newTagDescription, setNewTagDescription] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); // Trạng thái trang hiện tại
  const [totalPages, setTotalPages] = useState<number>(0); // Tổng số trang
  const pageSize = 8; // Số thẻ mỗi trang

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const data = await tagApi.getAllTags(
          currentPage,
          pageSize,
          searchQuery
        ); // Add searchQuery here
        setTags(data.content); // Giả sử server trả về data có thuộc tính content chứa danh sách thẻ
        setTotalPages(data.totalPages); // Cập nhật tổng số trang
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, [currentPage, searchQuery]); // Fetch lại khi thay đổi trang hoặc searchQuery

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleDeleteConfirmation = async () => {
    if (tagToDelete) {
      try {
        await tagApi.deleteTag(tagToDelete.id); // Xóa thẻ từ API
        setTags(tags.filter((tag) => tag.id !== tagToDelete.id)); // Cập nhật lại danh sách thẻ
        setTagToDelete(null);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error deleting tag:", error);
      }
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName || !newTagDescription) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const newTag = await tagApi.createTag({
        tagName: newTagName,
        tagDescription: newTagDescription,
      });
      setTags([...tags, newTag]); // Thêm thẻ mới vào danh sách
      setNewTagName("");
      setNewTagDescription("");
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const handleEditTag = async () => {
    if (!selectedTag || !selectedTag.tagName || !selectedTag.tagDescription) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const updatedTag = await tagApi.updateTag(selectedTag.id, {
        tagName: selectedTag.tagName,
        tagDescription: selectedTag.tagDescription,
      });
      setTags(tags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))); // Cập nhật thẻ sau khi chỉnh sửa
      setSelectedTag(null);
    } catch (error) {
      console.error("Error editing tag:", error);
    }
  };

  const handleViewDetails = (tag: Tag) => {
    setSelectedTag(tag);
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-blue-500">Quản lý thẻ</h1>

      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Input
            placeholder="Tìm kiếm thẻ..."
            className="pl-4 pr-4 py-2 w-full border-blue-500 focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500
               via-red-500 to-yellow-500 hover:bg-gradient-to-l text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Thêm thẻ mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm thẻ mới</DialogTitle>
            </DialogHeader>
            <div className="text-blue-500 space-y-4">
              <div>
                <Input
                  placeholder="Tên thẻ"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="border-pink-500 focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <Input
                  placeholder="Mô tả thẻ"
                  value={newTagDescription}
                  onChange={(e) => setNewTagDescription(e.target.value)}
                  className="border-purple-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <Button
                variant="default"
                onClick={handleCreateTag}
                className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Tạo thẻ mới
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 text-white">
              <TableHead className="text-left font-bold text-lg shadow-md text-white">
                ID
              </TableHead>
              <TableHead className="text-left font-bold text-lg shadow-md text-white">
                Tên thẻ
              </TableHead>
              <TableHead className="text-left font-bold text-lg shadow-md text-white">
                Mô tả
              </TableHead>
              <TableHead className="text-center font-bold text-lg shadow-md text-white">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 text-blue-500"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => (
                <TableRow
                  key={tag.id}
                  className="hover:bg-blue-100 hover:shadow-xl transition-all duration-300"
                >
                  <TableCell className="px-4 py-2">{tag.id}</TableCell>
                  <TableCell className="px-4 py-2">{tag.tagName}</TableCell>
                  <TableCell className="px-4 py-2">
                    {tag.tagDescription}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    <div className="flex justify-center gap-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleViewDetails(tag)}
                          >
                            <FaEye className="text-white" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chi tiết thẻ</DialogTitle>
                          </DialogHeader>
                          {selectedTag && selectedTag.id === tag.id && (
                            <div>
                              <p>
                                <strong>Tên thẻ:</strong> {selectedTag.tagName}
                              </p>
                              <p>
                                <strong>Mô tả:</strong>{" "}
                                {selectedTag.tagDescription}
                              </p>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setSelectedTag({ ...tag })}
                          >
                            <FaEdit />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa thẻ</DialogTitle>
                          </DialogHeader>
                          {selectedTag && (
                            <div className="space-y-4">
                              <div>
                                <Input
                                  value={selectedTag.tagName}
                                  onChange={(e) =>
                                    setSelectedTag({
                                      ...selectedTag,
                                      tagName: e.target.value,
                                    })
                                  }
                                  placeholder="Tên thẻ"
                                  className="border-purple-500 focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <Input
                                  value={selectedTag.tagDescription}
                                  onChange={(e) =>
                                    setSelectedTag({
                                      ...selectedTag,
                                      tagDescription: e.target.value,
                                    })
                                  }
                                  placeholder="Mô tả thẻ"
                                  className="border-pink-500 focus:ring-2 focus:ring-pink-500"
                                />
                              </div>
                              <Button
                                variant="default"
                                onClick={handleEditTag}
                                className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                Lưu thay đổi
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setTagToDelete(tag);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <FaTrash className="text-white" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Hộp thoại xác nhận xóa thẻ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa thẻ</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa thẻ này?</p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmation}>
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Phân trang hiện đại */}
      <div className="flex justify-center items-center mt-4">
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            onClick={() => goToPage(0)}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded-full border text-gray-500 hover:text-blue-500 hover:border-blue-500"
          >
            {"<<"}
          </Button>

          <Button
            variant="outline"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 0}
            className="px-4 py-2 rounded-full border text-gray-500 hover:text-blue-500 hover:border-blue-500"
          >
            <FaChevronLeft />
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => goToPage(index)}
                disabled={currentPage === index}
                className={`px-4 py-2 rounded-full ${
                  currentPage === index
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                } hover:bg-blue-400 hover:text-white`}
              >
                {index + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 rounded-full border text-gray-500 hover:text-blue-500 hover:border-blue-500"
          >
            <FaChevronRight />
          </Button>

          <Button
            variant="outline"
            onClick={() => goToPage(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 rounded-full border text-gray-500 hover:text-blue-500 hover:border-blue-500"
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
}
