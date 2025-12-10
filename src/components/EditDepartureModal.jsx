import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Định nghĩa các trạng thái có sẵn
const DEPARTURE_STATUSES = ['OPEN', 'CLOSED', 'CANCELLED'];

export default function EditDepartureModal({ isOpen, onClose, onDepartureUpdated, departureData }) {
    
    // --- State cho Departure Data ---
    // Khởi tạo state bằng dữ liệu được truyền vào (nếu có)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');
    const [status, setStatus] = useState(DEPARTURE_STATUSES[0]); // Mặc định là OPEN

    // --- State cho Tour Name (Chỉ hiển thị) ---
    const [tourName, setTourName] = useState('');

    // --- EFFECT: Đồng bộ hóa dữ liệu hiện tại khi modal mở hoặc data thay đổi ---
    useEffect(() => {
        if (isOpen && departureData) {
            // Định dạng lại LocalDateTime từ Java sang format cho input datetime-local (YYYY-MM-DDThh:mm)
            const formatDateTime = (isoString) => {
                if (!isoString) return '';
                // Cắt bỏ phần giây và múi giờ nếu có
                return isoString.substring(0, 16); 
            };
            
            // Điền dữ liệu từ props vào state
            setTourName(departureData.tourName || 'N/A');
            setStartDate(formatDateTime(departureData.startDate));
            setEndDate(formatDateTime(departureData.endDate));
            setMaxCapacity(String(departureData.maxCapacity));
            setStatus(departureData.status || DEPARTURE_STATUSES[0]);
        }
    }, [isOpen, departureData]);


    // Reset form và đóng modal
    const handleClose = () => {
        // Reset các state về trạng thái ban đầu để tránh lỗi khi mở lại
        setStartDate('');
        setEndDate('');
        setMaxCapacity('');
        setStatus(DEPARTURE_STATUSES[0]);
        setTourName('');
        onClose();
    };

    // Xử lý khi nhấn nút submit
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        if (!departureData || !departureData.departureId) {
             alert("Lỗi: Không tìm thấy ID chuyến đi để cập nhật.");
             return;
        }

        const updatedData = {
            // Gửi tất cả các trường có thể chỉnh sửa
            startDate: startDate,
            endDate: endDate,
            maxCapacity: parseInt(maxCapacity, 10),
            status: status, // Trạng thái mới
        };
        
        try {
            // Gọi hàm cập nhật từ component cha
            await onDepartureUpdated(departureData.departureId, updatedData); 
            
            // Sau khi cập nhật thành công, modal sẽ được đóng bởi component cha
            // (hoặc gọi handleClose() nếu onDepartureUpdated không tự đóng)
            handleClose(); 

        } catch (error) {
            console.error("Failed to update departure:", error);
            alert("Cập nhật chuyến đi thất bại. Vui lòng kiểm tra console.");
        }
    };

    if (!isOpen || !departureData) return null;

    return (
        <div className="fixed inset-0 bg-black/25 bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                {/* Header Modal */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Edit Departure: {departureData.departureId.substring(0, 8)}...</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Thông tin Tour (Read-only) */}
                    <div className="mb-4 p-3 bg-gray-50 border rounded-md">
                         <label className="block text-sm font-medium text-gray-700">Tour Name:</label>
                         <p className="font-semibold text-lg text-red-600">{tourName}</p>
                    </div>

                    {/* DEPARTURE FIELDS */}
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
                    
                    {/* Max Capacity */}
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
                    
                    {/* TRẠNG THÁI (STATUS) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status (*)</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                        >
                            {DEPARTURE_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Nút Submit */}
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
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Update Departure
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}