import React from 'react';
import { Search, Download, Eye } from 'lucide-react';

const InvoicesAdmin = () => {
    // Placeholder data
    const invoicesData = [
        { id: 'INV-001', bookingId: 'BK-001', amount: '$1,999.00', issueDate: '2023-10-20', dueDate: '2023-11-01', status: 'Paid' },
        { id: 'INV-002', bookingId: 'BK-002', amount: '$3,250.00', issueDate: '2023-11-10', dueDate: '2023-11-20', status: 'Pending' },
        { id: 'INV-003', bookingId: 'BK-003', amount: '$1,500.00', issueDate: '2023-09-10', dueDate: '2023-09-20', status: 'Cancelled' },
        { id: 'INV-004', bookingId: 'BK-004', amount: '$2,100.00', issueDate: '2023-11-25', dueDate: '2023-12-05', status: 'Paid' },
        { id: 'INV-005', bookingId: 'BK-005', amount: '$2,800.00', issueDate: '2023-08-15', dueDate: '2023-08-25', status: 'Paid' },
    ];
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            case 'Overdue': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Invoice Management</h2>
            </div>
            
            <div className="mb-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by invoice or booking ID..." 
                        className="pl-10 pr-4 py-2 w-full max-w-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Invoice ID</th>
                            <th scope="col" className="px-6 py-3">Booking ID</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Issue Date</th>
                            <th scope="col" className="px-6 py-3">Due Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoicesData.map((invoice) => (
                            <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{invoice.id}</td>
                                <td className="px-6 py-4">{invoice.bookingId}</td>
                                <td className="px-6 py-4">{invoice.amount}</td>
                                <td className="px-6 py-4">{invoice.issueDate}</td>
                                <td className="px-6 py-4">{invoice.dueDate}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex justify-center items-center gap-3">
                                    <button className="text-gray-600 hover:text-gray-800" title="View Details">
                                        <Eye size={18} />
                                    </button>
                                    <button className="text-blue-600 hover:text-blue-800" title="Download PDF">
                                        <Download size={18} />
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

export default InvoicesAdmin;
