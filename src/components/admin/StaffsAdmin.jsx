import React, { useState, useEffect, useMemo } from "react";
import { Edit, Trash2, Search } from "lucide-react";
import {
  getAllStaff,
  updateStaff,
  deleteStaff,
} from "../../services/staffService";
import EditStaffModal from "../../components/EditStaffModal";

const StaffAdmin = () => {
  const [staff, setStaff] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  const fetchStaff = async () => {
    try {
      const data = await getAllStaff();
      setStaff(data);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Sort by name
  const sortedStaff = useMemo(() => {
    return [...staff].sort((a, b) => a.name.localeCompare(b.name));
  }, [staff]);

  // Search + filter
  const filteredStaff = useMemo(() => {
    const keyword = searchKeyword.toLowerCase();

    return sortedStaff.filter((s) => {
      const matchRole = roleFilter === "ALL" || s.role === roleFilter;

      const matchText =
        s.name.toLowerCase().includes(keyword) ||
        s.email.toLowerCase().includes(keyword) ||
        (s.phone && s.phone.includes(keyword)) ||
        (s.role && s.role.toLowerCase().includes(keyword));

      return matchRole && matchText;
    });
  }, [searchKeyword, roleFilter, sortedStaff]);

  const openEditModal = (staff) => {
    setCurrentStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleUpdateStaff = async (id, updatedStaff) => {
    try {
      await updateStaff(id, updatedStaff);
      fetchStaff();
    } catch (err) {
      console.error("Failed to update staff:", err);
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (window.confirm(`Delete staff: ${name}?`)) {
      try {
        await deleteStaff(id);
        setStaff((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        console.error("Failed to delete staff:", err);
      }
    }
  };

  if (loading)
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Loading staff...</h2>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Staff Management</h2>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            className="pl-10 pr-10 py-2 w-full border rounded-full"
            placeholder="Search staff..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />

          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Role Filter */}
        <select
          className="py-2 px-4 border rounded-full bg-white"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="Manager">Manager</option>
          <option value="Staff">Staff</option>
          <option value="Cleaner">Cleaner</option>
          <option value="Driver">Driver</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStaff.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{s.name}</td>
                <td className="px-6 py-3">{s.email}</td>
                <td className="px-6 py-3">{s.phone}</td>
                <td className="px-6 py-3">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {s.role}
                  </span>
                </td>
                <td className="px-6 py-3 flex justify-center gap-3">
                  <button
                    className="text-blue-600"
                    onClick={() => openEditModal(s)}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    className="text-red-600"
                    onClick={() => handleDeleteStaff(s.id, s.name)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredStaff.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onStaffUpdated={handleUpdateStaff}
        staffData={currentStaff}
      />
    </div>
  );
};

export default StaffAdmin;
