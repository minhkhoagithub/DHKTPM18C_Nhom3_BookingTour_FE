import React from 'react';
import { User, Mail, Lock } from 'lucide-react';
import registerImage from '../../assets/Hero1.jpg';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Phần bên trái */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Tạo tài khoản</span>
          <span className="font-light text-gray-400 mb-8">
            Bắt đầu hành trình của bạn với chúng tôi ngay hôm nay!
          </span>
          <form>
            <div className="py-4 relative">
                <label htmlFor="name" className="text-md font-medium">Họ và Tên</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        id="name"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        name="name"
                        placeholder="Nhập họ và tên của bạn"
                        autoComplete="name"
                    />
                </div>
            </div>
            <div className="py-4 relative">
                <label htmlFor="email" className="text-md font-medium">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="email"
                        id="email"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        name="email"
                        placeholder="Nhập email của bạn"
                        autoComplete="email"
                    />
                </div>
            </div>
            <div className="py-4 relative">
                 <label htmlFor="pass" className="text-md font-medium">Mật khẩu</label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="password"
                        id="pass"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        name="password"
                        placeholder="Nhập mật khẩu của bạn"
                    />
                </div>
            </div>
            <div className="py-4 relative">
                 <label htmlFor="confirm-pass" className="text-md font-medium">Xác nhận Mật khẩu</label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="password"
                        id="confirm-pass"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        name="confirmPassword"
                        placeholder="Xác nhận lại mật khẩu"
                    />
                </div>
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded-lg my-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
            >
              Đăng ký
            </button>
            <div className="text-center text-gray-400">
              Đã có tài khoản?
              <Link to="/login">
                <span className="font-bold text-black cursor-pointer"> Đăng nhập ngay</span>
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

