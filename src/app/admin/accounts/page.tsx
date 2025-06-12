"use client";

import { useEffect, useState } from "react";
import { userAccountAPI } from "@/lib/userAccountService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AccountInfo {
  fullName: string;
  avatarURL?: string;
  personalDescription?: string;
  job?: string;
  company?: string;
}

interface Account {
  id: number;
  email: string;
  status: string;
  roleId: {
    roleName: string;
  };
  infoId?: AccountInfo;
}

interface Post {
  title: string;
  content: string;
}

export default function AccountsManagement() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accountPosts, setAccountPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<number | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accounts = await userAccountAPI.getAllAccounts();
        setAccounts(accounts);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu tài khoản.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter((account) =>
    account.infoId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDeleteModal = (id: number) => {
    setAccountToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setAccountToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (accountToDelete !== null) {
      try {
        await userAccountAPI.deleteAccount(accountToDelete);
        setAccounts(
          accounts.filter((account) => account.id !== accountToDelete)
        );
        closeDeleteModal();
        alert("Tài khoản đã được xóa thành công!");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert("Không thể xóa tài khoản!");
      }
    }
  };

  const closePostModal = () => {
    setSelectedAccount(null);
    setAccountPosts([]);
    setIsPostModalOpen(false);
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-6 p-6 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-blue-500">Quản lý tài khoản</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-96">
          <Input
            placeholder="Tìm kiếm tài khoản..."
            className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-lg overflow-x-auto bg-blue-50">
        <Table>
          <TableHeader className="bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 text-white">
            <TableRow>
              <TableHead className="text-left font-bold text-lg shadow-md text-gray-200">
                ID
              </TableHead>
              <TableHead className="text-center font-bold text-lg shadow-md text-gray-200">
                Ảnh đại diện
              </TableHead>
              <TableHead className="text-left font-bold text-lg shadow-md text-gray-200">
                Tên người dùng
              </TableHead>
              <TableHead className="text-left font-bold text-lg shadow-md text-gray-200">
                Email
              </TableHead>
              <TableHead className="text-left font-bold text-lg shadow-md text-gray-200">
                Vai trò
              </TableHead>
              <TableHead className="text-center font-bold text-lg shadow-md text-gray-200">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow
                key={account.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <TableCell>{account.id}</TableCell>
                <TableCell className="flex justify-center items-center">
                  <img
                    src={
                      `http://localhost:8080${account.infoId?.avatarURL}` ||
                      "/default-avatar.png"
                    }
                    alt={account.infoId?.fullName || "Avatar"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>

                <TableCell>{account.infoId?.fullName || "N/A"}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.roleId?.roleName || "N/A"}</TableCell>

                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      onClick={() => openDeleteModal(account.id)}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Xóa
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setSelectedAccount(account)}
                        >
                          Chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-medium">
                            Chi tiết tài khoản
                          </DialogTitle>
                        </DialogHeader>
                        {selectedAccount && (
                          <div className="space-y-4 text-gray-700">
                            <div>
                              <p className="font-medium">ID</p>
                              <p>{selectedAccount.id}</p>
                            </div>
                            <div>
                              <p className="font-medium">Tên người dùng</p>
                              <p>{selectedAccount.infoId?.fullName}</p>
                            </div>
                            <div>
                              <p className="font-medium">Email</p>
                              <p>{selectedAccount.email}</p>
                            </div>
                            <div>
                              <p className="font-medium">Vai trò</p>
                              <p>{selectedAccount.roleId?.roleName}</p>
                            </div>
                            <div>
                              <p className="font-medium">Ảnh đại diện</p>
                              <img
                                src={
                                  `http://localhost:8080${selectedAccount.infoId?.avatarURL}` ||
                                  "/default-avatar.png"
                                }
                                alt={
                                  selectedAccount.infoId?.fullName || "Avatar"
                                }
                                className="w-24 h-24 rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">Mô tả cá nhân</p>
                              <p>
                                {selectedAccount.infoId?.personalDescription ||
                                  "Chưa có mô tả"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Công việc</p>
                              <p>
                                {selectedAccount.infoId?.job ||
                                  "Chưa có thông tin"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Công ty</p>
                              <p>
                                {selectedAccount.infoId?.company ||
                                  "Chưa có thông tin"}
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal xóa tài khoản */}
      {isDeleteModalOpen && (
        <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
            </DialogHeader>
            <div className="mt-4 flex justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={closeDeleteModal}
                className="bg-gray-500 text-white hover:bg-gray-600"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Xóa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal bài viết */}
      {isPostModalOpen && selectedAccount && (
        <Dialog open={isPostModalOpen} onOpenChange={closePostModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Bài viết của {selectedAccount?.infoId?.fullName}
              </DialogTitle>
            </DialogHeader>
            <div>
              {accountPosts.length > 0 ? (
                accountPosts.map((post, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {post.title}
                    </h3>
                    <p className="text-gray-600">{post.content}</p>
                  </div>
                ))
              ) : (
                <p>Không có bài viết nào.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
