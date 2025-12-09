import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Search,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookingsAdmin = () => {
  // --- STATE ---
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // --- HELPER FUNCTIONS ---
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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

  const getStatusClass = (status) => {
    const s = status ? status.toUpperCase() : "";
    switch (s) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "DEPOSITED":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "HELD":
      case "PENDING":
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "REFUNDED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "COMPLETED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // --- API CALLS ---
  const fetchBookings = async (pageNumber) => {
    setLoading(true);
    try {
      // Gọi API phân trang backend
      const response = await fetch(
        `http://localhost:8080/api/bookings?page=${pageNumber}&size=10`
      );
      const data = await response.json();

      if (data.success) {
        setBookings(data.data.content);
        setTotalPages(data.data.totalPages);
        setError(null);
      } else {
        setError("Không thể tải dữ liệu: " + data.message);
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setError("Lỗi kết nối Server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi trang thay đổi
  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  // --- HANDLERS ---

  // Chuyển hướng sang trang chi tiết
  const handleViewDetails = (bookingId) => {
    navigate(`/my-bookings/${bookingId}`); // Hoặc route admin riêng nếu bạn có
  };

  // Xử lý xác nhận thanh toán (Demo tiền mặt)
  const handleConfirm = async (booking) => {
    const invoiceId = booking.invoiceId;
    const amount = booking.totalPrice;

    if (!invoiceId) {
      alert("Lỗi: Đơn hàng này không có Invoice ID!");
      return;
    }

    if (
      window.confirm(
        `Xác nhận thanh toán TIỀN MẶT cho đơn hàng này?\nSố tiền: ${formatCurrency(
          amount
        )}`
      )
    ) {
      try {
        const paymentBody = {
          amount: amount,
          method: "CASH",
          txnRef: "ADMIN_CONFIRM_" + new Date().getTime(),
          state: "SUCCESS",
        };

        const response = await fetch(
          `http://localhost:8080/api/bookings/${invoiceId}/pay`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentBody),
          }
        );

        if (response.ok) {
          alert("✅ Đã xác nhận thanh toán thành công!");
          fetchBookings(page);
        } else {
          const errData = await response.json();
          alert("❌ Lỗi: " + (errData.message || "Không thể xác nhận"));
        }
      } catch (err) {
        alert("Lỗi hệ thống: " + err.message);
      }
    }
  };

  // Xử lý hủy đơn
  const handleReject = async (booking) => {
    const invoiceId = booking.invoiceId;
    if (!invoiceId) {
      alert("Lỗi: Không tìm thấy Invoice ID để hủy!");
      return;
    }

    if (
      window.confirm(
        "Bạn có chắc chắn muốn HỦY đơn hàng này không?\nHành động này không thể hoàn tác."
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/bookings/invoice/${invoiceId}/cancel`,
          {
            method: "PUT",
          }
        );

        if (response.ok) {
          alert("✅ Đã hủy đơn hàng thành công!");
          fetchBookings(page);
        } else {
          const errData = await response.json();
          alert("❌ Lỗi khi hủy: " + (errData.message || "Lỗi không xác định"));
        }
      } catch (err) {
        alert("Lỗi server: " + err.message);
      }
    }
  };

  // --- CLIENT-SIDE FILTERING ---
  const filteredBookings = bookings.filter((booking) => {
    if (!searchTerm) return true;
    const lowerTerm = searchTerm.toLowerCase();

    const bookingId = booking.bookingId?.toLowerCase() || "";
    const customerName = booking.customer?.name?.toLowerCase() || "";
    const contactEmail = booking.contactEmail?.toLowerCase() || "";
    const tourName = booking.departure?.tour?.name?.toLowerCase() || "";

    return (
      bookingId.includes(lowerTerm) ||
      customerName.includes(lowerTerm) ||
      contactEmail.includes(lowerTerm) ||
      tourName.includes(lowerTerm)
    );
  });

  // --- RENDER ---
  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in min-h-[500px]">
      {/* Header & Tools */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Quản Lý Booking
          <button
            onClick={() => fetchBookings(page)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={20} />
          </button>
        </h2>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm theo Mã, Tên, Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">
          <Loader className="animate-spin inline-block text-blue-500 w-8 h-8" />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Mã Booking
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Khách Hàng
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tour / Ngày đi
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tổng Tiền
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Trạng Thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.bookingId}
                      className="bg-white border-b hover:bg-gray-50 transition-colors"
                    >
                      <td
                        className="px-6 py-4 font-mono font-medium text-gray-900"
                        title={booking.bookingId}
                      >
                        {booking.bookingId.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {booking.customer ? (
                            booking.customer.name
                          ) : (
                            <span className="text-gray-500 italic">
                              Khách vãng lai
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.contactEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="font-medium text-blue-600 line-clamp-1"
                          title={booking.departure?.tour?.name}
                        >
                          {booking.departure?.tour?.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(booking.departure?.startDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-700">
                        {formatCurrency(booking.totalPrice)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          {/* Nút Xem Chi Tiết */}
                          <button
                            onClick={() => handleViewDetails(booking.bookingId)}
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={20} />
                          </button>

                          {/* Nút Xác Nhận (Chỉ hiện khi HELD) */}
                          {booking.status === "HELD" && (
                            <button
                              onClick={() => handleConfirm(booking)}
                              className="text-green-600 hover:text-green-800 transition-colors"
                              title="Xác nhận thanh toán"
                            >
                              <CheckCircle size={20} />
                            </button>
                          )}

                          {/* Nút Hủy */}
                          {booking.status !== "CANCELLED" &&
                            booking.status !== "COMPLETED" &&
                            booking.status !== "REFUNDED" && (
                              <button
                                onClick={() => handleReject(booking)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Hủy đơn"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-400 italic"
                    >
                      Không tìm thấy đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 select-none">
            <span className="text-sm text-gray-500">
              Trang {page + 1} / {totalPages > 0 ? totalPages : 1}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="mr-1" /> Trước
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="flex items-center px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsAdmin;
