import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login, setUserInfo } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';

export default function StaffLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Gọi login API
      const token = await login(email, password);
      console.log("✓ Login token nhận được");

      // Decode JWT token để kiểm tra role
      const decodedToken = jwtDecode(token);
      console.log("📋 Token decoded:", decodedToken);

      const userInfo = {
        email: decodedToken.sub,
        role: decodedToken.role,
        customerId: decodedToken.customerId
      };

      // KIỂM TRA ROLE - CHỈ CHO PHÉP STAFF
      if (userInfo.role !== 'STAFF') {
        // Xóa token và userInfo nếu không phải staff
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        
        setError("Sai email hoặc mật khẩu");
        console.warn("❌ Đăng nhập thất bại: Không phải tài khoản staff (Role:", userInfo.role, ")");
        setLoading(false);
        return;
      }

      // Lưu user info
      setUserInfo(userInfo);
      console.log("✓ User info đã lưu (STAFF):", userInfo);

      // Chuyển hướng sang staff dashboard
      navigate("/staff/dashboard");
    } catch (err) {
      setError("Sai email hoặc mật khẩu");
      console.error("❌ Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 w-full max-w-4xl">

        {/* LEFT SIDE - FORM */}
        <div className="flex flex-col justify-center p-8 md:p-14 md:w-1/2">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Staff Login</h1>
            <p className="text-gray-500 font-light">Đăng nhập quản lý chat hỗ trợ khách hàng</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 font-medium text-sm">{error}</p>
              </div>
            )}

            {/* EMAIL INPUT */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  value={email}
                  placeholder="nhân viên@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* BACK LINK */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <Link to="/" className="text-red-600 font-semibold hover:underline">
              ← Quay lại trang chính
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE - INFO */}
        <div className="hidden md:flex flex-col justify-center items-center p-8 md:p-14 md:w-1/2 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-r-2xl">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Bảng điều khiển nhân viên</h2>
            <p className="text-red-100 text-lg leading-relaxed">
              Quản lý và hỗ trợ khách hàng thông qua hệ thống chat trực tuyến
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-left bg-red-500 bg-opacity-50 p-4 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-red-600">✓</div>
                <p>Quản lý tất cả phiên hỗ trợ khách hàng</p>
              </div>
              <div className="flex items-center gap-3 text-left bg-red-500 bg-opacity-50 p-4 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-red-600">✓</div>
                <p>Chat trực tiếp và hỗ trợ thời gian thực</p>
              </div>
              <div className="flex items-center gap-3 text-left bg-red-500 bg-opacity-50 p-4 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-red-600">✓</div>
                <p>Theo dõi và quản lý yêu cầu hỗ trợ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
