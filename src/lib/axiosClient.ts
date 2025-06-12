// src/services/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',  // Đảm bảo thay đổi với URL của API backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào các yêu cầu khi đã có token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý lỗi toàn cục từ response
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Lỗi từ server (response có lỗi, chẳng hạn 4xx, 5xx)
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Lỗi khi không có phản hồi từ server
      return Promise.reject({ message: 'Network error' });
    } else {
      // Lỗi trong quá trình cấu hình yêu cầu
      return Promise.reject({ message: error.message });
    }
  }
);

export default axiosClient;
