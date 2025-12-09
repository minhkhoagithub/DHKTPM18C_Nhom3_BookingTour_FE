import React, { useEffect, useState } from 'react';
import { Edit, Trash2, PlusCircle, Search, Eye } from 'lucide-react';
import axiosClient from '../../api/axiosClient'; 

const BookingsAdmin = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axiosClient.get('/admin/bookings');
                
                if (response && response.data) {
                    setBookings(response.data);
                } else if (Array.isArray(response)) {
                    setBookings(response);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách booking:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const getStatusClass = (status) => {

        const s = status ? status.toUpperCase() : '';
        switch (s) {
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
            case 'DEPOSITED': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
            case 'PENDING': 
            case 'DRAFT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            case 'REFUNDED': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'COMPLETED': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const searchLower = searchTerm.toLowerCase();
        const customerName = booking.customer?.fullName?.toLowerCase() || '';
        const tourName = booking.departure?.tour?.name?.toLowerCase() || '';
        const status = booking.status?.toLowerCase() || '';
        const id = booking.bookingId?.toString().toLowerCase() || '';

        return customerName.includes(searchLower) || 
               tourName.includes(searchLower) || 
               status.includes(searchLower) ||
               id.includes(searchLower);
    });

    if (loading) return <div className="p-6 text-center">Đang tải dữ liệu...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản Lý Đặt Tour</h2>
            </div>
            
            <div className="mb-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên khách, tour, trạng thái hoặc ID..." 
                        className="pl-10 pr-4 py-2 w-full max-w-md border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Mã Booking</th>
                            <th scope="col" className="px-6 py-3">Khách Hàng</th>
                            <th scope="col" className="px-6 py-3">Tour</th>
                            <th scope="col" className="px-6 py-3">Ngày Đặt</th>
                            <th scope="col" className="px-6 py-3">Tổng Tiền</th>
                            <th scope="col" className="px-6 py-3 text-center">Trạng Thái</th>
                            <th scope="col" className="px-6 py-3 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <tr key={booking.bookingId} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[100px]" title={booking.bookingId}>
                                        {/* Hiển thị ID ngắn gọn, hover để xem full */}
                                        {booking.bookingId.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        {booking.customer ? booking.customer.fullName : <span className="text-red-400 italic">Unknown</span>}
                                        <div className="text-xs text-gray-400 font-normal">
                                            {booking.customer?.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Cần kiểm tra null safe vì booking có thể mất quan hệ */}
                                        {booking.departure?.tour?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(booking.bookingDate)}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">
                                        {formatCurrency(booking.totalPrice)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full border ${getStatusClass(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center gap-3">
                                            <button className="text-gray-500 hover:text-blue-600 transition-colors" title="Xem chi tiết">
                                                <Eye size={18} />
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-800 transition-colors" title="Chỉnh sửa">
                                                <Edit size={18} />
                                            </button>
                                            {/* Chỉ hiện nút xóa nếu cần thiết */}
                                            {/* <button className="text-red-600 hover:text-red-800 transition-colors" title="Xóa">
                                                <Trash2 size={18} />
                                            </button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-400 italic">
                                    Không tìm thấy booking nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination có thể thêm ở đây sau này */}
            <div className="mt-4 text-xs text-gray-400 text-right">
                Hiển thị {filteredBookings.length} đơn đặt tour
            </div>
        </div>
    );
};

export default BookingsAdmin;