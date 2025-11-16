import React from 'react';
import { Link } from 'react-router-dom';
import { HiMenuAlt1 } from "react-icons/hi";
import ResponsiveMenu from './ResponsiveMenu.jsx';
import { useState, useEffect } from 'react';


export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = ()=>{
        setShowMenu(!showMenu)
    }
   
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
              </ul>
              <button className='bg-red-500 text-white px-4 py-1 rounded-md font-semibold'>Book Now</button>
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