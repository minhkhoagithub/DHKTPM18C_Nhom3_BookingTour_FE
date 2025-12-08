import React from 'react';
import { Link } from 'react-router-dom';
import { HiMenuAlt1 } from "react-icons/hi";
import ResponsiveMenu from './ResponsiveMenu.jsx';
import { useState, useEffect } from 'react';
import { logout, getToken, getCurrentUser } from '../../services/authService';


export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user khi component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        
        if (!token) {
          console.log("⚠️ Không có token, bỏ qua gọi getCurrentUser");
          setUser(null);
          setLoading(false);
          return;
        }

        console.log("🔑 Token tồn tại, gọi API /me");
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        console.log("👤 Current user:", currentUser);
      } catch (error) {
        console.log("⚠️ Lỗi lấy user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowMenu(false);
  };

  const handleLoginClick = () => {
    setShowMenu(false);
  };
   
  return (
    <header className={`mx-auto top-0 transition-all bg-transparent/75 py-6 z-10`} >
      <div className='bg-black/50 px-4 fixed w-full z-50 top-0 py-2'>
        <div className='max-w-7xl mx-auto py-2 px-5 flex bg-transparent justify-between items-center'>
          <Link to='/'>
                    <h1 className='text-2xl text-white font-bold'>Travle<span className='text-red-500'>Steven</span></h1>
          </Link>
          <div className='flex items-center gap-5'>
            <nav className='hidden md:flex gap-7'>
              <ul className='flex items-center font-semibold text-white text-xl gap-7'>
                <Link to='/'><li >Home</li></Link> 
                <Link to='/about'><li >About Us</li></Link>
                <Link to='/tours'><li >Tours</li></Link>
                <Link to='/gallery'><li >Gallery</li></Link>
                <Link to='/contact'><li >Contact</li></Link>
                <Link to='/blog'><li >Blog</li></Link>
              </ul>
              <div className='flex items-center gap-2'>
                {user ? (
                  <>
                    <span className='text-white font-semibold px-4 py-1 rounded-md'>
                      {user.customerName || user.name || user.email || 'User'}
                    </span>
                    <button 
                      onClick={handleLogout}
                      className='bg-red-500 text-white px-4 py-1 rounded-md font-semibold hover:bg-red-600'
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to='/login' onClick={handleLoginClick}>
                      <button className='bg-red-500 text-white px-4 py-1 rounded-md font-semibold hover:bg-red-600'>
                        Login
                      </button>
                    </Link>
                    <button className='bg-white text-black px-4 py-1 rounded-md font-semibold hover:bg-gray-200'>
                      Book Now
                    </button>
                  </>
                )}
              </div>
            </nav>
            <HiMenuAlt1 
              onClick={toggleMenu} 
              className='cursor-pointer md:hidden text-black'
              size={30}
            />
          </div>
        </div>
         <ResponsiveMenu showMenu={showMenu} setShowMenu={setShowMenu}/>
      </div>
    </header>
  );
} 