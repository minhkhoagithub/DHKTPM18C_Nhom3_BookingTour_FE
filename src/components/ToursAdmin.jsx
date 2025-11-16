  import React, { useState, useEffect } from "react";
// import { Edit, Trash2 } from "react-feather";
import { Edit, Trash2 } from 'lucide-react';
import { getAllTours, addTour,deleteTour,updateTour } from "../services/tourService"; 
import EditTourModal from "./EditTourModal";
import AddTourModal from "./AddTourModal"; 

export default function ToursAdmin() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTour, setCurrentTour] = useState(null);
    const fetchTours = async () => {
        try {
            const data = await getAllTours();
            setTours(data);
        } catch (error) {
            console.error("Failed to fetch tours for admin:", error);
        } finally {
            setLoading(false); // Chỉ set false lần đầu
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const handleAddNewTour = async (newTourData) => {
        try {
            await addTour(newTourData); 
            await fetchTours(); 
            setIsModalOpen(false); 
        } catch (error) {
            console.error("Failed to add tour:", error);
        }
    };
    const handleUpdateTour = async (originalName, updatedTourData) => {
        try {
            await updateTour(originalName, updatedTourData);
            await fetchTours();
        } catch (error) {
            console.error("Failed to update tour:", error);
        }
    };
    const handleDeleteTour = async (name) => {
        if (window.confirm(`Bạn có chắc muốn xóa tour: ${name}?`)) {
            try {
                await deleteTour(name);
                await fetchTours(); 
            } catch (error) {
                console.error("Failed to delete tour:", error);
            }
        }
    };
    
 
    const openEditModal = (tour) => {
        setCurrentTour(tour); 
        setIsEditModalOpen(true); 
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Loading tour data...</h2>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Tour Management</h2>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
                Add New Tour
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        {/* <th scope="col" className="px-6 py-3">Tour ID</th> */}
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Duration</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        {/* <th scope="col" className="px-6 py-3">Status</th> */}
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tours.map((tour, index) => (
                        <tr key={index} className="bg-white border-b hover:bg-gray-50">
                            {/* <td className="px-6 py-4 font-medium text-gray-900">{tour.id}</td> */}
                            <td className="px-6 py-4">{tour.name}</td>
                            <td className="px-6 py-4">{tour.time}</td>
                            <td className="px-6 py-4">{tour.price}</td>
                            {/* <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${tour.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {tour.status}
                                </span>
                            </td> */}
                            <td className="px-6 py-4 flex items-center gap-2">
                                <button 
                                    onClick={() => openEditModal(tour)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Edit size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDeleteTour(tour.name)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <AddTourModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onTourAdded={handleAddNewTour}
        />
        <EditTourModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onTourUpdated={handleUpdateTour}
            tourData={currentTour} 
        />
    </div>
    )
}