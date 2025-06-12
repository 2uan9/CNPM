import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ApiService from "@/lib/postService"; // Đảm bảo ApiService đã được import đúng

const UserActivity = () => {
  const [documents, setDocuments] = useState<any[]>([]); // Tạo state để lưu dữ liệu từ API
  const [loading, setLoading] = useState<boolean>(true); // Để kiểm tra trạng thái tải dữ liệu

  useEffect(() => {
    // Gọi API để lấy danh sách bài viết đã được phê duyệt
    ApiService.searchApprovedDocuments(0, 5)
      .then((response) => {
        setDocuments(response.data.content); // Lưu trữ dữ liệu bài viết vào state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching approved documents:", error);
        setLoading(false);
      });
  }, []); // Hàm useEffect chỉ chạy một lần khi component mount

  if (loading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Avatar</TableHead>
          <TableHead>Tên Người Dùng</TableHead>
          <TableHead>Tên Bài Viết</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>
              <img
                src={`http://localhost:8080${doc.upLoader.infoId.avatarURL}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
            </TableCell>
            <TableCell>{doc.upLoader.infoId.fullName}</TableCell>
            <TableCell>{doc.documentName}</TableCell>
            <TableCell>{doc.upLoader.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserActivity;
