import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, MessageCircle, Search } from 'lucide-react';
import { logout, getUserInfo, getCurrentUser } from '../services/authService';

export default function StaffLayout() {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const [staffName, setStaffName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaffInfo();
  }, []);

  const loadStaffInfo = async () => {
    try {
      // Lấy thông tin nhân viên từ API
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.fullName) {
        setStaffName(currentUser.fullName);
      }
    } catch (err) {
      console.warn("⚠️ Could not load staff name:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };

  // Sử dụng tên nhân viên nếu có, nếu không thì dùng email
  const displayName = staffName || userInfo?.email || 'Nhân viên';
  const displayEmail = userInfo?.email;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800">BookingTour</h1>
              <p className="text-xs text-gray-500">Quản lý Chat</p>
            </div>
          </div>
        </div>

        {/* USER INFO */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 font-semibold uppercase">Nhân viên</p>
          <p className="text-sm font-medium text-gray-800 mt-1 truncate" title={displayName}>
            {loading ? 'Đang tải...' : displayName}
          </p>
          {displayEmail && (
            <p className="text-xs text-gray-600 truncate" title={displayEmail}>
              {displayEmail}
            </p>
          )}
          <div className="flex items-center gap-1 mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <p className="text-xs text-green-700">Online</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-2">
          <Link
            to="/staff/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 hover:bg-red-100 hover:text-red-700 transition font-semibold"
          >
            <MessageCircle size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/staff/query"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 hover:bg-red-100 hover:text-red-700 transition font-semibold"
          >
            <Search size={20} />
            <span>Tra Cứu</span>
          </Link>
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
