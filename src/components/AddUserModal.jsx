import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
    // State cho form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [loyaltyTier, setLoyaltyTier] = useState('SILVER'); // Giá trị mặc định

    // Xử lý submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newCustomer = {
            name,
            email,
            phone,
            address,
            loyaltyTier
        };
        console.log('Adding new customer:', newCustomer);
        onUserAdded(newCustomer); // Gọi hàm từ UsersAdmin
        handleClose(); // Đóng modal
    };

    // Reset form và đóng
    const handleClose = () => {
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setLoyaltyTier('SILVER');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Add New Customer</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loyalty Tier</label>
                            <select
                                value={loyaltyTier}
                                onChange={(e) => setLoyaltyTier(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
                            >
                                <option value="SILVER">SILVER</option>
                                <option value="GOLD">GOLD</option>
                                <option value="PLATINUM">PLATINUM</option>
                            </select>
                        </div>
                    </div>

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
                            Add Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
