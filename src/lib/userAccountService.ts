// userAccountService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/userAccount';

// Lấy token từ localStorage hoặc một nơi lưu trữ khác
const getToken = () => localStorage.getItem('token');

export const userAccountAPI = {
  async getAllAccounts() {
    const response = await axios.get(`${API_BASE_URL}/getAccount`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  async getAccountById(id: number) {
    const response = await axios.get(`${API_BASE_URL}/getAccountId/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  async createAccount(data: unknown) {
    const response = await axios.post(`${API_BASE_URL}/createAccount`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  async deleteAccount(id: number) {
    await axios.delete(`${API_BASE_URL}/deleteAccount/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  },

  async getAccountPosts(id: number) {
    const response = await axios.get(`${API_BASE_URL}/getAccount/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
};
