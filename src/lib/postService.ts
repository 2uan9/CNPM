import axios from "axios";

// Tạo một instance axios để quản lý các API yêu cầu token
const apiClientWithToken = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Middleware để thêm token vào header nếu cần (dùng cho các API yêu cầu token)
apiClientWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hàm xử lý lỗi toàn cục từ axios
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = (error: any) => {
  const message =
    error.response?.data?.message ||
    error.response?.statusText ||
    "Có lỗi xảy ra, vui lòng thử lại!";
  return Promise.reject(new Error(message));
};

// Định nghĩa kiểu dữ liệu cho PostData và Tag
interface Tag {
  name: string;
}

interface PostData {
  documentName: string;
  documentDescription: string;
  documentImage: string | null;
  originalDocument: { id: number };
  category: { id: number };
  tags: Tag[];
}


// Thư viện API
const ApiService = {
  // --------- Quản lý bài viết ---------
  // Lấy tất cả bài viết
getPosts: (page: number, size: number, status: string, searchQuery: string = '') =>
  apiClientWithToken
    .get("/post/getPost", { 
      params: { 
        page, 
        size, 
        status: status !== "ALL" ? status : undefined, 
        search: searchQuery 
      } 
    })
    .catch(handleError),


  // Lấy chi tiết bài viết theo ID
  getPostById: (id: number) =>
    apiClientWithToken.get(`/post/Post-id/${id}`).catch(handleError),

  // Duyệt bài viết
  approvePost: (id: number) =>
    apiClientWithToken.post(`/post/${id}/approve`).catch(handleError),

  // Từ chối bài viết
  rejectPost: (id: number) =>
    apiClientWithToken.post(`/post/${id}/reject`).catch(handleError),

  // Cập nhật bài viết
  updatePost: (id: number, data: unknown) =>
    apiClientWithToken.put(`/post/updatePost/${id}`, data).catch(handleError),

  // Xóa bài viết
  deletePost: (id: number) =>
    apiClientWithToken.delete(`/post/${id}`).catch(handleError),

  // Lấy tài liệu cho hồ sơ người dùng
  getDocumentsForUserProfile: () =>
    apiClientWithToken.get("/post/documents-Profile").catch(handleError),

  // --------- Tạo bài viết mới ---------
  // Tạo bài viết mới
  createPost: (postData: PostData) =>
    apiClientWithToken.post("/post/create-Post", postData).catch(handleError),


  // Hiển thị các các tài liệu đã được duyệt 
  searchApprovedDocuments: (page: number, size: number) =>
    apiClientWithToken
      .get(`/post/search/approved`, { params: { page, size} })
      .catch(handleError),
      
  //Tìm kiếm bài viết theo tên\
  searchPostsByName: (
    query: string,
    page: number = 0,
    size: number = 9,
    sortBy: string = ""
  ) =>
    apiClientWithToken
      .get("/post/search/document-name", {
        params: {
          query,
          page,
          size,
          sortBy: sortBy || undefined,  
        },
      })
      .catch(handleError),

  // Tăng lượt xem cho bài viết
  incrementViewCount: (id: number) =>
    apiClientWithToken
      .post(`/post/increment-view/${id}`)  
      .catch(handleError),
  getSummaryStats: () =>
    apiClientWithToken
      .get("/post/stats")
      .catch(handleError),
};

export default ApiService;
