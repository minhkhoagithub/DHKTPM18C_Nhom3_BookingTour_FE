import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react';
import { getAllUsers, addUser, updateUser, deleteUser } from '../../services/userService'; 
import AddUserModal from '../../components/AddUserModal';
import EditUserModal from '../../components/EditUserModal';


const UsersAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    const handleAddUser = async (newUserData) => {
        try {
            await addUser(newUserData); 
            await fetchUsers(); 
        } catch (error) {
            console.error("Failed to add user:", error);
        }
    };
    const handleUpdateUser = async (customerId, updatedUserData) => {
        try {
            await updateUser(customerId, updatedUserData);
            await fetchUsers(); // Tải lại
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };
    const handleDeleteUser = async (customerId) => {
        if (window.confirm(`Bạn có chắc muốn xóa người dùng: ${name}?`)) {
            try {
                await deleteUser(customerId);
                await fetchUsers(); 
            } catch (error) {
                console.error("Failed to delete user:", error);
            }
        }
    };
    const openEditModal = (user) => {
        setCurrentUser(user);
        setIsEditModalOpen(true);
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Loading users...</h2>
            </div>
        );
    }
   
    
    const getRoleClass = (role) => {
        switch (role) {
            case 'Administrator': return 'bg-purple-100 text-purple-800';
            case 'Customer': return 'bg-green-100 text-green-800';
            case 'Tour Guide': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
                >
                    <PlusCircle size={20} />
                    <span>Add New User</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or role..." 
                        className="pl-10 pr-4 py-2 w-full max-w-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">User ID</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Phone</th>
                            <th scope="col" className="px-6 py-3">loyaltyTier</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.customerId} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.customerId}</td>
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.phone}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleClass(user.loyaltyTier)}`}>
                                        {user.loyaltyTier}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex justify-center items-center gap-3">
                                    <button 
                                        onClick={() => openEditModal(user)}
                                        className="text-blue-600 hover:text-blue-800" 
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteUser(user.customerId)}
                                        className="text-red-600 hover:text-red-800" 
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUserAdded={handleAddUser}
            />
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUserUpdated={handleUpdateUser}
                userData={currentUser} 
            />
        </div>
    );
};

export default UsersAdmin;
