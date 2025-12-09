import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, User, Users, ArrowLeft, XCircle, CheckCircle, CreditCard } from 'lucide-react';

const BookingDetail = () => {
    const { id } = useParams(); // Lấy bookingId từ URL
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper: Format tiền
    const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    
    // Helper: Format ngày giờ
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString('vi-VN', {
            weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Helper: Màu trạng thái
    const getStatusStyle = (status) => {
        switch (status) {
            case 'HELD': return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Đang giữ chỗ' };
            case 'CONFIRMED': return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã xác nhận' };
            case 'PAID': return { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã thanh toán' };
            case 'CANCELLED': return { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã hủy' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
        }
    };

    // Gọi API chi tiết
    const fetchBookingDetail = async () => {
        setLoading(true);
        try {
            // Lấy token nếu cần (dành cho bảo mật)
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`http://localhost:8080/api/bookings/${id}`, { headers });
            
            // Xử lý lỗi 404 hoặc 403
            if (!response.ok) {
                throw new Error(response.status === 404 ? "Không tìm thấy đơn hàng" : "Lỗi tải dữ liệu");
            }

            const data = await response.json();
            if (data.success) {
                console.log("Fetched booking data:", data.data);
                setBooking(data.data);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingDetail();
    }, [id]);

    // Xử lý Hủy Tour (Tái sử dụng logic cũ)
    const handleCancel = async () => {
        if(!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/bookings/invoice/${booking.invoiceId}/cancel`, {
                method: 'PUT'
            });
            const data = await res.json();
            if (res.ok) {
                alert("✅ Hủy thành công!");
                fetchBookingDetail(); // Reload lại dữ liệu mới nhất
            } else {
                alert("❌ Lỗi: " + data.message);
            }
        } catch (err) {
            alert("Lỗi kết nối: " + err.message);
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center">Đang tải chi tiết...</div>;
    if (error) return (
        <div className="min-h-screen pt-24 text-center">
            <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Quay lại</button>
        </div>
    );

    if (!booking) return null;

    const statusStyle = getStatusStyle(booking.status);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header & Nút Back */}
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-1"/> Quay lại danh sách
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    {/* Phần 1: Thông tin Trạng thái & Giá */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-gray-800">Đơn hàng #{booking.bookingId}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusStyle.bg} ${statusStyle.text}`}>
                                    {statusStyle.label}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">Ngày đặt: {formatDate(booking.bookingDate)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Tổng thanh toán</p>
                            <p className="text-3xl font-bold text-red-600">{formatCurrency(booking.totalPrice)}</p>
                        </div>
                    </div>

                    <div className="p-6 grid gap-8">
                        {/* Phần 2: Thông tin Tour */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin className="text-blue-600" size={20}/> Thông tin Chuyến đi
                            </h3>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="text-xl font-bold text-blue-900 mb-2">{booking.departure?.tour?.name}</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400"/>
                                        <span><b>Khởi hành:</b> {formatDate(booking.departure?.startDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400"/>
                                        <span><b>Kết thúc:</b> {formatDate(booking.departure?.endDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400"/>
                                        <span><b>Địa điểm:</b> {booking.departure?.tour?.location}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Phần 3: Thông tin Liên hệ */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <User className="text-blue-600" size={20}/> Thông tin Liên hệ
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 bg-white border border-gray-200 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Họ tên người đặt</p>
                                    <p className="font-medium">{booking.customer ? booking.customer.name : booking.contactEmail}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Email</p>
                                    <p className="font-medium">{booking.contactEmail}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Số điện thoại</p>
                                    <p className="font-medium">{booking.contactPhone}</p>
                                </div>
                            </div>
                        </section>

                        {/* Phần 4: Danh sách Hành khách */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Users className="text-blue-600" size={20}/> Danh sách Hành khách ({booking.passengers?.length || 0})
                            </h3>
                            <div className="overflow-hidden border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại vé</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng đơn</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {booking.passengers?.map((p) => (
                                            <tr key={p.passengerId}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.fullName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {p.type === 'ADL' ? 'Người lớn' : p.type === 'CHD' ? 'Trẻ em' : 'Em bé'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {p.roomSingle ? <CheckCircle size={16} className="text-green-500"/> : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                            {(booking.status === 'HELD' || booking.status === 'CONFIRMED') && (
                                <button 
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 font-semibold flex items-center gap-2"
                                >
                                    <XCircle size={18}/> Hủy Đơn Hàng
                                </button>
                            )}
                            
                            {booking.status === 'HELD' && (
                                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 shadow-lg shadow-blue-200">
                                    <CreditCard size={18}/> Thanh Toán Ngay
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;