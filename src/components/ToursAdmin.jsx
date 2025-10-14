  import React from "react";
// import { Edit, Trash2 } from "react-feather";
import { Edit, Trash2 } from 'lucide-react';

export default function ToursAdmin() {

    const toursData = [
    { id: 'TOUR-001', name: 'Paris Adventure', destination: 'Paris, France', duration: '7 Days', price: '$1,999', status: 'Active' },
    { id: 'TOUR-002', name: 'Tokyo Lights', destination: 'Tokyo, Japan', duration: '10 Days', price: '$3,250', status: 'Active' },
    { id: 'TOUR-003', name: 'Bali Escape', destination: 'Bali, Indonesia', duration: '5 Days', price: '$1,500', status: 'Draft' },
    { id: 'TOUR-004', name: 'Venice Canals', destination: 'Venice, Italy', duration: '6 Days', price: '$2,100', status: 'Active' },
];
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Tour Management</h2>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Add New Tour</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Tour ID</th>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Destination</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {toursData.map((tour) => (
                        <tr key={tour.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{tour.id}</td>
                            <td className="px-6 py-4">{tour.name}</td>
                            <td className="px-6 py-4">{tour.destination}</td>
                            <td className="px-6 py-4">{tour.price}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${tour.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {tour.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                <button className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    )
}