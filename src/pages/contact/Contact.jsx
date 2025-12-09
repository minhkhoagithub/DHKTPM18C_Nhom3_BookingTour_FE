

import React, { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý submit form (gửi lên API hoặc hiển thị thông báo)
        console.log("Form data submitted:", formData);
        alert("Cảm ơn bạn đã liên hệ với chúng tôi!");
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen  flex flex-col items-center p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">Liên Hệ Với Chúng Tôi</h1>
            <p className="text-gray-700 text-center mb-12 max-w-2xl">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn. Vui lòng điền thông tin bên dưới hoặc liên hệ trực tiếp qua email hoặc số điện thoại.
            </p>

            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 mb-2">Họ và tên</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Nhập họ và tên của bạn"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Tin nhắn</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Nhập tin nhắn của bạn"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Gửi Tin Nhắn
                    </button>
                </form>

                <div className="mt-10 text-gray-700 space-y-2">
                    <p><strong>Email:</strong> support@travelwebsite.com</p>
                    <p><strong>Số điện thoại:</strong> +84 123 456 789</p>
                    <p><strong>Địa chỉ:</strong> 123 Đường Du Lịch, Hà Nội, Việt Nam</p>
                </div>
            </div>
        </div>
    );
}
