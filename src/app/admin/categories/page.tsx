"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
import { PlusCircle, Edit, Trash, Eye } from "lucide-react";
import {
  deleteCategory,
  updateCategory,
  createCategory,
  getCategoryById,
  getPaginatedCategories, // Import function for paginated data
} from "@/lib/categoriesService";

interface Category {
  id: number;
  categoryName: string;
  categoryDescription: string;
  getCategoryImage: string;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<Category>>({
    categoryName: "",
    categoryDescription: "",
    getCategoryImage: "",
  });
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    fetchCategories(currentPage, searchTerm); // Pass searchTerm here
  }, [currentPage, searchTerm]);

  const fetchCategories = async (page: number, searchTerm: string) => {
    try {
      setLoading(true);
      const data = await getPaginatedCategories(page, 8, searchTerm); // Pass searchTerm here
      if (data && Array.isArray(data.content)) {
        setCategories(data.content);
        setTotalPages(data.totalPages);
      } else {
        console.error("Dữ liệu không hợp lệ:", data);
        alert("Dữ liệu không hợp lệ hoặc không có danh mục");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      alert("Có lỗi xảy ra khi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (
      !form.categoryName ||
      !form.categoryDescription ||
      !form.getCategoryImage
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      if (editing && form.id !== undefined) {
        await updateCategory(form.id, form);
      } else {
        await createCategory(form);
      }
      setDialogOpen(false);
      fetchCategories(currentPage, searchTerm); // Refresh categories after create or update
      resetForm();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      alert("Có lỗi xảy ra khi lưu danh mục");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await deleteCategory(id);
      fetchCategories(currentPage, searchTerm); // Refresh categories after delete
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      alert("Có lỗi xảy ra khi xóa danh mục");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const category = await getCategoryById(id);
      setForm({
        id: category.id,
        categoryName: category.categoryName,
        categoryDescription: category.categoryDescription,
        getCategoryImage: category.getCategoryImage,
      });
      setEditing(true);
      setDialogOpen(true);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết danh mục:", error);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const category = await getCategoryById(id);
      setSelectedCategory(category);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết danh mục:", error);
    }
  };

  const resetForm = () => {
    setForm({
      categoryName: "",
      categoryDescription: "",
      getCategoryImage: "",
    });
    setEditing(false);
  };

  // Filter categories based on search term
  const filteredCategories = (categories || []).filter(
    (category) =>
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.categoryDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-500">Quản lý danh mục</h1>
      </div>

      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4 pr-4 py-2 w-full md:w-96 border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500
               via-red-500 to-yellow-500 hover:bg-gradient-to-l text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm danh mục mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-blue-500">
                {editing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Tên danh mục"
                value={form.categoryName}
                onChange={(e) =>
                  setForm({ ...form, categoryName: e.target.value })
                }
                className="border-yellow-500 focus:ring-2 focus:ring-yellow-500"
              />
              <Input
                placeholder="Mô tả danh mục"
                value={form.categoryDescription}
                onChange={(e) =>
                  setForm({ ...form, categoryDescription: e.target.value })
                }
                className="border-red-500 focus:ring-2 focus:ring-red-500"
              />
              <Input
                placeholder="URL hình ảnh"
                value={form.getCategoryImage}
                onChange={(e) =>
                  setForm({ ...form, getCategoryImage: e.target.value })
                }
                className="border-pink-500 focus:ring-2 focus:ring-pink-500"
              />
              <Button
                onClick={handleCreateOrUpdate}
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {editing ? "Lưu thay đổi" : "Tạo mới"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border shadow-lg overflow-x-auto bg-blue-50">
        {loading ? (
          <p className="text-center py-4 text-blue-500">Đang tải dữ liệu...</p>
        ) : (
          <Table>
            <TableHeader className="bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 text-white">
              <TableRow>
                <TableHead className="text-center font-bold text-lg shadow-md text-gray-200">
                  ID
                </TableHead>
                <TableHead className="text-left font-bold text-lg shadow-md text-gray-200">
                  Tên danh mục
                </TableHead>
                <TableHead className="text-left font-bold text-lg shadow-md text-gray-200">
                  Mô tả
                </TableHead>
                <TableHead className="text-left font-bold text-lg shadow-md text-gray-200">
                  Hình ảnh
                </TableHead>
                <TableHead className="text-center font-bold text-lg shadow-md text-gray-200">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow
                  key={category.id}
                  className="hover:bg-blue-100 hover:shadow-xl transition-all duration-300"
                >
                  <TableCell className="text-center font-medium text-gray-800 py-2">
                    {category.id}
                  </TableCell>
                  <TableCell className="text-left font-medium text-gray-800 py-2">
                    {category.categoryName}
                  </TableCell>
                  <TableCell className="text-left font-medium text-gray-800 py-2">
                    {category.categoryDescription}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    <img
                      src={category.getCategoryImage}
                      alt="Category"
                      className="h-10 w-10 object-cover rounded-md shadow-lg"
                    />
                  </TableCell>
                  <TableCell className="text-center py-2">
                    <div className="flex justify-center items-center gap-4">
                      <Button
                        onClick={() => handleEdit(category.id)}
                        variant="default"
                        size="sm"
                        className="hover:bg-blue-300 shadow-md transition-all duration-300"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(category.id)}
                        variant="destructive"
                        size="sm"
                        className="hover:bg-red-300 shadow-md transition-all duration-300"
                      >
                        <Trash className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={() => handleViewDetails(category.id)}
                        variant="secondary"
                        size="sm"
                        className="hover:bg-gray-300 shadow-md transition-all duration-300"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white hover:bg-gradient-to-l"
        >
          <FaChevronLeft />
        </Button>
        <span className="font-medium text-gray-600">
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white hover:bg-gradient-to-l"
        >
          <FaChevronRight />
        </Button>
      </div>

      {/* Category Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-blue-500">
              Chi tiết danh mục
            </DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div>
              <p className="font-bold">Tên danh mục:</p>
              <p>{selectedCategory.categoryName}</p>
              <p className="font-bold mt-2">Mô tả:</p>
              <p>{selectedCategory.categoryDescription}</p>
              <p className="font-bold mt-2">Hình ảnh:</p>
              <img
                src={selectedCategory.getCategoryImage}
                alt="Category"
                className="h-20 w-20 object-cover rounded-md shadow-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
