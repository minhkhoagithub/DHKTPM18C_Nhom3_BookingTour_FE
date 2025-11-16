import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Thêm prop 'tourData' để nhận dữ liệu tour cần sửa
export default function EditTourModal({ isOpen, onClose, onTourUpdated, tourData }) {
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [price, setPrice] = useState('');
    const [star, setStar] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    // THAY ĐỔI LỚN: Dùng useEffect để điền dữ liệu cũ vào form khi modal mở
    useEffect(() => {
        if (tourData) {
            setName(tourData.name || '');
            setTime(tourData.time || '');
            setPrice(tourData.price || '');
            setStar(tourData.star || '');
            setDescription(tourData.description || '');
            setImagePreview(tourData.img || null);
        }
    }, [tourData]); // Effect này chạy mỗi khi 'tourData' thay đổi

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            // (Khi có API thật, bạn cũng cần lưu 'imageFile' như ở AddTourModal)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const updatedTour = {
            name,
            time,
            price,
            star,
            description,
            img: imagePreview, 
        };
        
        // Gọi hàm onTourUpdated, truyền vào TÊN GỐC và DỮ LIỆU MỚI
        onTourUpdated(tourData.name, updatedTour);
        onClose(); // Đóng modal
    };

    if (!isOpen) return null;

    return (
        // Lớp phủ nền mờ
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            {/* Nội dung Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Edit Tour</h2> {/* Đổi tiêu đề */}
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                {/* Form sửa tour */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cột 1 */}
                        <div>
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
                            {/* ... (Các trường Time, Price, Star tương tự) ... */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input
                                    type="text"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <input
                                    type="text"
                                    value={star}
                                    onChange={(e) => setStar(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Cột 2 */}
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-red-50 file:text-red-700
                                        hover:file:bg-red-100"
                                    // Bỏ 'required' ở đây, vì người dùng có thể không muốn đổi ảnh
                                />
                            </div>
                            {imagePreview && (
                                <div className="mb-4">
                                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-md" />
                                </div>
                            )}
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
                            onClick={onClose}
                            className="mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" // Đổi màu nút
                        >
                            Update Tour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}