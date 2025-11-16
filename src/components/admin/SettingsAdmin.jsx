import React from 'react';
import { User, Bell, Lock, Globe, CreditCard } from 'lucide-react';

const SettingsAdmin = () => {

    const settingsOptions = [
        { icon: <User size={24} className="text-red-500" />, title: 'Profile', description: 'Manage your personal and contact information.' },
        { icon: <Bell size={24} className="text-red-500" />, title: 'Notifications', description: 'Configure your alert and notification preferences.' },
        { icon: <Lock size={24} className="text-red-500" />, title: 'Security', description: 'Change your password and manage account security.' },
        { icon: <CreditCard size={24} className="text-red-500" />, title: 'Payment Methods', description: 'Add, edit, or remove payment information.' },
        { icon: <Globe size={24} className="text-red-500" />, title: 'General', description: 'Manage general site settings, language, and currency.' },
    ]

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settingsOptions.map(option => (
                     <div key={option.title} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                {option.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{option.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Site Configuration</h3>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
                        <input type="text" id="siteName" defaultValue="TravelSteven" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500" />
                    </div>
                     <div>
                        <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">Administrator Email</label>
                        <input type="email" id="adminEmail" defaultValue="admin@travelsteven.com" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500" />
                    </div>
                     <div className="flex justify-end">
                        <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsAdmin;
