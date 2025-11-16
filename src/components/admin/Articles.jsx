import React from 'react';
import { PlusCircle } from 'lucide-react';

const Articles = () => {
    // Đây là component placeholder, bạn có thể phát triển thêm dựa trên mẫu ToursAdmin.jsx
    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Bài viết</h2>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors">
                    <PlusCircle size={20} />
                    <span>Viết bài mới</span>
                </button>
            </div>
            <div className="text-center text-gray-500 py-10">
                <p>Chức năng quản lý bài viết sẽ được phát triển ở đây.</p>
                <p className="text-sm mt-2">Bạn có thể áp dụng component `Modal` và cấu trúc bảng tương tự như trang Quản lý Tour.</p>
            </div>
        </div>
    );
};

export default Articles;
