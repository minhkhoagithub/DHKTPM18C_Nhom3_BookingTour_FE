import React, { useState, useEffect, useMemo } from "react";
import { Edit, Trash2, Search, Trash } from "lucide-react";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../../services/userService";

import EditUserModal from "../../components/EditUserModal";
import { useNavigate } from "react-router-dom";

const UsersAdmin = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL"); // ⭐ NEW

  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load customers
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

  // SORT BY NAME (A→Z)
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  // SEARCH + FILTER BY LOYALTY TIER
  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.toLowerCase().trim();

    return sortedUsers.filter((u) => {
      // Tier filter
      const tierMatch =
        tierFilter === "ALL" ||
        (u.loyaltyTier || "").toUpperCase() === tierFilter;

      // Search filter
      const searchMatch =
        u.name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        (u.phone && u.phone.includes(keyword)) ||
        (u.address && u.address.toLowerCase().includes(keyword)) ||
        (u.loyaltyTier && u.loyaltyTier.toLowerCase().includes(keyword));

      return tierMatch && searchMatch;
    });
  }, [searchKeyword, tierFilter, sortedUsers]);

  // UPDATE
  const handleUpdateUser = async (id, updatedUserData) => {
    try {
      await updateUser(id, updatedUserData);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // DELETE (soft delete)
  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa khách hàng: ${name}?`)) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (user) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const getRoleClass = (tier) => {
    switch ((tier || "").toLowerCase()) {
      case "gold":
        return "bg-yellow-100 text-yellow-800";
      case "silver":
        return "bg-gray-200 text-gray-700";
      case "bronze":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading)
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Loading customers...</h2>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Customer Management
        </h2>

        <button
          onClick={() => navigate("/admin/customers/deleted")}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <Trash size={20} />
          <span>Deleted Customers</span>
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* SEARCH REAL-TIME */}
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search by name, email, phone, address..."
            className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-full focus:ring-2"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />

          {/* RESET BUTTON */}
          {searchKeyword.length > 0 && (
            <button
              onClick={() => setSearchKeyword("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 
                         flex items-center justify-center bg-gray-200 hover:bg-gray-300 
                         text-gray-700 rounded-full z-50"
            >
              ✕
            </button>
          )}
        </div>

        {/* LOYALTY TIER FILTER */}
        <select
          className="py-2 px-4 border border-gray-300 rounded-full bg-white focus:ring-2"
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
        >
          <option value="ALL">All Tiers</option>
          <option value="BRONZE">Bronze</option>
          <option value="SILVER">Silver</option>
          <option value="GOLD">Gold</option>
          <option value="GUEST">Guest</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">Loyalty Tier</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.address}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleClass(
                      user.loyaltyTier
                    )}`}
                  >
                    {user.loyaltyTier || "—"}
                  </span>
                </td>

                <td className="px-6 py-4 flex justify-center gap-3">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No matching customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
