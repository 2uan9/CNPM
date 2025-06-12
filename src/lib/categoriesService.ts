import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/categories";

// Function to get the token
const getToken = () => localStorage.getItem("token");

// Axios instance with Authorization header
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Methods
export const getAllCategories = async () => {
  const response = await axiosInstance.get("/get-categories");
  return response.data;
};

export const getCategoryById = async (id: number) => {
  const response = await axiosInstance.get(`/get-categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryData: any) => {
  const response = await axiosInstance.post("/create-Category", categoryData);
  return response.data;
};

export const updateCategory = async (id: number, updatedData: any) => {
  const response = await axiosInstance.put(
    `/update-Category/${id}`,
    updatedData
  );
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await axiosInstance.delete(`/delete/${id}`);
  return response.data;
};

// Removed admin role check and simplified the method
export const getPaginatedCategories = async (
  page: number = 0,
  size: number = 8,
  searchTerm: string = ""
) => {
  const response = await axiosInstance.get("/categories/admin", {
    params: { page, size, searchTerm },  // Thêm tham số tìm kiếm vào URL
  });
  return response.data;
};

export const getApprovedPostsByCategory = async (
  categoryId: number,
  page: number = 0,
  size: number = 8,
  filter: string = ""
) => {
  try {
    const response = await axiosInstance.get(
      `/categories-Posts/approved/${categoryId}`,
      {
        params: { page, size, filter },  // Truyền tham số filter
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    throw error;
  }
};
