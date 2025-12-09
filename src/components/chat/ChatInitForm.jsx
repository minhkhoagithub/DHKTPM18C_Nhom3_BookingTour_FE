import React, { useState } from 'react';
import { Mail, User, MessageSquare } from 'lucide-react';

export default function ChatInitForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error khi user sửa
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập tin nhắn đầu tiên';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <User size={16} className="inline mr-1" />
          Tên của bạn
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nhập tên"
          disabled={loading}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500 disabled:bg-gray-100 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Mail size={16} className="inline mr-1" />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          disabled={loading}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500 disabled:bg-gray-100 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* First Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MessageSquare size={16} className="inline mr-1" />
          Tin nhắn đầu tiên
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Nói cho chúng tôi biết bạn cần gì..."
          disabled={loading}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500 disabled:bg-gray-100 resize-none ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-semibold transition-colors"
      >
        {loading ? 'Đang kết nối...' : 'Bắt đầu chat'}
      </button>
    </form>
  );
}
