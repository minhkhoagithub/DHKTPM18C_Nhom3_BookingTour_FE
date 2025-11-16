import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Reviews = () => {
    // Dữ liệu mẫu
    const reviews = [
        {id: 1, user: 'John Doe', tour: 'Paris Adventure', rating: 5, comment: 'Chuyến đi thật tuyệt vời!', status: 'Pending'},
        {id: 2, user: 'Jane Smith', tour: 'Tokyo Lights', rating: 4, comment: 'Hướng dẫn viên rất nhiệt tình.', status: 'Approved'},
        {id: 3, user: 'Anonymous', tour: 'Bali Escape', rating: 2, comment: 'Khách sạn không được tốt lắm.', status: 'Hidden'},
    ]

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Hidden': return 'bg-gray-100 text-gray-800';
            default: return '';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đánh giá</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Người dùng</th>
                            <th className="px-6 py-3">Tour</th>
                            <th className="px-6 py-3">Đánh giá</th>
                            <th className="px-6 py-3">Bình luận</th>
                            <th className="px-6 py-3">Trạng thái</th>
                            <th className="px-6 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(review => (
                            <tr key={review.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{review.user}</td>
                                <td className="px-6 py-4">{review.tour}</td>
                                <td className="px-6 py-4 text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                                <td className="px-6 py-4 max-w-sm truncate">{review.comment}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(review.status)}`}>
                                        {review.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex justify-center items-center gap-3">
                                    <button className="text-green-600 hover:text-green-800" title="Duyệt"><CheckCircle size={18} /></button>
                                    <button className="text-red-600 hover:text-red-800" title="Ẩn"><XCircle size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reviews;
