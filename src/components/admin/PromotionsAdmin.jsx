import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle, Search, Globe, MapPin } from 'lucide-react';

// Import service cần thiết
// 🏆 IMPORT HÀM XÓA
import { getAllPromotions, softDeletePromotion } from '../../services/promotionService'; 
// Import modal thêm khuyến mãi
import AddPromotionModal from '../AddPromotionModal'; 

const PromotionsAdmin = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [currentPromotion, setCurrentPromotion] = useState(null);

    // Hàm lấy dữ liệu khuyến mãi
    const fetchPromotions = async () => {
        try {
            const data = await getAllPromotions();
            setPromotions(data);
        } catch (error) {
            console.error("Failed to fetch promotions:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý sau khi thêm/update thành công
    const handlePromotionAdded = () => {
        fetchPromotions();
        setIsAddModalOpen(false);
    };
    
    // 🏆 HÀM XỬ LÝ XÓA MỀM KHUYẾN MÃI
    const handleDeletePromotion = async (promotionId, promotionName) => {
        if (window.confirm(`Bạn có chắc muốn xóa khuyến mãi "${promotionName}" (ID: ${promotionId.substring(0, 8)}...)?`)) {
            try {
                // Gọi hàm service xóa
                await softDeletePromotion(promotionId);
                
                // Tải lại danh sách sau khi xóa thành công
                await fetchPromotions();
                alert(`Khuyến mãi "${promotionName}" đã được xóa mềm thành công.`);
            } catch (error) {
                console.error("Failed to delete promotion:", error);
                alert("Xóa khuyến mãi thất bại. Vui lòng kiểm tra console.");
            }
        }
    };

    // Tải dữ liệu khi component được mount
    useEffect(() => {
        fetchPromotions();
    }, []);

    // Hàm định dạng class CSS cho Status (sử dụng enum từ backend)
    const getStatusClass = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800'; 
            case 'INACTIVE': return 'bg-gray-100 text-gray-800';
            case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
            case 'EXPIRED': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Hàm xác định Scope (Phạm vi) dựa trên tourId
    const getScopeIcon = (tourId) => {
        if (!tourId) {
            return { icon: <Globe size={16} className="text-purple-600" />, label: 'Global' };
        }
        return { icon: <MapPin size={16} className="text-red-600" />, label: 'Specific Tour' };
    };
    
    // Hàm định dạng giá trị giảm giá (Sửa lỗi logic Percent)
    const formatDiscount = (value, type) => {
        // Thêm kiểm tra null/undefined an toàn
        if (value === null || value === undefined) return 'N/A';
        
        const formattedValue = Math.round(value).toLocaleString('vi-VN'); 

        if (type === 'PERCENT') return `${formattedValue} vnđ`; 
        if (type === 'FIXED' || type === 'FIXED_AMOUNT') return `${formattedValue} VNĐ`;
        return value;
    };


    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Loading promotion data...</h2>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Promotion Management</h2>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
                >
                    <PlusCircle size={20} />
                    <span>Add New Promotion</span>
                </button>
            </div>
            
            {/* Search and Filters */}
            <div className="mb-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name or status..." 
                        className="pl-10 pr-4 py-2 w-full max-w-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Promo Name</th>
                            <th scope="col" className="px-6 py-3">Value</th>
                            <th scope="col" className="px-6 py-3">Start Date</th>
                            <th scope="col" className="px-6 py-3">End Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Scope</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.map((promo) => {
                            const scopeData = getScopeIcon(promo.tourId);
                            // ⚠️ XÓA console.log:
                            // console.log("Current Promotion State (Length):", promotions.length);
                            // console.log("First Promotion Object:", promotions[0]);
                            
                            return (
                                <tr key={promo.promotionId} className="bg-white border-b hover:bg-gray-50">
                                    {/* Cột Tên KM (Dùng promo.name) */}
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis">
                                        {promo.name}
                                    </td>
                                    {/* Cột Discount */}
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDiscount(promo.value, promo.type)}</td>
                                    
                                    {/* Cột Start Date (Đảm bảo N/A và format ngày) */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {promo.startDate ? new Date(promo.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                                    </td>
                                    
                                    {/* Cột End Date */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {promo.endDate ? new Date(promo.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                                    </td>
                                    
                                    {/* Cột Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(promo.status)}`}>
                                            {promo.status}
                                         </span>
                                    </td>
                                    
                                    {/* Cột Scope */}
                                    <td className="px-6 py-4 flex items-center gap-2 whitespace-nowrap">
                                        {scopeData.icon}
                                        <span className={`text-xs font-medium ${scopeData.label === 'Global' ? 'text-purple-600' : 'text-red-600'}`}>
                                            {scopeData.label}
                                        </span>
                                    </td>
                                    
                                    {/* CỘT ACTIONS: GÁN HÀM XÓA */}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center gap-3 whitespace-nowrap">
                                            <button className="text-blue-600 hover:text-blue-800" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            {/* 🏆 GỌI HÀM DELETE */}
                                            <button 
                                                onClick={() => handleDeletePromotion(promo.promotionId, promo.name)}
                                                className="text-red-600 hover:text-red-800" 
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {/* Modal Add Promotion */}
            {isAddModalOpen && (
                <AddPromotionModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onPromotionAdded={handlePromotionAdded}
                />
            )}
        </div>
    );
};

export default PromotionsAdmin;