"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
import { authService } from "@/lib/authService"; // Dịch vụ lấy thông tin người dùng

interface UserInfo {
  id: number;
  fullName: string;
  avatarURL: string;
  email: string;
  personalDescription: string;
  roleId: {
    id: number;
    roleName: string;
    roleDescription: string;
  };
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Thêm state loading
  const [error, setError] = useState<string | null>(null); // Thêm state error
  const searchParams = useSearchParams();
  const userId = searchParams.get("id"); // Lấy `id` từ query params

  useEffect(() => {
    if (userId) {
      const fetchUserInfo = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await authService.getUserDetails(userId); // Sử dụng `userId` thay vì `username`
          setUserInfo(data);
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          setError("Failed to load user data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchUserInfo();
    } else {
      setError("Invalid user ID");
      setLoading(false);
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <div className="p-6">
            <div className="text-center">
              <img
                src={userInfo?.avatarURL || "/placeholder.svg"}
                alt={userInfo?.fullName}
                className="mx-auto h-32 w-32 rounded-full"
              />
              <h1 className="text-2xl font-bold">{userInfo?.fullName}</h1>
              <p className="text-muted-foreground">{userInfo?.email}</p>
              <Button className="mt-4 w-full">Follow</Button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                {userInfo?.personalDescription || "No description provided"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {`Role: ${userInfo?.roleId.roleName}`}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>0 followers</span>
                </div>
                <span>0 following</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
