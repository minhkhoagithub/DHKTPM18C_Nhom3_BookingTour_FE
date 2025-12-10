import React, { useState } from "react";
import {
  Search,
  Loader,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import contactImg from "../assets/ContactImg.jpg";

export default function TrackingPage() {
  const [bookingId, setBookingId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook chuyển trang

  // --- GỌI API TRA CỨU ---
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/search?bookingId=${bookingId.trim()}&email=${email.trim()}`
      );
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(
          data.message ||
            "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin."
        );
      }
    } catch (err) {
      setError("Lỗi kết nối Server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ CHUYỂN TRANG CHI TIẾT ---
  const handleViewDetails = () => {
    if (result && result.bookingId) {
      // Chuyển sang trang detail, truyền ID qua URL
      navigate(`/my-bookings/${result.bookingId}`);
    }
  };

  // Helper format
  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* --- LEFT: IMAGE SECTION --- */}
      <div className="lg:w-1/2 relative hidden lg:block">
        <img
          src={contactImg}
          alt="Travel Tracking"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold mb-6">Tra cứu chuyến đi của bạn</h1>
          <p className="text-lg opacity-90">
            Nhập mã đơn hàng và email để xem chi tiết lịch trình, trạng thái vé
            và hướng dẫn khởi hành.
          </p>
        </div>
      </div>

      {/* --- RIGHT: FORM & RESULT SECTION --- */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center px-6 py-12 lg:px-16 bg-white overflow-y-auto">
        {/* 1. FORM NHẬP LIỆU */}
        <div className="mb-10">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Kiểm Tra Đơn Hàng
            </h2>
            <p className="text-gray-500">
              Vui lòng nhập chính xác thông tin đã đăng ký.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã Đơn Hàng
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ví dụ: a1b2c3d4-..."
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Liên Hệ
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? <Loader className="animate-spin" /> : "Tra Cứu Ngay"}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700 animate-fade-in">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* 2. KẾT QUẢ TRA CỨU (CARD) */}
        {result && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            {/* Header Ticket */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-1">
                    CHUYẾN ĐI CỦA BẠN
                  </p>
                  <h3 className="text-xl font-bold line-clamp-2">
                    {result.departure?.tour?.name}
                  </h3>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/30">
                  {result.status}
                </span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Body Ticket */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Khởi hành</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(result.departure?.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="p-2 bg-red-50 rounded-lg text-red-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Địa điểm</p>
                  <p className="font-semibold text-gray-800">
                    {result.departure?.tour?.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">
                    Hành khách
                  </p>
                  <p className="font-bold text-lg">
                    {result.passengers?.length || 0}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      người
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">
                    Tổng tiền
                  </p>
                  <p className="font-bold text-lg text-green-600">
                    {formatCurrency(result.totalPrice)}
                  </p>
                </div>
              </div>

              {/* Payment Alert */}
              {result.status === "HELD" && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3 items-start text-sm text-yellow-800">
                  <Clock size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Đang giữ chỗ!</p>
                    <p>
                      Vui lòng thanh toán trước:{" "}
                      <b>
                        {new Date(result.holdUntil).toLocaleString("vi-VN")}
                      </b>{" "}
                      để hoàn tất.
                    </p>
                  </div>
                </div>
              )}

              {/* --- NÚT LINK QUA DETAIL & THANH TOÁN (MỚI) --- */}
              <button
                onClick={handleViewDetails}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>Xem Chi Tiết & Thanh Toán</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
