"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Building2,
  MapPin,
  Info,
  Edit2,
  Eye,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Loading } from "@/components/ui/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { DocumentViewerModal } from "@/components/document-viewer-modal";
import { authService } from "@/lib/authService";
import ApiService from "@/lib/postService";

interface UserData {
  fullname: string;
  image?: string;
  job?: string;
  company?: string;
  description?: string;
  id: number;
}

interface Document {
  id: number;
  documentName: string;
  documentDescription: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  documentURL: string;
  documentImage: string;
  viewCount: number;
  category: {
    categoryName: string;
    getCategoryImage: string;
  };
  originalDocument: {
    id: number;
    fileName: string;
    documentURL: string;
    downloadCount: number;
  };
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("Giới thiệu về tôi");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authService.getUserDetails();
        setCurrentUser(data);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDocuments = async () => {
      try {
        const response = await ApiService.getDocumentsForUserProfile();
        setDocuments(response.data);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };

    fetchUserData();
    fetchDocuments();
  }, []);

  const handleEditBio = () => setIsEditing(true);
  const handleSaveBio = () => setIsEditing(false);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const filteredDocuments = (
    userData: UserData | null,
    currentUser: UserData | null
  ) => {
    if (!userData || !currentUser) return [];
    if (userData.id === currentUser.id) {
      return documents;
    }
    return documents.filter((doc) => doc.status === "APPROVED");
  };

  const renderFeaturedCard = (doc: Document) => (
    <div
      key={doc.id}
      className="group flex flex-col border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow h-[300px] w-full relative"
      onClick={() => handleDocumentClick(doc)}
    >
      <div className="relative h-[150px] w-full overflow-hidden">
        <img
          src={doc.documentImage}
          alt={doc.documentName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col flex-grow p-4 bg-white">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
          {doc.documentName}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {doc.documentDescription || "Không có mô tả"}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
          <span className="hover:text-blue-600 transition-colors">
            Tác giả: {userData?.fullname}
          </span>
          <div className="flex gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{doc.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{doc.originalDocument.downloadCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const pendingCount = documents.filter(
    (doc) => doc.status === "PENDING"
  ).length;
  const approvedCount = documents.filter(
    (doc) => doc.status === "APPROVED"
  ).length;
  const rejectedCount = documents.filter(
    (doc) => doc.status === "REJECTED"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideNavigation={true} />

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <Loading className="h-64" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 md:grid-cols-[300px_1fr]"
          >
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Avatar className="w-32 h-32 mx-auto mb-4">
                      <AvatarImage
                        src={`http://localhost:8080${userData?.image}`}
                        alt="Profile"
                      />
                      <AvatarFallback>
                        {userData?.fullname?.charAt(0)}{" "}
                        {/* Hiển thị chữ cái đầu tiên của tên nếu không có ảnh */}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">
                      {userData?.fullname || "Tên người dùng"}
                    </h1>
                    <Button asChild className="mt-4 w-full">
                      <Link href="/settings">Chỉnh sửa hồ sơ</Link>
                    </Button>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4" />
                      <span>{userData?.job || "Chưa cập nhật công việc"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {userData?.company || "Chưa cập nhật công ty"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Info className="h-4 w-4" />
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                            placeholder="Nhập giới thiệu về bản thân"
                          />
                          <Button size="sm" onClick={handleSaveBio}>
                            Lưu
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span>
                            {userData?.description ||
                              "Chưa cập nhật giới thiệu"}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleEditBio}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thống kê nằm dưới phần card thông tin người dùng */}
              <Card className="space-y-6 mt-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Thống kê
                  </h2>
                  <div className="flex justify-between mt-4 text-center text-sm">
                    <div className="flex-1">
                      <h3 className="text font-semibold text-gray-700">
                        Bài viết
                      </h3>
                      <p className="text-lg font-bold text-indigo-600">
                        {documents.length}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h3 className="text font-semibold text-gray-700">
                        Lượt xem
                      </h3>
                      <p className="text-lg font-bold text-indigo-600">
                        {documents.reduce((acc, doc) => acc + doc.viewCount, 0)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h3 className="text font-semibold text-gray-700">
                        Tải xuống
                      </h3>
                      <p className="text-lg font-bold text-indigo-600">
                        {documents.reduce(
                          (acc, doc) =>
                            acc + doc.originalDocument.downloadCount,
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Tabs defaultValue="PENDING" className="space-y-6">
                <TabsList className="bg-white w-full justify-start">
                  <TabsTrigger value="PENDING">
                    Chờ duyệt ({pendingCount})
                  </TabsTrigger>
                  <TabsTrigger value="APPROVED">
                    Đã duyệt ({approvedCount})
                  </TabsTrigger>
                  <TabsTrigger value="REJECTED">
                    Đã từ chối ({rejectedCount})
                  </TabsTrigger>
                </TabsList>

                {(["PENDING", "APPROVED", "REJECTED"] as const).map(
                  (status) => (
                    <TabsContent
                      key={status}
                      value={status}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocuments(userData, currentUser)
                          .filter((doc) => doc.status === status)
                          .map((doc) => renderFeaturedCard(doc))}
                      </div>
                    </TabsContent>
                  )
                )}
              </Tabs>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
      {selectedDocument && (
        <DocumentViewerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          document={selectedDocument}
        />
      )}
    </div>
  );
}
