import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ApiService from "@/lib/postService"; // Service handling API calls
import { toast } from "react-toastify"; // Import react-toastify
import { getAllCategories } from "@/lib/categoriesService"; // Import category fetching function

// Component for confirming deletion
interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onDelete,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Bạn thực sự muốn xóa bài viết này chứ?</p>
          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button className="bg-red-500 text-white" onClick={onDelete}>
              Xóa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Component for editing post
interface EditPostFormProps {
  postId: number;
  currentData: {
    documentName: string;
    documentDescription: string;
    category: string;
    tags: string[];
  };
  categories: { name: string; id: number }[];
  tags: { name: string; id: number }[];
  onSave: (updatedData: {
    documentName: string;
    documentDescription: string;
    category: string;
    tags: string[];
  }) => void;
  onCancel: () => void;
}

function EditPostForm({
  postId,
  currentData,
  onSave,
  onCancel,
}: EditPostFormProps) {
  const [documentName, setDocumentName] = useState(currentData.documentName);
  const [documentDescription, setDocumentDescription] = useState(
    currentData.documentDescription
  );
  const [category] = useState(currentData.category);
  const [selectedTags] = useState(currentData.tags);

  const handleSave = async () => {
    try {
      const updatedData = {
        documentName,
        documentDescription,
        category,
        tags: selectedTags,
      };
      await ApiService.updatePost(postId, updatedData);
      onSave(updatedData); // Call callback when save is successful
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật bài viết.");
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block font-semibold">Tên tài liệu</label>
            <Input
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold">Mô tả</label>
            <Textarea
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full py-2 rounded-md text-sm font-semibold border border-gray-300"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="w-full py-2 rounded-md text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600"
            >
              Lưu
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Document Viewer Modal Component
interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: number;
    documentURL: string;
    status: "PENDING" | "REJECTED" | "APPROVED";
    rejectionReason?: string;
    documentDescription: string;
    category?: {
      categoryName: string;
      getCategoryImage: string;
    };
    tags?: { name: string; id: number }[];
    documentName?: string;
    originalDocument: {
      id: number;
      fileName: string;
      documentURL: string;
    };
  };
}

export function DocumentViewerModal({
  isOpen,
  onClose,
  document,
}: DocumentViewerModalProps) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditFormOpen, setEditFormOpen] = useState(false);
  const [documentData, setDocumentData] = useState({
    documentName: document.documentName,
    documentDescription: document.documentDescription,
    category: document.category ? document.category.categoryName : "",
    tags: document.tags ? document.tags.map((tag) => tag.name) : [],
  });
  const [categories, setCategories] = useState<{ name: string; id: number }[]>(
    []
  );
  useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    };

    fetchData();
  }, []);
  useEffect(() => {
    setDocumentData({
      documentName: document.documentName || "",
      documentDescription: document.documentDescription || "",
      category: document.category ? document.category.categoryName : "",
      tags: document.tags ? document.tags.map((tag) => tag.name) : [],
    });
  }, [document]);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await ApiService.deletePost(document.id); // Gọi API để xóa bài viết
      toast.success("Bài viết đã bị xóa", {
        position: "bottom-right", // Đặt vị trí thông báo
        autoClose: 3000, // Thời gian tự động đóng thông báo
      });
      onClose(); // Đóng modal khi xóa thành công
      window.location.reload(); // Reload trang sau khi xóa
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa bài viết");
    }
    setDeleteDialogOpen(false); // Đóng hộp thoại xác nhận xóa
  };

  const handleEditSave = (updatedData: {
    documentName: string;
    documentDescription: string;
    category: string;
    tags: string[];
  }) => {
    setDocumentData(updatedData);
    setEditFormOpen(false); 
    onClose(); // Đóng modal khi xóa thành công
    window.location.reload(); 
  };

  const handleEditCancel = () => {
    setEditFormOpen(false); // Đóng form chỉnh sửa và hiển thị lại các nút
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[85vh] p-0 overflow-y-auto">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold mb-2"></DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {document.status === "PENDING" && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    Đang chờ duyệt
                  </Badge>
                )}
                {document.status === "REJECTED" && (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    Đã bị từ chối
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1fr_320px] p-6 pt-4 h-[calc(85vh-80px)]">
          <div className="space-y-4 overflow-y-auto">
            {document.status === "REJECTED" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800">
                      Tài liệu bị từ chối
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      {document.rejectionReason ||
                        "Bài viết có nội dụng không phù hợp"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {document.status === "PENDING" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">
                      Tài liệu đang chờ duyệt
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Tài liệu của bạn đang được xem xét. Chúng tôi sẽ thông báo
                      cho bạn khi có quyết định.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={document.originalDocument.documentURL}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Card for document info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin tài liệu</h3>
                    <div className="space-y-2 text-sm">
                      {document.documentName && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Tên tài liệu:
                          </span>
                          <span className="font-medium">
                            {document.documentName}
                          </span>
                        </div>
                      )}
                      {document.category && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Danh mục:
                          </span>
                          <span className="font-medium">
                            {document.category.categoryName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {document.documentDescription && (
                    <div>
                      <h3 className="font-semibold mb-2">Mô tả</h3>
                      <p className="text-sm text-muted-foreground">
                        {document.documentDescription}
                      </p>
                    </div>
                  )}

                  {document.tags && document.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="rounded-full"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card for edit form and buttons */}
            {isEditFormOpen ? (
              <EditPostForm
                postId={document.id}
                currentData={documentData}
                categories={categories}
                onSave={handleEditSave}
                onCancel={handleEditCancel}
              />
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-5 mt-1">
                    <Button
                      onClick={() => setEditFormOpen(true)}
                      className="inline-flex items-center border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md"
                    >
                      Cập nhật
                    </Button>
                    <Button
                      onClick={handleDeleteClick}
                      className="inline-flex items-center border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md"
                    >
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteConfirm}
      />
    </Dialog>
  );
}
