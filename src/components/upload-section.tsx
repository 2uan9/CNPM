"use client";
import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import apiService from "@/lib/docsService";
import { UploadForm } from "@/components/upload-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UploadResponse {
  id: number;
  fileName: string;
  fileType: string;
  docLink: string;
  thumbnailLink: string | null;
}

export function UploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(
    null
  );
  const sectionTitleRef = useRef<HTMLDivElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles?.length) {
        const selectedFile = acceptedFiles[0];
        // Kiểm tra loại file
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];
        if (allowedTypes.includes(selectedFile.type)) {
          setFile(selectedFile); // Lưu file vào state
          scrollToSectionTitle();
          await handleUpload(selectedFile); // Tải lên trực tiếp
        } else {
          toast.error(
            "Định dạng file không được hỗ trợ. Vui lòng chọn PDF, Word (DOC, DOCX), hoặc PowerPoint (PPT, PPTX)."
          );
        }
      }
    },
    maxFiles: 1,
    accept: ".pdf, .doc, .docx, .ppt, .pptx", // Hạn chế định dạng file khi kéo thả
  });

  const scrollToSectionTitle = () => {
    sectionTitleRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpload = async (file: File): Promise<void> => {
    setIsUploading(true);
    try {
      const response = await apiService.uploadDocument(file); // Gửi tài liệu qua API
      setUploadResponse({
        id: response.id,
        fileName: response.fileName,
        fileType: response.fileType,
        docLink: response.docLink,
        thumbnailLink: response.thumbnailLink || null,
      });
      toast.success("Tải lên thành công!");
    } catch (error) {
      console.error("Lỗi khi tải lên:", error);
      toast.error("Tải lên thất bại, vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {isUploading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="text-white text-xl">Đang tải lên...</div>
        </div>
      )}

      {!file && !uploadResponse && (
        <div ref={sectionTitleRef} className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Tải lên và chia sẻ</h1>
          <p className="text-gray-600">
            Bài thuyết trình, tài liệu và đồ họa thông tin
          </p>
        </div>
      )}

      {!file && !uploadResponse ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center bg-white`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <Button
            className="mb-4 bg-blue-600 hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? "Đang tải lên..." : "Chọn tài liệu để tải lên"}
          </Button>
          <p className="text-gray-500 mb-8">hoặc kéo & thả tại đây</p>
        </div>
      ) : (
        uploadResponse && (
          <UploadForm
            file={file!}
            uploadResponse={uploadResponse}
            onReset={() => {
              setFile(null);
              setUploadResponse(null);
            }}
          />
        )
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        <p className="mb-2">
          Định dạng được hỗ trợ: PowerPoint (PPT, PPTX), PDF, Word (DOC, DOCX)
        </p>
        <p>
          Bằng cách tải lên, bạn đồng ý với{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Thỏa thuận người dùng SlideShare
          </a>
        </p>
      </div>

      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
}
