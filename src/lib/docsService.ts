import axios from "axios";

// Địa chỉ cơ sở của API
const API_BASE_URL = "http://localhost:8080/api/docs";

// Hàm để lấy token từ Local Storage hoặc Context
const getAuthToken = () => {
  return localStorage.getItem("token");
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

// Tạo instance axios cho API upload mà không cần token
// Không cần chỉ định "Content-Type" vì FormData sẽ tự động thiết lập thành "multipart/form-data"
const axiosInstanceWithoutToken = axios.create({
  baseURL: API_BASE_URL,
  headers: {},
});

// API Service: Lấy tài liệu theo ID
const getDocumentById = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.get(`/docs-id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tài liệu theo ID:", error);
    throw error;
  }
};

// API Service: Lấy tất cả tài liệu
const getAllDocuments = async () => {
  try {
    const response = await axiosInstanceWithToken.get("/get-Docs");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tất cả tài liệu:", error);
    throw error;
  }
};

// API Service: Tải lên tài liệu (không cần token)
const uploadDocument = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstanceWithoutToken.post<any>("/upload", formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Lỗi upload:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Lỗi khi tải lên tài liệu.");
    } else {
      console.error("Lỗi không xác định:", error);
      throw new Error("Lỗi không xác định khi tải lên tài liệu.");
    }
  }
};

// API Service: Xóa tài liệu
export const deleteDocument = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.delete(`/delete-file/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa tài liệu:", error);
    throw new Error("Không thể xóa tài liệu.");
  }
};

// API Service: Tải xuống tài liệu theo ID
export const downloadDocumentById = async (id: number): Promise<string | null> => {
  try {
    // Gửi yêu cầu tới API
    const response = await axiosInstanceWithToken.get(`/download/${id}`);
    const responseText = response.data; // Chuỗi trả về từ backend
    console.log(responseText); // Kiểm tra chuỗi trả về từ API

    // Tách URL tải về từ chuỗi
    const downloadLinkMatch = responseText.match(/https:\/\/drive\.google\.com\/uc\?id=[^&]+&export=download/);

    if (downloadLinkMatch) {
      const downloadLink = downloadLinkMatch[0];  // Lấy URL từ kết quả tìm kiếm

      // Tạo một thẻ <a> tạm thời và bắt đầu tải file
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = `document-${id}`;  // Đặt tên mặc định cho file tải về
      document.body.appendChild(a);
      a.click();  // Bắt đầu tải
      document.body.removeChild(a);  // Xóa thẻ <a> tạm thời

      return downloadLink; // Trả về đường link tải xuống sau khi tải thành công
    } else {
      throw new Error("Không tìm thấy link tải tài liệu.");
    }
  } catch (error) {
    console.error("Lỗi khi tải tài liệu:", error);
    throw new Error("Lỗi khi tải tài liệu.");
  }
};


export default {
  getDocumentById,
  getAllDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocumentById, 
};
