import React, { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import loginImage from '../../assets/Hero1.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  // =============================
  // LOAD GOOGLE SDK
  // =============================
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // =============================
  // LOGIN WITH EMAIL/PASSWORD
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(email, password);
      console.log('Login successful:', data);

      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  // =============================
  // LOGIN WITH GOOGLE
  // =============================
  const handleGoogleLogin = () => {
    if (!loaded || !window.google) {
      setError("Google chưa sẵn sàng, vui lòng thử lại.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: "628459552289-9vnrt1pd2glubmtvshucbmvq2kkmnsvq.apps.googleusercontent.com",
      callback: async (response) => {
        const idToken = response.credential;

        try {
          const res = await fetch("http://localhost:8080/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          const data = await res.json();

          if (res.ok) {
            localStorage.setItem("token", data.data); 
            console.log("Google login successful:", data);
            navigate("/");
          } else {
            setError(data.message || "Google login failed");
          }
        } catch (err) {
          setError(err.message || "Google login failed");
        }
      },
    });

    // Hiển thị nút Google
    window.google.accounts.id.renderButton(
      document.getElementById("googleLoginDiv"),
      {
        theme: "outline",
        size: "large",
        width: 350,
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Chào mừng trở lại</span>
          <span className="font-light text-gray-400 mb-8">
            Vui lòng nhập thông tin chi tiết của bạn
          </span>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="py-4 relative">
              <label htmlFor="email" className="text-md font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md placeholder:text-gray-500"
                  value={email}
                  placeholder="Nhập email của bạn"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="py-4 relative">
              <label htmlFor="pass" className="text-md font-medium">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="pass"
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md placeholder:text-gray-500"
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

            {/* REMEMBER + FORGOT */}
            <div className="flex justify-between w-full py-4">
              <div className="mr-24">
                <input type="checkbox" className="mr-2" />
                <span className="text-md">Ghi nhớ trong 30 ngày</span>
              </div>
              <span className="font-bold text-md cursor-pointer">Quên mật khẩu</span>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
            >
              Đăng nhập
            </button>

            {/* GOOGLE LOGIN BLOCK */}
            <div className="text-center text-gray-400">
              Chưa có tài khoản?
              <Link to="/register">
                <span className="font-bold text-black cursor-pointer"> Đăng ký miễn phí</span>
              </Link>

              {/* GOOGLE BUTTON WILL RENDER HERE */}
              <div id="googleLoginDiv" className="mt-6"></div>

              {/* BUTTON TO LOAD GOOGLE BUTTON */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-white hover:text-black hover:border hover:border-gray-300"
              >
                Hiện nút đăng nhập Google
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE IMAGE */}
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
