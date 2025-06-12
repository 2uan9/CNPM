// src/services/authService.ts
import axiosClient from "./axiosClient";

const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  UPDATE_USER: "/auth/user/updateUser",
  GET_USER_INFO: "/auth/user/getUser-info",
  GET_USER_POSTS: "/auth/posts/my-posts",  
  UPLOAD_AVATAR: "/auth/upload-avatar"
};

export const authService = {
  // Đăng nhập
  login: async (credentials: { email: string; password: string }) => {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email và mật khẩu không được để trống.");
    }
    const response = await axiosClient.post(ENDPOINTS.LOGIN, credentials);
    return response.data; // Trả lại dữ liệu sau khi đăng nhập
  },

  // Đăng ký
  register: async (userData: { email: string; password: string; confirmPassword: string }) => {
    if (!userData.email || !userData.password || !userData.confirmPassword) {
      throw new Error("Vui lòng điền đầy đủ thông tin.");
    }
    if (userData.password !== userData.confirmPassword) {
      throw new Error("Mật khẩu và mật khẩu xác nhận không khớp.");
    }
    const response = await axiosClient.post(ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  // Cập nhật thông tin người dùng
  updateUser: async (userData: { fullname: string; job: string; company: string; description: string; }) => {
    if (!userData.fullname || !userData.job || !userData.company || !userData.description) {
      throw new Error("Thông tin người dùng không được để trống.");
    }
    const response = await axiosClient.put(ENDPOINTS.UPDATE_USER, userData);
    return response.data;
  },

  // Lấy thông tin người dùng
  getUserDetails: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại");
    }

    const response = await axiosClient.get(ENDPOINTS.GET_USER_INFO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  
  // Tải ảnh đại diện lên server
  uploadAvatar: async (formData: FormData) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token không có sẵn, vui lòng đăng nhập.");
    }

    const response = await axiosClient.post(ENDPOINTS.UPLOAD_AVATAR, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    });

    return response.data.avatarUrl; // Trả về URL ảnh đại diện sau khi tải lên
  },
};
