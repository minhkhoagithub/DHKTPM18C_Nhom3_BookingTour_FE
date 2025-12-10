import React, { useState, useEffect } from 'react';
import { X, Search, Globe, MapPin } from 'lucide-react';
// Import hàm tìm kiếm tour từ service
import { getTourByNameContains } from '../services/tourService'; 
// Import các hàm service tạo khuyến mãi
import { createForTourPromotion, createGlobalPromotion } from '../services/promotionService'; 


const PROMOTION_TYPES = ['PERCENT', 'FIXED', 'CODE', 'BUNDLE'];
const PROMOTION_STATUSES = ['ACTIVE', 'INACTIVE'];
const PROMOTION_SCOPES = {
    GLOBAL: 'GLOBAL',
    SPECIFIC: 'SPECIFIC_TOUR'
};

export default function AddPromotionModal({ isOpen, onClose, onPromotionAdded }) {
    // --- State cho Scope & Tour Selection (Toggle) ---
    const [scope, setScope] = useState(PROMOTION_SCOPES.GLOBAL); 
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTour, setSelectedTour] = useState(null); 
    const [searchLoading, setSearchLoading] = useState(false);

    // --- State cho Promotion Data ---
    const [name, setName] = useState('');
    const [type, setType] = useState(PROMOTION_TYPES[0]);
    const [value, setValue] = useState('');
    // ⚠️ ĐÃ XÓA state [condition, setCondition] = useState('');
    const [status, setStatus] = useState(PROMOTION_STATUSES[0]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    
    
    // Hàm tìm kiếm Tour (Dùng khi scope là SPECIFIC)
    const handleSearch = async () => {
        setSearchLoading(true);
        setSearchResults([]); 
        setSelectedTour(null); 

        try {
            const data = await getTourByNameContains(searchQuery); 
            setSearchResults(data);
            
        } catch (error) {
            console.error("Failed to search tours:", error);
            alert("Tìm kiếm Tour thất bại. Vui lòng kiểm tra console.");
        } finally {
            setSearchLoading(false);
        }
    };

    // Reset form và đóng modal
    const handleClose = () => {
        setScope(PROMOTION_SCOPES.GLOBAL);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedTour(null);
        setName('');
        setType(PROMOTION_TYPES[0]);
        setValue('');
        // ⚠️ ĐÃ XÓA setCondition('');
        setStatus(PROMOTION_STATUSES[0]);
        setStartDate('');
        setEndDate('');
        setDescription('');
        onClose();
    };

    // Xử lý khi nhấn nút submit
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (scope === PROMOTION_SCOPES.SPECIFIC && !selectedTour) {
            alert("Vui lòng chọn Tour cụ thể để áp dụng khuyến mãi.");
            return;
        }
        
        // Chuẩn bị payload chung
        const promoData = {
            name,
            type,
            value: parseFloat(value),
            // ⚠️ ĐÃ XÓA TRƯỜNG "condition" KHỎI PAYLOAD
            status,
            // 🏆 SỬA ĐỊNH DẠNG NGÀY THÁNG SANG ISO CHUẨN (YYYY-MM-DDTHH:mm:ss)
            // Backend chỉ chấp nhận T thay vì khoảng trắng, và cần giây ':00'
            startDate: startDate ? startDate.replace('T', ' ') + ':00' : null,
            endDate: endDate ? endDate.replace('T', ' ') + ':00' : null,    
            description,
        };
        
        try {
            let result;
            if (scope === PROMOTION_SCOPES.SPECIFIC) {
                result = await createForTourPromotion(selectedTour.tourId, promoData);
            } else {
                result = await createGlobalPromotion(promoData);
            }
            
            onPromotionAdded(result); 
            handleClose();
            alert(`Tạo khuyến mãi ${scope === PROMOTION_SCOPES.GLOBAL ? 'Toàn cầu' : selectedTour.name} thành công!`);

        } catch (error) {
            console.error("Failed to add new promotion:", error);
            alert("Tạo khuyến mãi thất bại. Vui lòng kiểm tra console.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/25 bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header Modal */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Add New Promotion</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    
                    {/* TOGGLE: GLOBAL vs SPECIFIC (Giữ nguyên) */}
                    <div className="mb-6 p-3 border rounded-md bg-green-50">
                        <label className="block text-sm font-medium text-green-700 mb-2">Promotion Scope (*)</label>
                        <div className="flex space-x-4">
                            {/* Global Toggle */}
                            <button
                                type="button"
                                onClick={() => {
                                    setScope(PROMOTION_SCOPES.GLOBAL);
                                    setSelectedTour(null);
                                }}
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    scope === PROMOTION_SCOPES.GLOBAL ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Globe size={16} className="inline mr-2" /> Global (Dùng chung)
                            </button>
                            {/* Specific Tour Toggle */}
                            <button
                                type="button"
                                onClick={() => setScope(PROMOTION_SCOPES.SPECIFIC)}
                                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    scope === PROMOTION_SCOPES.SPECIFIC ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <MapPin size={16} className="inline mr-2" /> Specific Tour (Riêng lẻ)
                            </button>
                        </div>
                    </div>
                    
                    {/* TOUR SELECTION FIELD (CHỈ KHI CHỌN SPECIFIC) (Giữ nguyên) */}
                    {scope === PROMOTION_SCOPES.SPECIFIC && (
                        <div className="mb-4 relative z-10 p-4 border border-green-200 rounded-md">
                            <h3 className="text-md font-semibold mb-2">Apply to Specific Tour</h3>
                            {/* Logic tìm kiếm Tour tương tự AddDepartureModal */}
                            <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                                <input
                                    type="text"
                                    value={selectedTour ? selectedTour.name : searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setSelectedTour(null); 
                                        setSearchResults([]);
                                    }}
                                    placeholder="Search Tour by Name to assign promotion..."
                                    className="w-full px-3 py-2 focus:ring-green-500 focus:border-green-500 border-0 rounded-l-md" 
                                    required={scope === PROMOTION_SCOPES.SPECIFIC}
                                    disabled={selectedTour !== null}
                                />
                                <button 
                                    type="button" 
                                    onClick={handleSearch}
                                    disabled={searchQuery.length < 2 || selectedTour !== null}
                                    className="p-2 border-l border-gray-300 bg-gray-50 rounded-r-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {searchLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div> 
                                    ) : (
                                        <Search size={18} className="text-gray-500" />
                                    )}
                                </button>
                            </div>
                            
                            {/* Hiển thị kết quả/tour đã chọn */}
                            {selectedTour === null && searchResults.length > 0 && (
                                <div className="absolute w-full bg-white border border-t-0 border-gray-300 rounded-b-md shadow-lg max-h-40 overflow-y-auto mt-1 z-20">
                                    {searchResults.map((tour) => (
                                        <div
                                            key={tour.tourId}
                                            onClick={() => {
                                                setSelectedTour({ tourId: tour.tourId, name: tour.name });
                                                setSearchResults([]); 
                                                setSearchQuery(tour.name);
                                            }}
                                            className="p-3 cursor-pointer hover:bg-green-50 flex justify-between items-center" 
                                        >
                                            <span>{tour.name}</span>
                                            <span className="text-xs text-gray-500">ID: {tour.tourId.substring(0, 8)}...</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {selectedTour && (
                                <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-md flex justify-between items-center text-sm font-medium text-green-800">
                                    <span>Applied Tour: **{selectedTour.name}**</span>
                                    <button type="button" onClick={() => setSelectedTour(null)} className="text-green-500 hover:text-green-700">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PROMOTION DETAILS (Giữ nguyên) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Name (*)</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        
                        {/* Type (PERCENT/FIXED/CODE/BUNDLE) */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type (*)</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required>
                                {PROMOTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        
                        {/* Value */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value ({type === 'PERCENT' ? '%' : 'VNĐ'}) (*)</label>
                            <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required min="1" />
                        </div>

                        {/* Status (ACTIVE/INACTIVE) */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status (*)</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required>
                                {PROMOTION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        
                        {/* Start Date/Time */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date/Time (*)</label>
                            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        </div>

                        {/* End Date/Time */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date/Time (*)</label>
                            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                    </div>
                    
                    {/* ⚠️ ĐÃ XÓA TRƯỜNG CONDITION Ở ĐÂY */}
                    
                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (*)</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                    </div>

                    {/* Nút Submit */}
                    <div className="mt-6 flex justify-end">
                        <button type="button" onClick={handleClose}
                            className="mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
                            disabled={scope === PROMOTION_SCOPES.SPECIFIC && !selectedTour}>
                            Add Promotion
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}