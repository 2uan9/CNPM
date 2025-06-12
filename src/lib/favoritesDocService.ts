import axios from "axios";

// Địa chỉ cơ sở của API
const API_BASE_URL = "http://localhost:8080/api/favorites"; 

// Hàm để lấy token từ Local Storage hoặc Context
const getAuthToken = () => {
  return localStorage.getItem("token"); // Lấy token từ localStorage
};

// Tạo instance axios với token trong header cho các API khác (trừ upload)
const axiosInstanceWithToken = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào header của mỗi request
axiosInstanceWithToken.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Thêm token vào header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API Service: Lấy tài liệu yêu thích theo accountId
const getFavoritesByAccountId = async (
  accountId: number,
  page = 0,
  size = 8,
  searchQuery = "" 
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `/get-docFavorites/${accountId}`,
      {
        params: {
          page,
          size,
          searchQuery, 
        },
      }
    );
    return response.data; // Trả về dữ liệu phân trang từ API
  } catch (error) {
    console.error("Lỗi khi lấy tài liệu yêu thích:", error);
    throw error;
  }
};

// API Service: Thêm tài liệu vào yêu thích
const addFavoriteDocument = async (postId: number) => {
  try {
    const response = await axiosInstanceWithToken.post(`/add-favorites`, null, {
      params: {
        postId,
      },
    });
    return response.data; // Trả về tài liệu yêu thích vừa thêm
  } catch (error) {
    console.error("Lỗi khi thêm tài liệu yêu thích:", error);
    throw error;
  }
};

// API Service: Xóa tài liệu khỏi yêu thích
const deleteFavoriteDocument = async (favoriteId: number) => {
  try {
    await axiosInstanceWithToken.delete(`/delete-favorites/${favoriteId}`);
    console.log("Xóa tài liệu yêu thích thành công");
  } catch (error) {
    console.error("Lỗi khi xóa tài liệu yêu thích:", error);
    throw error;
  }
};

export default {
  getFavoritesByAccountId,
  addFavoriteDocument,
  deleteFavoriteDocument,
};
