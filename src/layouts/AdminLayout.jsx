
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Compass, Calendar, Users, Settings, ChevronLeft, ChevronRight, Bell, UserCircle, Search } from 'lucide-react';

export default function AdminLayout () {
     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: <Home size={20} />, path: '/admin' },
        { name: 'Tours', icon: <Compass size={20} />, path: '/admin/tours' },
        { name: 'Bookings', icon: <Calendar size={20} />, path: '/admin/bookings' },
        { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin' || location.pathname === '/admin/';
        }
        return location.pathname.startsWith(path);
    };
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className={`flex items-center justify-between p-4 h-16 border-b border-gray-700 ${isSidebarOpen ? 'px-4' : 'px-6'}`}>
                    <h1 className={`text-xl font-bold text-white transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Travel<span className="text-red-500">Admin</span></h1>
                     <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
                        {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                    </button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`w-full flex items-center p-2 text-base font-normal rounded-lg transition-colors ${
                                isActive(item.path) ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            } ${!isSidebarOpen && 'justify-center'}`}
                        >
                            {item.icon}
                            <span className={`ml-3 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-gray-800">
                            <Bell size={24} />
                        </button>
                         <div className="flex items-center gap-2">
                            <UserCircle size={32} className="text-gray-600"/>
                            <div>
                                <p className="font-semibold text-sm">Admin</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                         </div>
                    </div>
                </header>

                {/* Page Content rendered by child routes */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}