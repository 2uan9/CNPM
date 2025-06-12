"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserActivity from "@/components/admin/user-activity";
import { FileUp, Users, Eye, Download } from "lucide-react";
import ApiService from "@/lib/postService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    approvedPosts: 0,
    totalUsers: 0,
    totalViews: 0,
    totalDownloads: 0,
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      alert("Bạn không có quyền truy cập trang này!");
      router.push("/"); // Chuyển hướng về trang chủ
    }
  }, [router]);

  // Gọi API để lấy thống kê tổng hợp
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await ApiService.getSummaryStats();
        setStats({
          approvedPosts: response.data.approvedPosts || 0,
          totalUsers: response.data.totalUsers || 0,
          totalViews: response.data.totalViews || 0,
          totalDownloads: response.data.totalDownloads || 0,
        });
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
      }
    };

    fetchStats();
  }, []);

  // Dữ liệu cho biểu đồ cột
  const chartData = {
    labels: [
      "Tổng số bài viết",
      "Người dùng hoạt động",
      "Tổng lượt xem",
      "Tổng lượt tải về",
    ], // Các tiêu đề trên biểu đồ
    datasets: [
      {
        label: "Số liệu thống kê",
        data: [
          stats.approvedPosts,
          stats.totalUsers,
          stats.totalViews,
          stats.totalDownloads,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Màu nền của cột
        borderColor: "rgba(75, 192, 192, 1)", // Màu đường viền cột
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Thống kê tổng quan",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const cardData = [
    {
      title: "Tổng số bài viết",
      value: stats.approvedPosts ? stats.approvedPosts.toLocaleString() : "0",
      percentage: "Tải lên và được duyệt",
      icon: <FileUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Người dùng hoạt động",
      value: stats.totalUsers ? stats.totalUsers.toLocaleString() : "0",
      percentage: "Người dùng ",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Tổng lượt xem",
      value: stats.totalViews ? stats.totalViews.toLocaleString() : "0",
      percentage: "Các bài viết đã được tải lên",
      icon: <Eye className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Tổng lượt tải về",
      value: stats.totalDownloads ? stats.totalDownloads.toLocaleString() : "0",
      percentage: "Của các bài viết được tải lên",
      icon: <Download className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Quản trị hệ thống</h1>

      {/* Các card dữ liệu */}
      <div className="grid gap-4 md:grid-cols-4">
        {" "}
        {/* Cập nhật số cột từ 3 thành 4 */}
        {cardData.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.percentage}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Biểu đồ thống kê tổng quan */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thống kê tổng quan</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Thêm class để căn chỉnh kích thước */}
            <div className="h-[300px]">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Phần Hoạt động gần đây */}
        <Card>
          <CardHeader>
            <CardTitle>Tải lên gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <UserActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
