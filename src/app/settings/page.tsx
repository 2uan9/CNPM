"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loading } from "@/components/ui/loading";
import { authService } from "@/lib/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";

interface UserData {
  fullname: string;
  image?: string;
  job?: string;
  company?: string;
  description?: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    fullname: "",
    job: "",
    company: "",
    description: "",
    image: "",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setUserData((prevData) => ({
        ...prevData,
        image: objectUrl,
      }));

      const formData = new FormData();
      formData.append("file", file);
      setIsLoading(true);

      try {
        const updatedAvatarUrl = await authService.uploadAvatar(formData);
        setUserData((prevData) => ({
          ...prevData,
          image: updatedAvatarUrl,
        }));
        toast.success("Cập nhật ảnh đại diện thành công!");
      } catch (err) {
        toast.error("Có lỗi xảy ra khi cập nhật ảnh đại diện.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const data = await authService.getUserDetails();
        setUserData({
          fullname: data.fullname || "",
          job: data.job || "",
          company: data.company || "",
          description: data.description || "",
          image: data.image || "",
        });
      } catch (err) {
        toast.error("Không thể tải thông tin người dùng.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedData = {
        ...userData,
        avatarUrl: userData.image,
        job: userData.job || "",
        company: userData.company || "",
        description: userData.description || "",
      };
      await authService.updateUser(updatedData);
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={true} hideNavigation={true} />
      <main className="container mx-auto px-6 py-8">
        <Card className="max-w-4xl mx-auto shadow-xl rounded-3xl bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-gray-900 font-semibold tracking-tight">
              Cài đặt tài khoản
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loading className="h-64" />
            ) : (
              <>
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 shadow-xl">
                    {userData.image ? (
                      <img
                        src={`http://localhost:8080${userData.image}`}
                        alt="Ảnh đại diện"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle size={64} className="text-gray-400" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
                  >
                    Tải ảnh mới
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                <hr className="my-6 border-gray-300" />

                <form onSubmit={handleSaveChanges} className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="fullname">Họ và tên:</Label>
                    <Input
                      id="fullname"
                      value={userData.fullname}
                      onChange={(e) =>
                        setUserData({ ...userData, fullname: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="job">Nghề nghiệp:</Label>
                    <Input
                      id="job"
                      value={userData.job}
                      onChange={(e) =>
                        setUserData({ ...userData, job: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="company">Tên tổ chức:</Label>
                    <Input
                      id="company"
                      value={userData.company}
                      onChange={(e) =>
                        setUserData({ ...userData, company: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="description">Giới thiệu:</Label>
                    <Textarea
                      id="description"
                      value={userData.description}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button type="submit" className="mt-4">
                    Lưu thay đổi
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
}
