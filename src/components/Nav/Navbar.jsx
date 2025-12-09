import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt1 } from "react-icons/hi";
// Import thêm các icon mới
import {
  FaUserCircle,
  FaChevronDown,
  FaHistory,
  FaSignOutAlt,
  FaUserCog,
  FaHeart,
  FaQuestionCircle,
} from "react-icons/fa";
import ResponsiveMenu from "./ResponsiveMenu.jsx";
import { logout, getToken, getCurrentUser } from "../../services/authService";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        if (!token) {
          setUser(null);
          return;
        }
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.log("⚠️ Lỗi lấy user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowMenu(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <header
      className={`mx-auto top-0 transition-all bg-transparent/75 py-6 z-10`}
    >
      <div className="bg-black/50 px-4 fixed w-full z-50 top-0 py-2 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-2 px-5 flex bg-transparent justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl text-white font-bold tracking-wide">
              Travel<span className="text-red-500">Steven</span>
            </h1>
          </Link>

          <div className="flex items-center gap-5">
            <nav className="hidden md:flex gap-7">
              <ul className="flex items-center font-semibold text-white text-lg gap-8 tracking-wide">
                <Link to="/">
                  <li className="hover:text-red-400 transition-colors duration-200 cursor-pointer">
                    Home
                  </li>
                </Link>
                <Link to="/about">
                  <li className="hover:text-red-400 transition-colors duration-200 cursor-pointer">
                    About Us
                  </li>
                </Link>
                <Link to="/tours">
                  <li className="hover:text-red-400 transition-colors duration-200 cursor-pointer">
                    Tours
                  </li>
                </Link>
                <Link to="/blog">
                  <li className="hover:text-red-400 transition-colors duration-200 cursor-pointer">
                    Blogs
                  </li>
                </Link>
              </ul>

              <div
                className="flex items-center gap-2 relative"
                ref={dropdownRef}
              >
                {user ? (
                  /* --- PHẦN DROPDOWN USER (ĐÃ CSS LẠI) --- */
                  <div className="relative">
                    <button
                      onClick={toggleDropdown}
                      className={`flex items-center gap-2 text-black font-semibold px-4 py-2 rounded-full transition-all duration-200 focus:outline-none 
                        ${
                          dropdownOpen
                            ? "bg-white/20 shadow-inner"
                            : "hover:bg-white/10"
                        }`}
                    >
                      {/* Avatar giả lập nếu chưa có ảnh */}
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold border-2 border-white">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="max-w-[100px] truncate">
                        {user.customerName || user.name || user.email}
                      </span>
                      <FaChevronDown
                        size={12}
                        className={`transition-transform duration-300 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu Content */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-3 w-64 bg-black rounded-xl shadow-2xl py-2 z-50 text-black animate-fadeIn border border-gray-100 origin-top-right">
                        {/* Header User Info */}
                        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                          <p className="text-base font-bold text-black truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        {/* Menu Items Group 1 */}
                        <div className="py-2">
                          <Link
                            to="/my-bookings"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-700 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaHistory className="text-lg text-blue-500" />
                            Tour đã đặt
                          </Link>

                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-700 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaUserCircle className="text-lg text-green-500" />
                            Hồ sơ cá nhân
                          </Link>

                          <Link
                            to="/favorites"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-700 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaHeart className="text-lg text-pink-500" />
                            Yêu thích
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 my-1"></div>

                        {/* Menu Items Group 2 */}
                        <div className="py-2">
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-700 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaUserCog className="text-lg text-gray-500" />
                            Cài đặt tài khoản
                          </Link>

                          <Link
                            to="/help"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-700 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaQuestionCircle className="text-lg text-gray-500" />
                            Trợ giúp
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 my-1"></div>

                        {/* Logout Button */}
                        <div className="p-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
                          >
                            <FaSignOutAlt />
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* --- HẾT PHẦN DROPDOWN --- */
                  <>
                    <Link to="/login">
                      <button className="bg-red-500 text-white px-5 py-2 rounded-full font-bold hover:bg-red-600 transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                        Login
                      </button>
                    </Link>
                    <button className="bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                      Book Now
                    </button>
                  </>
                )}
              </div>
            </nav>
            <HiMenuAlt1
              onClick={toggleMenu}
              className="cursor-pointer md:hidden text-white hover:text-red-500 transition-colors"
              size={30}
            />
          </div>
        </div>
        <ResponsiveMenu showMenu={showMenu} setShowMenu={setShowMenu} />
      </div>
    </header>
  );
}
