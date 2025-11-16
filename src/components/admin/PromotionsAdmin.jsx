import React from 'react';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react';

const PromotionsAdmin = () => {
    // Placeholder data
    const promotionsData = [
        { id: 'PROMO-001', code: 'SUMMER20', discount: '20%', startDate: '2024-06-01', endDate: '2024-08-31', status: 'Active' },
        { id: 'PROMO-002', code: 'WINTERSALE', discount: '$50 Off', startDate: '2023-12-01', endDate: '2024-01-31', status: 'Expired' },
        { id: 'PROMO-003', code: 'NEWUSER', discount: '15%', startDate: '2024-01-01', endDate: '2024-12-31', status: 'Active' },
        { id: 'PROMO-004', code: 'FLASHDEAL', discount: '30%', startDate: '2024-05-20', endDate: '2024-05-20', status: 'Expired' },
        { id: 'PROMO-005', code: 'HOLIDAY', discount: '25%', startDate: '2024-11-15', endDate: '2024-12-25', status: 'Scheduled' },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Expired': return 'bg-gray-100 text-gray-800';
            case 'Scheduled': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Promotion Management</h2>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors">
                    <PlusCircle size={20} />
                    <span>Add New Promotion</span>
                </button>
            </div>
            
            {/* Search and Filters */}
            <div className="mb-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by code or status..." 
                        className="pl-10 pr-4 py-2 w-full max-w-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Promo ID</th>
                            <th scope="col" className="px-6 py-3">Code</th>
                            <th scope="col" className="px-6 py-3">Discount</th>
                            <th scope="col" className="px-6 py-3">Start Date</th>
                            <th scope="col" className="px-6 py-3">End Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotionsData.map((promo) => (
                            <tr key={promo.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{promo.id}</td>
                                <td className="px-6 py-4">{promo.code}</td>
                                <td className="px-6 py-4">{promo.discount}</td>
                                <td className="px-6 py-4">{promo.startDate}</td>
                                <td className="px-6 py-4">{promo.endDate}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(promo.status)}`}>
                                        {promo.status}
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

export default PromotionsAdmin;
