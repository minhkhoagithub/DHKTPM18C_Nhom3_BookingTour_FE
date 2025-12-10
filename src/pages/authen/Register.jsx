import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import registerImage from '../../assets/Hero1.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerUser } from '../../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra họ và tên
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }

    // Kiểm tra email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải ít nhất 6 ký tự';
    }

    // Kiểm tra xác nhận mật khẩu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không trùng khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi khi user bắt đầu nhập lại
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser(formData.email, formData.password, formData.name);
      
      if (response) {
        // Lưu token
        localStorage.setItem('token', response);
        setSuccessMessage('✓ Đăng ký thành công! Đang chuyển hướng...');
        
        // Chờ 1.5s rồi chuyển sang trang chủ
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.message || 'Đăng ký thất bại';
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Phần bên trái */}
        <div className="flex flex-col justify-center p-8 md:p-14 w-full md:w-auto">
          <span className="mb-3 text-4xl font-bold">Tạo tài khoản</span>
          <span className="font-light text-gray-400 mb-8">
            Bắt đầu hành trình của bạn với chúng tôi ngay hôm nay!
          </span>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-700 font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-600" size={20} />
              <span className="text-red-700 font-semibold">{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Họ và Tên */}
            <div className="py-4 relative">
              <label htmlFor="name" className="text-md font-medium">Họ và Tên *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 pl-10 border rounded-md placeholder:font-light placeholder:text-gray-500 focus:outline-none focus:ring-2 transition ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                  }`}
                  placeholder="Nhập họ và tên của bạn"
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="py-4 relative">
              <label htmlFor="email" className="text-md font-medium">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 pl-10 border rounded-md placeholder:font-light placeholder:text-gray-500 focus:outline-none focus:ring-2 transition ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                  }`}
                  placeholder="Nhập email của bạn"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </span>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="py-4 relative">
              <label htmlFor="password" className="text-md font-medium">Mật khẩu *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-2 pl-10 pr-10 border rounded-md placeholder:font-light placeholder:text-gray-500 focus:outline-none focus:ring-2 transition ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                  }`}
                  placeholder="Nhập mật khẩu của bạn"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password}
                </span>
              )}
            </div>

            {/* Xác nhận Mật khẩu */}
            <div className="py-4 relative">
              <label htmlFor="confirmPassword" className="text-md font-medium">Xác nhận Mật khẩu *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-2 pl-10 pr-10 border rounded-md placeholder:font-light placeholder:text-gray-500 focus:outline-none focus:ring-2 transition ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                  }`}
                  placeholder="Xác nhận lại mật khẩu"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.confirmPassword}
                </span>
              )}
              {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                <span className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <CheckCircle size={14} /> Mật khẩu trùng khớp
                </span>
              )}
            </div>

            {/* Nút đăng ký */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white p-3 rounded-lg my-6 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Đăng ký'
              )}
            </button>

            {/* Link đăng nhập */}
            <div className="text-center text-gray-400">
              Đã có tài khoản?
              <Link to="/login">
                <span className="font-bold text-black cursor-pointer hover:text-red-500"> Đăng nhập ngay</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Phần bên phải */}
        <div className="relative">
          <img
            src={registerImage}
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
          />
        </div>
      </div>
    </div>
  );
}

