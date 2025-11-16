import React from 'react';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react';

const PricePoliciesAdmin = () => {
    // Placeholder data
    const policiesData = [
        { id: 'POL-001', name: 'Standard Adult', type: 'Per Person', value: '$150', tour: 'All Tours' },
        { id: 'POL-002', name: 'Child Discount', type: 'Percentage', value: '50%', tour: 'All Tours' },
        { id: 'POL-003', name: 'Group Booking (10+)', type: 'Percentage', value: '15%', tour: 'All Tours' },
        { id: 'POL-004', name: 'Paris Summer Special', type: 'Fixed Price', value: '$1,899', tour: 'Paris Adventure' },
        { id: 'POL-005', name: 'Early Bird', type: 'Percentage', value: '10%', tour: 'All Tours' },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Price Policy Management</h2>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors">
                    <PlusCircle size={20} />
                    <span>Add New Policy</span>
                </button>
            </div>
            
            <div className="mb-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by policy name or tour..." 
                        className="pl-10 pr-4 py-2 w-full max-w-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Policy ID</th>
                            <th scope="col" className="px-6 py-3">Policy Name</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Value</th>
                            <th scope="col" className="px-6 py-3">Applied to Tour</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policiesData.map((policy) => (
                            <tr key={policy.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{policy.id}</td>
                                <td className="px-6 py-4">{policy.name}</td>
                                <td className="px-6 py-4">{policy.type}</td>
                                <td className="px-6 py-4">{policy.value}</td>
                                <td className="px-6 py-4">{policy.tour}</td>
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

export default PricePoliciesAdmin;
