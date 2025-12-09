import React, { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // FORM EDIT INFO
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // FORM CHANGE PASSWORD
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const handleUpdateInfo = async (e) => {
    e.preventDefault();

    // TODO: Gọi API cập nhật user
    console.log("📌 Updating info:", form);
    alert("Cập nhật thông tin thành công");

    setUser({ ...user, ...form });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    // TODO: Gọi API đổi mật khẩu
    console.log("📌 Change password:", passwordForm);
    alert("Đổi mật khẩu thành công");

    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (loading)
    return <div className="min-h-screen pt-24 text-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 border">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
          Cài Đặt Tài Khoản
        </h1>

        {/* ======================= THÔNG TIN HIỆN TẠI ======================= */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Thông Tin Tài Khoản</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-lg">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Loại tài khoản:</strong> {user.userType}
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

        {/* ======================= CẬP NHẬT THÔNG TIN ======================= */}
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

        {/* ======================= ĐỔI MẬT KHẨU ======================= */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Đổi Mật Khẩu</h2>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Mật khẩu cũ</label>
              <input
                type="password"
                className="w-full p-3 border rounded"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Mật khẩu mới</label>
              <input
                type="password"
                className="w-full p-3 border rounded"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                className="w-full p-3 border rounded"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Đổi mật khẩu
            </button>
          </form>
        </section>

        {/* ======================= LOGOUT ======================= */}
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
