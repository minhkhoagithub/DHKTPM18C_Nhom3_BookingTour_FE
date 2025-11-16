import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddTourModal({ isOpen, onClose, onTourAdded }) {
    // State cho các trường trong form
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [price, setPrice] = useState('');
    const [star, setStar] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState(null); // Để xem trước ảnh
    // const [imageFile, setImageFile] = useState(null); // (Dùng khi có API thật)

    // Xử lý khi người dùng chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // setImageFile(file); // (Lưu file để gửi lên API thật)
            
            // Tạo một URL tạm thời để hiển thị ảnh
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    // Xử lý khi nhấn nút submit
    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn form tải lại trang
        
        const newTour = {
            name,
            time,
            price,
            star,
            description,
            img: imagePreview, // Dùng ảnh preview làm ảnh mock
            // imageFile: imageFile // (Dùng để gửi lên API thật)
        };
        
        onTourAdded(newTour); // Gọi hàm từ component cha (ToursAdmin)
        handleClose(); // Đóng modal sau khi submit
    };

    // Reset form và đóng modal
    const handleClose = () => {
        setName('');
        setTime('');
        setPrice('');
        setStar('');
        setDescription('');
        setImagePreview(null);
        // setImageFile(null);
        onClose(); // Gọi hàm onClose từ prop
    };

    if (!isOpen) return null; // Không hiển thị gì nếu modal bị đóng

    return (
        // Lớp phủ nền mờ
        <div className="fixed inset-0 bg-black/25 bg-opacity-50 z-40 flex justify-center items-center">
            
            {/* Nội dung Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header Modal */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Add New Tour</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                {/* Form thêm tour */}
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
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g., 5 Days - 4 Nights)</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (e.g., 5 (10 reviews))</label>
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
                                    required
                                />
                            </div>
                            {/* Xem trước ảnh */}
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