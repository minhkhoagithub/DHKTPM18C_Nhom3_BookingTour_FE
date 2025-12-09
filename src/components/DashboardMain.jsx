import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Package, ShoppingCart, Calendar, Download } from 'lucide-react';
import axiosClient from '../api/axiosClient'; 

export default function DashboardMain() {
    const [summary, setSummary] = useState({
        totalRevenue: 0,
        totalBookings: 0,
        totalCustomers: 0,
        totalActiveTours: 0,
        newCustomersThisMonth: 0
    });

    const [revenueData, setRevenueData] = useState([]);
    
    const [recentBookings, setRecentBookings] = useState([]); 
    
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false); 

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const getMonthName = (monthIndex) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthIndex - 1] || `T${monthIndex}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentYear = new Date().getFullYear();

                const [summaryRes, revenueRes, recentRes] = await Promise.all([
                    axiosClient.get('/admin/statistics/dashboard-summary'),
                    axiosClient.get(`/admin/statistics/revenue-by-month?year=${currentYear}`),
                    axiosClient.get('/admin/statistics/recent-bookings') 
                ]);

                const unwrapSummary = (res) => {
                    if (res?.totalRevenue !== undefined) return res;
                    if (res?.data?.totalRevenue !== undefined) return res.data;
                    if (res?.data?.data?.totalRevenue !== undefined) return res.data.data;
                    return null;
                };
                const finalSummary = unwrapSummary(summaryRes);
                if (finalSummary) setSummary(finalSummary);

                let revenueList = [];
                if (Array.isArray(revenueRes)) revenueList = revenueRes;
                else if (Array.isArray(revenueRes?.data)) revenueList = revenueRes.data;
                else if (Array.isArray(revenueRes?.data?.data)) revenueList = revenueRes.data.data;

                if (revenueList.length > 0) {
                    const fullMonths = Array.from({ length: 12 }, (_, i) => i + 1);
                    const chartData = fullMonths.map(month => {
                        const found = revenueList.find(item => item.month === month);
                        return {
                            name: getMonthName(month),
                            revenue: found ? found.revenue : 0
                        };
                    });
                    setRevenueData(chartData);
                }

                let recentList = [];
                if (Array.isArray(recentRes)) recentList = recentRes;
                else if (Array.isArray(recentRes?.data)) recentList = recentRes.data;
                else if (Array.isArray(recentRes?.data?.data)) recentList = recentRes.data.data;
                
                if (recentList.length > 0) {
                    setRecentBookings(recentList);
                }

            } catch (error) {
                console.error("Lỗi tải dữ liệu Dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownloadReport = async () => {
        try {
            setDownloading(true);
            const response = await axiosClient.get('admin/statistics/reports/revenue-pdf', {
                responseType: 'blob' 
            });
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `bao_cao_doanh_thu_${new Date().getFullYear()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Lỗi tải báo cáo:", error);
            alert("Không thể tải báo cáo lúc này.");
        } finally {
            setDownloading(false);
        }
    };

    const statsCardsData = [
        { title: "Tổng Doanh Thu", value: formatCurrency(summary.totalRevenue), desc: "Năm nay", icon: <DollarSign className="h-6 w-6 text-green-600" />, bg: "bg-green-50" },
        { title: "Tổng Booking", value: summary.totalBookings, desc: "Đơn thành công", icon: <ShoppingCart className="h-6 w-6 text-blue-600" />, bg: "bg-blue-50" },
        { title: "Tour Đang Chạy", value: summary.totalActiveTours, desc: "Tour hoạt động", icon: <Package className="h-6 w-6 text-orange-600" />, bg: "bg-orange-50" },
        { title: "Khách Hàng Mới", value: `+${summary.newCustomersThisMonth}`, desc: "Trong tháng này", icon: <Users className="h-6 w-6 text-purple-600" />, bg: "bg-purple-50" },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            CONFIRMED: "bg-green-100 text-green-800", PAID: "bg-green-100 text-green-800",
            DEPOSITED: "bg-blue-100 text-blue-800", CANCELLED: "bg-red-100 text-red-800",
            REFUNDED: "bg-gray-100 text-gray-800", DRAFT: "bg-yellow-100 text-yellow-800"
        };
        return styles[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) return <div className="flex justify-center h-screen items-center">Loading...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Cards Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                {statsCardsData.map((card, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-4"> 
                                <p className="text-sm font-medium text-gray-500 truncate" title={card.title}>
                                    {card.title}
                                </p>
                                <h3 className="text-2xl font-bold mt-2 text-gray-800 truncate" title={card.value}>
                                    {card.value}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-lg ${card.bg} shrink-0`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1 shrink-0" />
                            <span className="truncate">{card.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Recent Bookings Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Biểu Đồ Doanh Thu ({new Date().getFullYear()})</h3>
                        <button 
                            onClick={handleDownloadReport}
                            disabled={downloading}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-blue-300"
                        >
                            {downloading ? (<span>Đang tạo...</span>) : (<><Download size={16} /><span>Xuất Báo Cáo</span></>)}
                        </button>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10}/>
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact" }).format(value)}/>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} formatter={(value) => [formatCurrency(value), "Doanh thu"]}/>
                                <Legend />
                                <Line type="monotone" dataKey="revenue" name="Doanh Thu" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Bookings List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Gần Đây</h3>
                    <div className="flex-1 overflow-auto pr-2">
                        <div className="space-y-4">
                            {recentBookings.length > 0 ? (
                                recentBookings.map((booking, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100">
                                        <div className="flex flex-col min-w-0 mr-3">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{booking.customerName || "Khách vãng lai"}</p>
                                            <p className="text-xs text-gray-500 truncate mb-1">{booking.email}</p>
                                            <p className="text-xs font-medium text-blue-600 truncate w-40 flex items-center"><Package className="h-3 w-3 mr-1" />{booking.tourName}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className="font-bold text-sm text-gray-900 mb-1 block">{formatCurrency(booking.amount)}</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${getStatusBadge(booking.status)}`}>{booking.status}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-400 text-sm">Chưa có booking nào.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}