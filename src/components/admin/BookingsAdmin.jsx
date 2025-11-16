import React from 'react';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react';

const BookingsAdmin = () => {
    // Placeholder data
    const bookingsData = [
        { id: 'BK-001', customer: 'Olivia Martin', tour: 'Paris Adventure', date: '2023-10-26', status: 'Confirmed', price: '$1,999' },
        { id: 'BK-002', customer: 'Jackson Lee', tour: 'Tokyo Lights', date: '2023-11-15', status: 'Pending', price: '$3,250' },
        { id: 'BK-003', customer: 'Isabella Nguyen', tour: 'Bali Escape', date: '2023-09-05', status: 'Cancelled', price: '$1,500' },
        { id: 'BK-004', customer: 'William Kim', tour: 'Venice Canals', date: '2023-12-01', status: 'Confirmed', price: '$2,100' },
         { id: 'BK-005', customer: 'Sofia Davis', tour: 'India Wonders', date: '2023-08-20', status: 'Completed', price: '$2,800' },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors">
                    <PlusCircle size={20} />
                    <span>Add New Booking</span>
                </button>
            </div>
            
            {/* Search and Filters */}
            <div className="mb-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by customer, tour, or status..." 
                        className="pl-10 pr-4 py-2 w-full max-w-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Booking ID</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Tour</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Total Price</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookingsData.map((booking) => (
                            <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{booking.id}</td>
                                <td className="px-6 py-4">{booking.customer}</td>
                                <td className="px-6 py-4">{booking.tour}</td>
                                <td className="px-6 py-4">{booking.date}</td>
                                <td className="px-6 py-4">{booking.price}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex justify-center items-center gap-3">
                                    <button className="text-blue-600 hover:text-blue-800" title="Edit">
                                        <Edit size={18} />
                                    </button>
                                    <button className="text-red-600 hover:text-red-800" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingsAdmin;
