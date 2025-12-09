import React, { useState } from 'react';
import { X } from 'lucide-react';

const TOUR_TYPES = ["PREMIUM", "STANDARD"];
const TOUR_STATUSES = ["INACTIVE", "PUBLISHED", "DRAFT"];

export default function AddTourModal({ isOpen, onClose, onTourAdded }) {
    // ... (Các State khác giữ nguyên)
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [durationDays, setDurationDays] = useState('');
    const [durationText, setDurationText] = useState('');
    const [type, setType] = useState(TOUR_TYPES[0]);
    const [status, setStatus] = useState(TOUR_STATUSES[0]);

    // ✨ THAY ĐỔI: Sử dụng mảng để lưu URL xem trước của TẤT CẢ các ảnh
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]); 

    const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {

        setImageFiles(files);  // ❗ GHI ĐÈ → không cộng dồn
        setImagePreviews(files.map(f => URL.createObjectURL(f)));
    }
};
    
    // ✨ HÀM MỚI: Xóa một ảnh khỏi danh sách xem trước
    const handleRemoveImage = (indexToRemove) => {
         // Giải phóng URL blob
        URL.revokeObjectURL(imagePreviews[indexToRemove]);

        // Xóa ảnh tại index
        setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
        setImageFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    // Reset form và đóng modal
    const handleClose = () => {
        // Giải phóng tất cả các URL tạm thời khi đóng modal
        imagePreviews.forEach(url => URL.revokeObjectURL(url)); 
        
        setName('');
        // ... (Reset các state khác)
        setDescription('');
        setLocation('');
        setBasePrice('');
        setDurationDays('');
        setDurationText('');
        setType(TOUR_TYPES[0]);
        setStatus(TOUR_STATUSES[0]);
        
        setImagePreviews([]); // Reset mảng ảnh
        onClose();
    };

    // Xử lý khi nhấn nút submit
    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        const newTour = {
            name,
            description,
            location,
            basePrice: parseFloat(basePrice),
            durationDays: parseInt(durationDays),
            durationText,
            type,
            status,
            // SỬA: Gửi mảng các URL ảnh đã chọn (chỉ mục đích hiển thị mock)
            images: imageFiles, 
        };
        
        onTourAdded(newTour);
        // Lưu ý: Không cần gọi handleClose ở đây nếu onTourAdded xử lý thành công
        // và muốn reset form ngay. Nếu không, hãy đảm bảo handleClose được gọi.
        handleClose();
    };

    if (!isOpen) return null;

    return (
        // ... (JSX Modal Container)
        <div className="fixed inset-0 bg-black/25 bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header Modal */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Add New Tour</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cột 1 (Giữ nguyên) */}
                        {/* ... Các trường Name, Location, Price, Duration Days, Duration Text ... */}
                        <div>
                             {/* Tour Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            {/* Location */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            {/* Base Price */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                                <input
                                    type="number" 
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            {/* Duration Days */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration Days (Số ngày)</label>
                                <input
                                    type="number"
                                    value={durationDays}
                                    onChange={(e) => setDurationDays(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            {/* Duration Text */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration Text (e.g., 3 ngày 2 đêm)</label>
                                <input
                                    type="text"
                                    value={durationText}
                                    onChange={(e) => setDurationText(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            {/* Type (PREMIUM, STANDARD) */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                >
                                    {TOUR_TYPES.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Status (INACTIVE, PUBLISHED, DRAFT) */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                >
                                    {TOUR_STATUSES.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        {/* Cột 2 */}
                        <div>
                            
                            
                            {/* Tour Image (Cho phép chọn nhiều tệp) */}
                             <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Images (Chọn nhiều)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple 
                                    onChange={handleImageChange}
                                    // Đặt key để reset input cho phép chọn lại cùng 1 file (optional)
                                    key={imagePreviews.length} 
                                    className="w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-red-50 file:text-red-700
                                        hover:file:bg-red-100"
                                    // Bỏ required nếu cho phép thêm tour không có ảnh
                                />
                            </div>
                            
                            {/* ✨ PHẦN MỚI: Hiển thị tất cả ảnh đã chọn kèm nút xóa */}
                            {imagePreviews.length > 0 && (
                                <div className="mb-4 border p-2 rounded-md bg-gray-50">
                                    <p className="text-sm font-semibold mb-2">Ảnh đã chọn ({imagePreviews.length} files)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {imagePreviews.map((url, index) => (
                                            <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden shadow-sm">
                                                <img 
                                                    src={url} 
                                                    alt={`Preview ${index}`} 
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Nút Xóa */}
                                                <button 
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-0 right-0 p-1 bg-black/50 text-white rounded-bl-md hover:bg-red-600 transition"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className='text-xs text-gray-500 mt-2 italic'>Lưu ý: Bạn có thể chọn lại file để thêm ảnh mới.</p>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="5"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                        </div>
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
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Add Tour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}