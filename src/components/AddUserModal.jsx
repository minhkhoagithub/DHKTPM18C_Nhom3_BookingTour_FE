import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
    // State cho form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('Customer'); // Giá trị mặc định
    const [password, setPassword] = useState('');

    // Xử lý submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newUser = {
            name,
            email,
            phone,
            role,
            // (Trong API thật, bạn sẽ gửi password, 
            // nhưng chúng ta không lưu nó vào mock data)
        };
        
        onUserAdded(newUser); // Gọi hàm từ ToursAdmin
        handleClose(); // Đóng modal
    };

    // Reset form và đóng
    const handleClose = () => {
        setName('');
        setEmail('');
        setPhone('');
        setRole('Customer');
        setPassword('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        // Lớp phủ nền mờ
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            
            {/* Nội dung Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                {/* Header Modal */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Add New User</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                {/* Form thêm user */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
                            >
                                <option value="Customer">Customer</option>
                                <option value="Tour Guide">Tour Guide</option>
                                <option value="Administrator">Administrator</option>
                            </select>
                        </div>
                    </div>

                    {/* Nút Submit */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}