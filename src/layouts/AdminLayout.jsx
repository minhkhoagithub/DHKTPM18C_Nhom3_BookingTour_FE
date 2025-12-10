
import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
    Home, Compass, Calendar, Users, Settings, ChevronLeft, ChevronRight, 
    Bell, UserCircle, Search, Tag, Plane, CreditCard, FileText, DollarSign,
    LogOut, User as UserIcon, Shield, PenSquare, MessageSquare
} from 'lucide-react';
import { getUserInfo } from '../services/authService';

export default function AdminLayout () {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const profileRef = useRef(null);
    const user = getUserInfo(); // Giả sử hàm này lấy thông tin user hiện tại

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);

    const navGroups = [
        {
            name: 'Chức năng chính',
            items: [
                { name: 'Dashboard', icon: <Home size={20} />, path: '/admin' },
                { name: 'Tours', icon: <Compass size={20} />, path: '/admin/tours' },
                { name: 'Bookings', icon: <Calendar size={20} />, path: '/admin/bookings' },
                { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
                { name: 'Departures', icon: <Plane size={20} />, path: '/admin/departures' },
            ]
        },
        {
            name: 'Nội dung',
            items: [
                { name: 'Articles', icon: <PenSquare size={20} />, path: '/admin/articles' },
                // { name: 'Reviews', icon: <MessageSquare size={20} />, path: '/admin/reviews' },
            ]
        },
        {
            name: 'Tài chính',
            items: [
                { name: 'Promotions', icon: <Tag size={20} />, path: '/admin/promotions' },
                // { name: 'Payments', icon: <CreditCard size={20} />, path: '/admin/payments' },
                // { name: 'Invoices', icon: <FileText size={20} />, path: '/admin/invoices' },
                // { name: 'Price Policies', icon: <DollarSign size={20} />, path: '/admin/price-policies' },
            ]
        },
        // {
        //     name: 'Hệ thống',
        //     items: [
        //          { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
        //     ]
        // }
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
                <div className={`h-16 border-b border-gray-700 flex items-center ${isSidebarOpen ? 'justify-between px-4' : 'justify-center'}`}>
                    {isSidebarOpen && (
                        <Link to="/admin">
                            <h1 className="text-xl font-bold text-white whitespace-nowrap">
                                Travel<span className="text-red-500">Admin</span>
                            </h1>
                        </Link>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none">
                        {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                    </button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
                    {navGroups.map((group, index) => (
                        <div key={index}>
                            {isSidebarOpen && group.name && (
                                <h3 className="px-2 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{group.name}</h3>
                            )}
                             {group.items.map(item => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`w-full flex items-center p-2 text-base font-normal rounded-lg transition-colors ${
                                        isActive(item.path) ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } ${!isSidebarOpen && 'justify-center'}`}
                                    title={!isSidebarOpen ? item.name : ''}
                                >
                                    {item.icon}
                                    {isSidebarOpen && <span className={`ml-3 whitespace-nowrap`}>{item.name}</span>}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>
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
                        {/* <button className="text-gray-500 hover:text-gray-800 relative">
                            <Bell size={24} />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        </button> */}
                         <div className="relative" ref={profileRef}>
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 cursor-pointer">
                                <UserCircle size={32} className="text-gray-600"/>
                                <div className="hidden md:block">
                                    <p className="font-semibold text-sm text-left">Admin</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </button>
                             {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                    <Link to="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <UserIcon size={16} /> Hồ sơ
                                    </Link>
                                    <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <Settings size={16} /> Cài đặt
                                    </Link>
                                    <div className="border-t border-gray-100"></div>
                                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                        <LogOut size={16} /> Đăng xuất
                                    </Link>
                                </div>
                            )}
                         </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
