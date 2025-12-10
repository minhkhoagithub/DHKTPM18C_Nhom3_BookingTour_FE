import React, { useState, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';
import loginImage from '../../assets/Hero1.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { login, setUserInfo } from '../../services/authService';
import {jwtDecode} from 'jwt-decode';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // =============================
  // LOAD GOOGLE SDK + RENDER BUTTON
  // =============================
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "966637047245-uoe5suda8rfh3invm8k16kl5rfq8heuc.apps.googleusercontent.com",
          callback: handleGoogleCallback,
        });

        // Render button ngay khi SDK load
        window.google.accounts.id.renderButton(
          document.getElementById("googleLoginDiv"),
          {
            theme: "outline",
            size: "large",
            width: 350,
          }
        );
      }
    };

    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  // GOOGLE CALLBACK
  const handleGoogleCallback = async (response) => {
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
        
        // Decode JWT token để lấy user info
        const decodedToken = jwtDecode(data.data);
        const userInfo = {
          email: decodedToken.sub,
          role: decodedToken.role,
          customerId: decodedToken.customerId
        };
        setUserInfo(userInfo);
        
        console.log("Google login successful:", data);
        console.log("User info từ token:", userInfo);
        navigate("/");
      } else {
        setError(data.message || "Google login failed");
      }
    } catch (err) {
      setError(err.message || "Google login failed");
    }
  };

  // =============================
  // EMAIL/PASSWORD LOGIN
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(email, password);
      console.log("Login successful:", data);
      
      // Decode JWT token để lấy user info
      const decodedToken = jwtDecode(data);
      const userInfo = {
        email: decodedToken.sub,
        role: decodedToken.role,
        customerId: decodedToken.customerId
      };
      setUserInfo(userInfo);
      console.log("User info từ token:", userInfo);
      if(userInfo.role === "ADMIN") {
        navigate("/admin");
        return;
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
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
              <label htmlFor="email" className="text-md font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                  value={email}
                  placeholder="Nhập email của bạn"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="py-4 relative">
              <label htmlFor="pass" className="text-md font-medium">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="pass"
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="text-red-500 text-sm my-2">{error}</div>}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
            >
              Đăng nhập
            </button>

            {/* GOOGLE LOGIN */}
            <div className="text-center text-gray-400">
              <span>Hoặc đăng nhập bằng</span>

              {/* GOOGLE BUTTON LOCATION */}
              <div id="googleLoginDiv" className="mt-4 flex justify-center"></div>

              <div className="mt-6">
                Chưa có tài khoản?
                <Link to="/register">
                  <span className="font-bold text-black cursor-pointer"> Đăng ký miễn phí</span>
                </Link>
              </div>
              <div className="mt-2">
                <Link to="/">
                  <span className="font-bold text-black cursor-pointer"> Back home</span>
                </Link>
            </div>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE */}
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
