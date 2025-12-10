import React, { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../services/authService";
import { updateUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const data = await getCurrentUser();

      if (!data) {
        navigate("/login");
        return;
      }

      setUser(data);
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
      });

      setLoading(false);
    };

    loadUser();
  }, []);

  // ------------------ UPDATE INFO ------------------
  const handleUpdateInfo = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        email: user.email, // không cho sửa email
        phone: form.phone,
        address: form.address,
        loyaltyTier: user.loyaltyTier, // giữ nguyên tier
      };

      const updated = await updateUser(user.customerId, payload);

      setUser((prev) => ({
        ...prev,
        name: updated.name,
        phone: updated.phone,
        address: updated.address,
      }));

      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Cập nhật thất bại! Vui lòng thử lại.");
    }
  };

  if (loading)
    return <div className="min-h-screen pt-24 text-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 border">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
          Cài Đặt Tài Khoản
        </h1>

        {/* ================= THÔNG TIN TÀI KHOẢN ================= */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Thông Tin Tài Khoản</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-lg">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {/* <p>
              <strong>Loại tài khoản:</strong> {user.userType}
            </p> */}
            <p>
              <strong>Hạng thành viên:</strong> {user.loyaltyTier || "GUEST"}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(user.createdAt).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Cập nhật lần cuối:</strong>{" "}
              {new Date(user.updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </section>

        {/* ================= CẬP NHẬT THÔNG TIN ================= */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Chỉnh Sửa Thông Tin</h2>

          <form onSubmit={handleUpdateInfo} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Họ và tên</label>
              <input
                type="text"
                className="w-full p-3 border rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Số điện thoại</label>
              <input
                type="text"
                className="w-full p-3 border rounded"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Địa chỉ</label>
              <input
                type="text"
                className="w-full p-3 border rounded"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              Lưu thay đổi
            </button>
          </form>
        </section>

        {/* ================= LOGOUT ================= */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
