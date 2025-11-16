import React from 'react';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react';

const DeparturesAdmin = () => {
    // Placeholder data
    const departuresData = [
        { id: 'DEP-001', tourName: 'Paris Adventure', departureDate: '2024-07-10', slots: 20, status: 'Open' },
        { id: 'DEP-002', tourName: 'Tokyo Lights', departureDate: '2024-08-05', slots: 15, status: 'Open' },
        { id: 'DEP-003', tourName: 'Bali Escape', departureDate: '2024-06-15', slots: 12, status: 'Full' },
        { id: 'DEP-004', tourName: 'Venice Canals', departureDate: '2024-09-01', slots: 18, status: 'Open' },
        { id: 'DEP-005', tourName: 'Paris Adventure', departureDate: '2024-05-20', slots: 20, status: 'Departed' },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Open': return 'bg-green-100 text-green-800';
            case 'Full': return 'bg-orange-100 text-orange-800';
            case 'Departed': return 'bg-gray-100 text-gray-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Departure Management</h2>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors">
                    <PlusCircle size={20} />
                    <span>Add New Departure</span>
                </button>
            </div>
            
            <div className="mb-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by tour name..." 
                        className="pl-10 pr-4 py-2 w-full max-w-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Departure ID</th>
                            <th scope="col" className="px-6 py-3">Tour Name</th>
                            <th scope="col" className="px-6 py-3">Departure Date</th>
                            <th scope="col" className="px-6 py-3">Slots Available</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departuresData.map((departure) => (
                            <tr key={departure.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{departure.id}</td>
                                <td className="px-6 py-4">{departure.tourName}</td>
                                <td className="px-6 py-4">{departure.departureDate}</td>
                                <td className="px-6 py-4">{departure.slots}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(departure.status)}`}>
                                        {departure.status}
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

export default DeparturesAdmin;
