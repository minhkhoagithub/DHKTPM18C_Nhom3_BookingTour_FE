import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function SortableTable({ columns, data, title }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      // Handle null/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Handle numbers
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // Handle strings
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, 'vi');
        return sortConfig.direction === 'asc' ? cmp : -cmp;
      }

      // Default comparison
      return sortConfig.direction === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return sorted;
  }, [data, sortConfig]);

  const handleSort = (columnKey) => {
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      {title && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Headers */}
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition select-none"
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {sortConfig.key === col.key && (
                      <span className="text-red-600">
                        {sortConfig.direction === 'asc' ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-800">
                      {col.render
                        ? col.render(row[col.key], row)
                        : formatValue(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
        Tổng: <strong>{sortedData.length}</strong> bản ghi
      </div>
    </div>
  );
}

function formatValue(value) {
  if (value == null) return '-';
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  if (typeof value === 'number') {
    if (value % 1 === 0) return value.toLocaleString('vi-VN');
    return value.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
  }
  if (typeof value === 'string') return value;
  return String(value);
}
