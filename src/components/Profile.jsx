import React, { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

/* ===================== HUY HIỆU HẠNG ===================== */
const getTierBadge = (tier) => {
  switch (tier) {
    case "BRONZE":
      return (
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700 border border-orange-300 flex items-center gap-1">
          Bronze
        </span>
      );
    case "SILVER":
      return (
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 border border-gray-300 flex items-center gap-1">
          Silver
        </span>
      );
    case "GOLD":
      return (
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-200 text-yellow-800 border border-yellow-400 flex items-center gap-1">
          Gold
        </span>
      );
    case "PLATINUM":
      return (
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-300 flex items-center gap-1">
          Platinum
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 border border-gray-300 flex items-center gap-1">
          Guest
        </span>
      );
  }
};
/* ========================================================= */

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const data = await getCurrentUser();
      console.log("📌 Dữ liệu getCurrentUser trả về:", data);
      setUser(data);
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading)
    return <div className="min-h-screen pt-24 text-center">Đang tải...</div>;

  if (!user)
    return (
      <div className="min-h-screen pt-24 text-center">
        <p>❌ Không thể tải thông tin tài khoản. Vui lòng đăng nhập lại.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-5 py-2 bg-blue-500 text-white rounded"
        >
          Đăng nhập
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
          Hồ Sơ Cá Nhân
        </h1>

        {/* THÔNG TIN USER */}
        <div className="space-y-4 text-gray-700 text-lg">
          <div className="flex justify-between">
            <span className="font-semibold">Họ và tên:</span>
            <span>{user.name || "Chưa có"}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Số điện thoại:</span>
            <span>{user.phone || "Chưa cập nhật"}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Địa chỉ:</span>
            <span>{user.address || "Chưa cập nhật"}</span>
          </div>

          {/* HUY HIỆU RANKING */}
          <div className="flex justify-between items-center">
            <span className="font-semibold">Hạng thành viên:</span>
            {getTierBadge(user.loyaltyTier)}
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Ngày tạo tài khoản:</span>
            <span>{new Date(user.createdAt).toLocaleString("vi-VN")}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Cập nhật lần cuối:</span>
            <span>{new Date(user.updatedAt).toLocaleString("vi-VN")}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Trạng thái:</span>
            <span className={user.deleted ? "text-red-600" : "text-green-600"}>
              {user.deleted ? "Đã bị khóa" : "Đang hoạt động"}
            </span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate("/my-bookings")}
            className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Xem Tour Đã Đặt
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
}
