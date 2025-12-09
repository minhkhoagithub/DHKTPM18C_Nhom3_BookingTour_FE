import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from 'lucide-react';
// Import các hàm service (giả định đã được cập nhật để không cần tourId)
// Bạn cần đảm bảo các hàm CRUD khác cũng không cần tourId, hoặc cập nhật logic tương ứng.
import { getAllDepartures , addDeparture, deleteDeparture, updateDeparture} from "../../services/departureService"; 
// Import các component Modal giả định
import EditDepartureModal from "../EditDepartureModal";
import AddDepartureModal from "../AddDepartureModal"; 

/**
 * Component quản lý TẤT CẢ các chuyến khởi hành (Departures).
 * (Không còn nhận props tourId)
 * @returns {JSX.Element}
 */
// 1. XÓA props { tourId }
export default function DeparturesAdmin() { 
    const [departures, setDepartures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentDeparture, setCurrentDeparture] = useState(null);

    // Hàm fetch danh sách chuyến khởi hành
    const fetchDepartures = async () => {
        // 2. XÓA logic kiểm tra tourId
        
        try {
            // 3. Gọi hàm service mà KHÔNG TRUYỀN tourId
            const data = await getAllDepartures();
            setDepartures(data);
        } catch (error) {
            // Cập nhật thông báo lỗi
            console.error("Failed to fetch all departures:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchDepartures chỉ một lần khi component mount
    // 4. CẬP NHẬT useEffect để không theo dõi tourId
    useEffect(() => {
        fetchDepartures();
    }, []); // Dependency array rỗng ([])

    // --- CRUD Handlers ---

    const handleAddNewDeparture = async (tourId, newDepartureData) => {
    try {
        await addDeparture(tourId, newDepartureData);
        await fetchDepartures();
        setIsAddModalOpen(false);
    } catch (error) {
        console.error("Failed to add departure:", error);
    }
};

    const handleUpdateDeparture = async (departureId, updatedDepartureData) => {
        try {
            await updateDeparture(departureId, updatedDepartureData);
            await fetchDepartures(); 
            setIsEditModalOpen(false); 
        } catch (error) {
            console.error("Failed to update departure:", error);
        }
    };

    const handleDeleteDeparture = async (departureId) => {
        if (window.confirm(`Bạn có chắc muốn xóa chuyến khởi hành: ${departureId}?`)) {
            try {
                await deleteDeparture(departureId);
                await fetchDepartures(); 
            } catch (error) {
                console.error("Failed to delete departure:", error);
            }
        }
    };

    // --- Modal Handlers ---

    const openEditModal = (departure) => {
        setCurrentDeparture(departure); 
        setIsEditModalOpen(true); 
    };

    // --- Render Logic ---

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Loading departure data...</h2>
            </div>
        );
    }
    
    // 6. XÓA logic hiển thị lỗi "Please select a Tour" (vì bây giờ nó quản lý tất cả)
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
                {/* 7. CẬP NHẬT tiêu đề */}
                <h2 className="text-2xl font-bold">All Departures Management</h2>
                 <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Add New Departure
                </button>
            </div>
            
            <div className="overflow-x-auto">
                {/* ... (Phần bảng giữ nguyên) */}
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tour Name</th>
                            <th scope="col" className="px-6 py-3">Start Date</th>
                            <th scope="col" className="px-6 py-3">Seats Available</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>    
                    <tbody>
                        {departures.map((departure, index) => ( 
                            <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{departure.tourName}</td>
                                <td className="px-6 py-4">{new Date(departure.startDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{departure.availableSlots}</td>
                             <td className="px-6 py-4">
                                <span 
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        // Logic điều kiện để xác định class CSS dựa trên trạng thái
                                        departure.status === 'OPEN'
                                            ? 'bg-green-100 text-green-800' // Trạng thái Mở
                                            : departure.status === 'CLOSED'
                                            ? 'bg-gray-100 text-red-800'  // Trạng thái Đóng
                                            : departure.status === 'CANCELLED'
                                            ? 'bg-red-100 text-red-800'   // Trạng thái Hủy
                                            : 'bg-gray-200 text-gray-600' // Trạng thái Mặc định (nếu có lỗi)
                                    }`}
                                >
                                    {departure.status}
                                </span>
                            </td>
                                
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <button 
                                        onClick={() => openEditModal(departure)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteDeparture(departure.departureId)}
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

            {/* Modal thêm chuyến khởi hành */}
            <AddDepartureModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onDepartureAdded={handleAddNewDeparture}
                // 8. XÓA props tourId khỏi modal (hoặc truyền null/undefined nếu modal cần, nhưng tốt nhất là xóa)
                // tourId={tourId} 
            />
            
            {/* Modal chỉnh sửa chuyến khởi hành */}
            <EditDepartureModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onDepartureUpdated={handleUpdateDeparture}
                departureData={currentDeparture} 
                // 9. XÓA props tourId khỏi modal (hoặc truyền null/undefined)
                // tourId={tourId}
            />
            
        </div>
    );
}