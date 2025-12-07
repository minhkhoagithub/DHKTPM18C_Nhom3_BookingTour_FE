import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditStaffModal({
  isOpen,
  onClose,
  onStaffUpdated,
  staffData,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (staffData) {
      setName(staffData.name || "");
      setEmail(staffData.email || "");
      setPhone(staffData.phone || "");
      setRole(staffData.role || "");
    }
  }, [staffData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStaffUpdated(staffData.id, { name, email, phone, role });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Staff</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Role</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Driver">Driver</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md mr-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Update Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
