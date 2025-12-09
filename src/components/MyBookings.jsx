import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService"; // Import service của bạn
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Helper format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper màu trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "HELD":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Hàm load lại dữ liệu (để dùng sau khi hủy thành công)
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user || !user.customerId) {
        setError(
          "Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại."
        );
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/bookings/customer/${user.customerId}`
      );
      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      } else {
        setError(data.message || "Không thể tải danh sách đơn hàng.");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setError("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // --- XỬ LÝ HỦY TOUR (ĐÃ CẬP NHẬT) ---
  const handleCancelBooking = async (bookingId, invoiceId) => {
    if (!invoiceId) {
      alert("Lỗi: Đơn hàng này chưa có hóa đơn để xử lý hủy!");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn hủy đơn hàng mã: ${bookingId.substring(
          0,
          8
        )}... không?\nLưu ý: Phí hủy sẽ được áp dụng tùy theo thời điểm.`
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/bookings/invoice/${invoiceId}/refund`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json(); // Backend trả về BookingResponseDTO

        if (response.ok) {
          alert(
            "✅ Hủy tour thành công! Trạng thái đơn hàng đã được cập nhật."
          );
          fetchBookings(); // Tải lại danh sách để cập nhật trạng thái mới
        } else {
          // Xử lý lỗi từ backend trả về (ví dụ: Không thể hủy vì đã quá hạn)
          alert(
            "❌ Hủy thất bại: " +
              (data.message || "Lỗi không xác định từ server")
          );
        }
      } catch (err) {
        console.error("Lỗi mạng:", err);
        alert("❌ Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.");
      }
    }
  };
  // --- XỬ LÝ XEM CHI TIẾT ---
  const handleViewDetails = (bookingId) => {
    // Chuyển hướng sang trang chi tiết (Bạn cần tạo route này trong App.js)
    // Ví dụ: /my-bookings/dca7875a-e6db...
    navigate(`/my-bookings/${bookingId}`);
  };
  if (loading)
    return <div className="min-h-screen pt-24 text-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
          Tour Đã Đặt Của Tôi
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 && !error ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Bạn chưa đặt tour nào.</p>
            <button
              onClick={() => navigate("/tours")}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
            >
              Khám phá Tour ngay
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Mã đơn:{" "}
                        <span className="font-mono font-medium text-gray-700">
                          {booking.bookingId}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-blue-900">
                        {booking.departure?.tour?.name ||
                          "Tên Tour đang cập nhật"}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600 border-t border-b border-gray-100 py-4 my-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">
                        Ngày khởi hành
                      </p>
                      <p className="font-semibold text-base text-gray-800">
                        {formatDate(booking.departure?.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">
                        Số lượng khách
                      </p>
                      <p className="font-semibold text-base text-gray-800">
                        {booking.passengers ? booking.passengers.length : 0}{" "}
                        người
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase mb-1">
                        Tổng tiền
                      </p>
                      <p className="font-bold text-lg text-red-600">
                        {formatCurrency(booking.totalPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    

                    {/* Nút Hủy chỉ hiện khi trạng thái cho phép */}
                    {(booking.status === "HELD" ||
                      booking.status === "CONFIRMED") && (
                      <button
                        onClick={() =>
                          handleCancelBooking(
                            booking.bookingId,
                            booking.invoiceId
                          )
                        }
                        className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded hover:bg-red-50 text-sm font-medium transition-colors"
                      >
                        Hủy Tour
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(booking.bookingId)}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 text-sm font-medium transition-colors"
                    >
                      Xem Chi Tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
