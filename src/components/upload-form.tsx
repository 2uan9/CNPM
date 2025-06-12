"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getAllCategories } from "@/lib/categoriesService";
import { deleteDocument } from "@/lib/docsService";
import ApiService from "@/lib/postService";
interface Category {
  id: number;
  categoryName: string;
}

interface UploadResponse {
  id: number;
  docLink: string;
  thumbnailLink: string | null;
}

interface UploadFormProps {
  file: File;
  onReset: () => void; // Hàm hủy sẽ được truyền từ UploadSection
  uploadResponse: UploadResponse;
}

export function UploadForm({ file, onReset, uploadResponse }: UploadFormProps) {
  const [title, setTitle] = useState(file?.name || "");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCancel = async () => {
    if (uploadResponse?.id) {
      try {
        deleteDocument(uploadResponse.id); // Gọi API xóa tài liệu
        alert("Tài liệu đã bị xóa thành công.");
        onReset(); // Reset form sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa tài liệu:", error);
        alert("Không thể xóa tài liệu. Vui lòng thử lại.");
      }
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Xây dựng đối tượng postData
      const postData = {
        documentName: title,
        documentDescription: description,
        documentImage: uploadResponse.thumbnailLink || null, // Sử dụng thumbnailLink làm ảnh tài liệu
        originalDocument: { id: uploadResponse.id }, // Dùng id thay vì docLink
        category: { id: parseInt(category) },
        tags: tags.split(",").map((tag) => ({ name: tag.trim() })),
      };

      // Gửi yêu cầu tạo bài post
      await ApiService.createPost(postData);

      // Chuyển hướng sau khi thành công
      router.push("/");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Tải lên thất bại. Vui lòng thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  if (!file) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-2">
        Thêm thông tin cho tài liệu của bạn
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Giúp người khác dễ dàng khám phá tài liệu của bạn
      </p>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            <div className="width-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <iframe
                src={uploadResponse.docLink} // docLink chỉ dùng để hiển thị tài liệu
                width="120%"
                height="500px"
                title="Document Preview"
                className="border rounded-lg"
              />
            </div>

            <div>
              <form onSubmit={handlePublish} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      Tiêu đề<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      maxLength={40}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {title.length}/40 ký tự
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Mô tả về tài liệu"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Danh mục</Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Thêm các thẻ, cách nhau bằng dấu phẩy"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Ví dụ: Java, Spring Boot, API
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={handleCancel}>
                    Hủy
                  </Button>

                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? "Đang tải lên..." : "Đăng tải"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
