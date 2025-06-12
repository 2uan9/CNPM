import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/tag";

const getToken = () => localStorage.getItem('token');

const tagApi = {
  getAllTags: async (page: number = 0, size: number = 8,searchTerm: string) => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/all/getTag`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,  
        size, 
        searchTerm,
      },
    });
    return response.data;
  },

  getTagById: async (id: number) => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/getTag/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Cập nhật phương thức tạo thẻ
  createTag: async (data: { tagName: string; tagDescription: string }) => {
    const token = getToken();
    const response = await axios.post(`${API_BASE_URL}/createTag`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Cập nhật phương thức sửa thẻ
  updateTag: async (id: number, data: { tagName: string; tagDescription: string }) => {
    const token = getToken();
    const response = await axios.put(`${API_BASE_URL}/updateTag/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteTag: async (id: number) => {
    const token = getToken();
    const response = await axios.delete(`${API_BASE_URL}/deleteTag/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  searchPosts: async (query: string, page: number = 0, size: number = 3) => {
    const response = await axios.get(`http://localhost:8080/api/posts/tags`, {
      params: {
        query,  // Từ khóa tìm kiếm
        page,   // Số trang
        size,   // Số bài viết trên mỗi trang
      },
    });
    return response.data;
  },
};



export default tagApi;
