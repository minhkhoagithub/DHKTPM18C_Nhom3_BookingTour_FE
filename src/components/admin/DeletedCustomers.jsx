import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, RefreshCcw, Search } from "lucide-react";
import { getDeletedUsers, restoreUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";

const DeletedCustomers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL"); // ⭐ NEW

  // Load deleted customers
  const fetchDeleted = async () => {
    try {
      const data = await getDeletedUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch deleted customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeleted();
  }, []);

  // Restore customer
  const handleRestore = async (id, name) => {
    if (window.confirm(`Khôi phục khách hàng: ${name}?`)) {
      try {
        await restoreUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (err) {
        console.error("Failed to restore customer:", err);
      }
    }
  };

  // SORT A→Z
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  // FILTER + SEARCH
  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.toLowerCase().trim();

    return sortedUsers.filter((u) => {
      // Filter by tier
      const tierMatch =
        tierFilter === "ALL" ||
        (u.loyaltyTier || "").toUpperCase() === tierFilter;

      // Real-time search
      const searchMatch =
        u.name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        (u.phone && u.phone.includes(keyword)) ||
        (u.address && u.address.toLowerCase().includes(keyword));

      return tierMatch && searchMatch;
    });
  }, [searchKeyword, tierFilter, sortedUsers]);

  if (loading)
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Loading deleted customers...</h2>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeft
          size={24}
          className="cursor-pointer"
          onClick={() => navigate("/admin/users")}
        />
        <h2 className="text-2xl font-bold">Deleted Customers</h2>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* SEARCH */}
        <div className="relative w-full sm:w-1/2 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, email, phone, address..."
            className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-full focus:ring-2"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />

          {/* RESET BUTTON */}
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
          <option value="GUEST">Guest</option>
          <option value="BRONZE">Bronze</option>
          <option value="SILVER">Silver</option>
          <option value="GOLD">Gold</option>
          <option value="PLATINUM">Platinum</option>
        </select>
      </div>

      {/* TABLE */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center">Không có kết quả nào.</p>
      ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
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
                  <span className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded-full">
                    {user.loyaltyTier || "—"}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleRestore(user.id, user.name)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-800"
                  >
                    <RefreshCcw size={18} /> Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeletedCustomers;
