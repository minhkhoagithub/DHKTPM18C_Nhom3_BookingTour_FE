import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import loginImage from '../../assets/Hero1.jpg'; 
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form reload trang
    setError(null); // Xóa lỗi cũ

    try {
      // 3. Gọi API login từ authService
      const data = await login(email, password);
      
      // 4. Đăng nhập thành công
      console.log('Login successful:', data);

      // 5. Chuyển hướng người dùng đến trang admin
      // (Bạn có thể kiểm tra data.role ở đây nếu muốn)
      navigate('/'); 

    } catch (err) {
      // 6. Xử lý lỗi đăng nhập
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Phần bên trái */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Chào mừng trở lại</span>
          <span className="font-light text-gray-400 mb-8">
            Vui lòng nhập thông tin chi tiết của bạn
          </span>
          <form onSubmit={handleSubmit}>
            <div className="py-4 relative">
                <label htmlFor="email" className="text-md font-medium">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="email"
                        id="email"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        name="email"
                        value={email}
                        placeholder="Nhập email của bạn"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="py-4 relative">
                 <label htmlFor="pass" className="text-md font-medium">Mật khẩu</label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        // type="password"
                        id="pass"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        name="password"
                        placeholder="Nhập mật khẩu của bạn"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && (
              <div className="text-red-500 text-sm my-2">
                {error}
              </div>
            )}
            </div>
            <div className="flex justify-between w-full py-4">
              <div className="mr-24">
                <input type="checkbox" name="ch" id="ch" className="mr-2" />
                <span className="text-md">Ghi nhớ trong 30 ngày</span>
              </div>
              <span className="font-bold text-md cursor-pointer">Quên mật khẩu</span>
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
            >
              Đăng nhập
            </button>
            <div className="text-center text-gray-400">
              Chưa có tài khoản?
              <Link to="/register" >
                <span className="font-bold text-black cursor-pointer"> Đăng ký miễn phí</span>
              </Link>
            </div>
          </form>
        </div>
        {/* Phần bên phải */}
        <div className="relative">
          <img
            src={loginImage}
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
          />
        </div>
      </div>
    </div>
  );
}

