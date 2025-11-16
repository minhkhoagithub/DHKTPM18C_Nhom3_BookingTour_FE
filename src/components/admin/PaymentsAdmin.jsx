import React from 'react';
import { Edit, Trash2, Search, FileText } from 'lucide-react';

const PaymentsAdmin = () => {
    // Placeholder data
    const paymentsData = [
        { id: 'PAY-001', bookingId: 'BK-001', amount: '$1,999.00', method: 'Credit Card', status: 'Paid', date: '2023-10-20' },
        { id: 'PAY-002', bookingId: 'BK-002', amount: '$3,250.00', method: 'PayPal', status: 'Pending', date: '2023-11-10' },
        { id: 'PAY-003', bookingId: 'BK-003', amount: '$1,500.00', method: 'Credit Card', status: 'Refunded', date: '2023-09-10' },
        { id: 'PAY-004', bookingId: 'BK-004', amount: '$2,100.00', method: 'Bank Transfer', status: 'Paid', date: '2023-11-25' },
        { id: 'PAY-005', bookingId: 'BK-005', amount: '$2,800.00', method: 'Credit Card', status: 'Paid', date: '2023-08-15' },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Refunded': return 'bg-purple-100 text-purple-800';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Payment Management</h2>
            </div>
            
             <div className="mb-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by booking ID or status..." 
                        className="pl-10 pr-4 py-2 w-full max-w-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Payment ID</th>
                            <th scope="col" className="px-6 py-3">Booking ID</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Method</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentsData.map((payment) => (
                            <tr key={payment.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{payment.id}</td>
                                <td className="px-6 py-4">{payment.bookingId}</td>
                                <td className="px-6 py-4">{payment.amount}</td>
                                <td className="px-6 py-4">{payment.method}</td>
                                <td className="px-6 py-4">{payment.date}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(payment.status)}`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex justify-center items-center gap-3">
                                    <button className="text-gray-600 hover:text-gray-800" title="View Invoice">
                                        <FileText size={18} />
                                    </button>
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

export default PaymentsAdmin;
