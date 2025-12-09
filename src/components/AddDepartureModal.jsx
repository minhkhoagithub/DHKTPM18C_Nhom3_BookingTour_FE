import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
// Giả định bạn có các hàm service này
import { getTourByNameContains } from '../services/tourService'; 
// Hàm service cho việc thêm Departure
import { addDeparture } from '../services/departureService'; 

export default function AddDepartureModal({ isOpen, onClose, onDepartureAdded }) {
    // --- State cho Tour Selection ---
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTour, setSelectedTour] = useState(null); // Lưu {id, name} của tour đã chọn
    const [searchLoading, setSearchLoading] = useState(false);
    
    // --- State cho Departure Data (tạo chính xác theo JSON) ---
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [maxCapacity, setMaxCapacity] = useState(''); // Lưu dưới dạng string để dễ xử lý input
    
    // 1. XÓA useEffect TÌM KIẾM TỰ ĐỘNG (DEBOUNCE)
    
    // Hàm tìm kiếm Tour (Kích hoạt khi nhấn nút)
    const handleSearch = async () => {
        if (searchQuery.length < 2) {
            alert("Vui lòng nhập ít nhất 2 ký tự để tìm kiếm Tour.");
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        setSearchResults([]); // Xóa kết quả cũ
        setSelectedTour(null); // Đảm bảo xóa tour đã chọn nếu đang tìm kiếm lại

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
        setSearchQuery('');
        setSearchResults([]);
        setSelectedTour(null);
        setStartDate('');
        setEndDate('');
        setMaxCapacity('');
        onClose();
    };

    // Xử lý khi nhấn nút submit (Giữ nguyên)
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        

        if (!selectedTour) {
            alert("Vui lòng chọn Tour trước khi thêm chuyến đi.");
            return;
        }
        
        const newDepartureData = {
            startDate: startDate,
            endDate: endDate,
            maxCapacity: parseInt(maxCapacity, 10),
        };
  
        
        try {
            await onDepartureAdded(selectedTour.tourId, newDepartureData); 
            
            handleClose();
        } catch (error) {
            console.error("Failed to add new departure:", error);
            alert("Thêm chuyến đi thất bại. Vui lòng kiểm tra console.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/25 bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                {/* Header Modal */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Add New Departure</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* 1. TOUR SELECTION FIELD */}
                    <div className="mb-4 relative z-10">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Tour (*)</label>
                        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                            <input
                                type="text"
                                // Hiển thị tên tour đã chọn hoặc chuỗi tìm kiếm
                                value={selectedTour ? selectedTour.name : searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSelectedTour(null); // Xóa selection cũ
                                    setSearchResults([]); // Xóa kết quả hiển thị
                                }}
                                placeholder="Search Tour by Name..."
                                className="w-full px-3 py-2 focus:ring-red-500 focus:border-red-500 border-0 rounded-l-md"
                                required
                                disabled={selectedTour !== null} 
                            />
                            {/* 3. GẮN HÀM handleSearch VÀO NÚT (Button) */}
                            <button 
                                type="button" 
                                onClick={handleSearch}
                                disabled={searchQuery.length < 2 || selectedTour !== null}
                                className="p-2 border-l border-gray-300 bg-gray-50 rounded-r-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {searchLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                ) : (
                                    <Search size={18} className="text-gray-500" />
                                )}
                            </button>
                        </div>
                        
                        {/* 4. CẬP NHẬT LOGIC HIỂN THỊ KẾT QUẢ TÌM KIẾM */}
                        {selectedTour === null && searchResults.length > 0 && (
                            <div className="absolute w-full bg-white border border-t-0 border-gray-300 rounded-b-md shadow-lg max-h-40 overflow-y-auto mt-1">
                                {searchResults.map((tour) => (
                                    <div
                                        key={tour.tourId}
                                        onClick={() => {
                                            setSelectedTour({ tourId: tour.tourId, name: tour.name });
                                            setSearchResults([]); // Xóa kết quả sau khi chọn
                                            setSearchQuery(tour.name);
                                        }}
                                        className="p-3 cursor-pointer hover:bg-red-50 flex justify-between items-center"
                                    >
                                        <span>{tour.name}</span>
                                        <span className="text-xs text-gray-500">ID: {tour.tourId.substring(0, 8)}...</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Hiển thị Tour đã chọn (Giữ nguyên) */}
                        {selectedTour && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
                                <span className="text-sm font-medium text-red-700">Tour Selected: **{selectedTour.name}**</span>
                                <button type="button" onClick={() => setSelectedTour(null)} className="text-red-500 hover:text-red-700">
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* 2. DEPARTURE FIELDS (Giữ nguyên) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Start Date/Time */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date/Time (*)</label>
                            <input
                                type="datetime-local" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>

                        {/* End Date/Time */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date/Time (*)</label>
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Max Capacity (Giữ nguyên) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity (*)</label>
                        <input
                            type="number"
                            value={maxCapacity}
                            onChange={(e) => setMaxCapacity(e.target.value)}
                            min="1"
                            placeholder="e.g., 40"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    

                    {/* Nút Submit (Giữ nguyên) */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                            disabled={!selectedTour} // Vô hiệu hóa nếu chưa chọn tour
                        >
                            Add Departure
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}