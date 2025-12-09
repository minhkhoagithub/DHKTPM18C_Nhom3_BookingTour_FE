import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Định nghĩa các giá trị Enum (Cần phải khai báo hoặc import từ nơi khác)
const TOUR_TYPES = ["PREMIUM", "STANDARD"];
const TOUR_STATUSES = ["INACTIVE", "PUBLISHED", "DRAFT"];

export default function EditTourModal({ isOpen, onClose, onTourUpdated, tourData }) {
    // 1. STATE CHO TẤT CẢ CÁC TRƯỜNG (Giữ nguyên cấu trúc JSON)
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [durationDays, setDurationDays] = useState('');
    const [durationText, setDurationText] = useState('');
    const [type, setType] = useState(TOUR_TYPES[0]);
    const [status, setStatus] = useState(TOUR_STATUSES[0]);

    // State cho hình ảnh - TÁCH RIÊNG ảnh từ server và ảnh mới
    const [serverImages, setServerImages] = useState([]);     // Mảng URL từ server (https://...)
    const [localFiles, setLocalFiles] = useState([]);         // Mảng File object (chỉ ảnh mới chọn)
    const [localPreviews, setLocalPreviews] = useState([]);   // Mảng Blob URLs (chỉ ảnh mới chọn)
    
    // 2. EFFECT ĐIỀN DỮ LIỆU CŨ KHI MODAL MỞ
    useEffect(() => {
        if (tourData) {
            // Giải phóng Blob URLs của ảnh local trước khi thiết lập lại
            cleanupLocalPreviews();

            // Điền dữ liệu cơ bản
            setName(tourData.name || '');
            setDescription(tourData.description || '');
            setLocation(tourData.location || '');
            setBasePrice(tourData.basePrice || '');
            setDurationDays(tourData.durationDays || '');
            setDurationText(tourData.durationText || '');
            setType(tourData.type || TOUR_TYPES[0]);
            setStatus(tourData.status || TOUR_STATUSES[0]);
            
            // Thiết lập ảnh từ server (Giữ nguyên URL gốc)
            const initialServerImages = tourData.images || [];
            setServerImages(initialServerImages);
            
            // Reset ảnh local mới
            setLocalFiles([]);
            setLocalPreviews([]);
        }
        
        // Cleanup function: Chỉ giải phóng blob URLs khi component unmount
        return () => cleanupLocalPreviews();
    }, [tourData]);

    // Hàm cleanup chỉ giải phóng Blob URLs của ảnh local
    const cleanupLocalPreviews = () => {
        localPreviews.forEach(url => {
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
    };

    // 3. XỬ LÝ CHỌN ẢNH MỚI (Chỉ thêm ảnh mới vào local files)
    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length > 0) {
            const newPreviews = newFiles.map(f => URL.createObjectURL(f));
            
            // Cộng dồn vào local files và previews
            setLocalFiles(prevFiles => [...prevFiles, ...newFiles]); 
            setLocalPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
    };
    
    // 4. XỬ LÝ XÓA ẢNH TỪ SERVER
    const handleRemoveServerImage = (indexToRemove) => {
        setServerImages(prev => prev.filter((_, i) => i !== indexToRemove));
    };
    
    // 5. XỬ LÝ XÓA ẢNH LOCAL MỚI
    const handleRemoveLocalImage = (indexToRemove) => {
        const urlToRemove = localPreviews[indexToRemove];
        
        // Giải phóng Blob URL
        if (urlToRemove && urlToRemove.startsWith('blob:')) {
            URL.revokeObjectURL(urlToRemove);
        }

        // Xóa khỏi cả local files và previews
        setLocalPreviews(prev => prev.filter((_, i) => i !== indexToRemove));
        setLocalFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    // 6. XỬ LÝ SUBMIT
    const handleSubmit = (e) => {
  e.preventDefault();

  const updatedTour = {
    name,
    description,
    location,
    basePrice: parseFloat(basePrice),
    durationDays: parseInt(durationDays),
    durationText,
    type,
    status,

    // Ảnh cũ (URL)
    images: [...serverImages],

    // Ảnh mới (File object)
    newImageFiles: [...localFiles],
  };

  onTourUpdated(tourData.tourId, updatedTour);
  onClose();
};


    // 7. XỬ LÝ ĐÓNG MODAL
    const handleClose = () => {
        cleanupLocalPreviews();
        onClose();
    };

    if (!isOpen) return null;

    // Tổng hợp tất cả ảnh để hiển thị
    const allImagePreviews = [...serverImages, ...localPreviews];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Edit Tour ID: {tourData?.id || 'Loading...'}</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cột 1: Thông tin cơ bản */}
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

                        {/* Cột 2: Enum và Mô tả */}
                        <div>
                            {/* Tour Image (Cho phép chọn nhiều tệp) */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Images (Thêm/Xóa ảnh)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple 
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100" // Đổi màu input file cho Edit
                                />
                            </div>
                            
                            {/* Hiển thị tất cả ảnh đã chọn kèm nút xóa */}
                            {allImagePreviews.length > 0 && (
                                <div className="mb-4 border p-2 rounded-md bg-gray-50">
                                    <p className="text-sm font-semibold mb-2">
                                        Ảnh hiện tại ({serverImages.length} ảnh cũ, {localPreviews.length} ảnh mới)
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {allImagePreviews.map((url, index) => {
                                            const isLocalImage = index >= serverImages.length;
                                            const imageIndex = isLocalImage ? index - serverImages.length : index;
                                            const imageType = isLocalImage ? 'new' : 'server';
                                            
                                            return (
                                                <div key={`${url}-${index}`} className="relative w-24 h-24 border rounded-md overflow-hidden shadow-sm group">
                                                    <img 
                                                        src={url} 
                                                        alt={`Preview ${index}`} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {/* Badge hiển thị loại ảnh */}
                                                    <div className={`absolute bottom-0 left-0 right-0 text-white text-xs p-1 text-center ${
                                                        imageType === 'server' ? 'bg-blue-600/70' : 'bg-green-600/70'
                                                    }`}>
                                                        {imageType === 'server' ? 'Ảnh cũ' : 'Ảnh mới'}
                                                    </div>
                                                    {/* Nút Xóa */}
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            if (imageType === 'server') {
                                                                handleRemoveServerImage(imageIndex);
                                                            } else {
                                                                handleRemoveLocalImage(imageIndex);
                                                            }
                                                        }}
                                                        className="absolute top-0 right-0 p-1 bg-black/50 text-white rounded-bl-md hover:bg-red-600 transition"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className='text-xs text-gray-500 mt-2 italic'>
                                        Xanh dương: ảnh từ server. Xanh lá: ảnh mới thêm. Nhấn X để xóa ảnh.
                                    </p>
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Update Tour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}