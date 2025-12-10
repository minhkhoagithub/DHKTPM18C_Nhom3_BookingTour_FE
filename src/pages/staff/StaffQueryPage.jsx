import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, BookOpen, ShoppingCart, Receipt, CreditCard, RotateCcw, Loader, Plane, Calendar } from 'lucide-react';
import SortableTable from '../../components/staff/SortableTable';
import {
  searchTourById,
  searchTourByName,
  searchBooking,
  searchInvoice,
  searchPayment,
  searchRefund,
  searchDepartureById,
  getAllTours,
  getAllBookings,
  getAllInvoices,
  getAllPayments,
  getAllRefunds,
  searchBookingsByDate,
  searchBookingsByRange,
  searchInvoicesByDate,
  searchInvoicesByRange,
  searchPaymentsByDate,
  searchPaymentsByRange,
  searchRefundsByDate,
  searchDeparturesByDate,
  searchDeparturesByRange
} from '../../services/staffSearchService';

export default function StaffQueryPage() {
  const [queryType, setQueryType] = useState('tour');
  const [searchInput, setSearchInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [searchMode, setSearchMode] = useState('text'); // 'text', 'date', 'range'
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cachedData, setCachedData] = useState({});

  const queryTypes = [
    { id: 'tour', label: 'Tour', icon: BookOpen, color: 'blue' },
    { id: 'booking', label: 'Booking', icon: ShoppingCart, color: 'green' },
    { id: 'invoice', label: 'Invoice', icon: Receipt, color: 'yellow' },
    { id: 'payment', label: 'Payment', icon: CreditCard, color: 'purple' },
    { id: 'refund', label: 'Refund', icon: RotateCcw, color: 'red' },
    { id: 'departure', label: 'Departure', icon: Plane, color: 'indigo' },
  ];

  // Load dữ liệu khi chuyển tab
  useEffect(() => {
    if (searchInput || dateInput || dateRangeStart) return; // Nếu đang search thì không load

    const loadTabData = async () => {
      // Nếu dữ liệu đã cached, dùng ngay không fetch lại
      if (cachedData[queryType]) {
        setResults(cachedData[queryType]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      setResults(null);

      try {
        let data;
        if (queryType === 'tour') {
          data = await getAllTours();
        } else if (queryType === 'booking') {
          data = await getAllBookings();
        } else if (queryType === 'invoice') {
          data = await getAllInvoices();
        } else if (queryType === 'payment') {
          data = await getAllPayments();
        } else if (queryType === 'refund') {
          data = await getAllRefunds();
        } else if (queryType === 'departure') {
          // Fetch departure từ getAllDepartures nếu có, nếu không dùng search dengan empty
          data = [];
        }

        if (data && data.length > 0) {
          // Cache dữ liệu
          setCachedData(prev => ({ ...prev, [queryType]: data }));
          setResults(data);
        } else {
          setResults(null);
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTabData();
  }, [queryType, searchInput, dateInput, dateRangeStart, cachedData]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchInput.trim() && !dateInput && !dateRangeStart) {
      setError('Vui lòng nhập giá trị tìm kiếm');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let data;

      // Tìm kiếm theo khoảng ngày
      if (searchMode === 'range' && dateRangeStart && dateRangeEnd) {
        if (queryType === 'booking') {
          data = await searchBookingsByRange(dateRangeStart, dateRangeEnd);
        } else if (queryType === 'invoice') {
          data = await searchInvoicesByRange(dateRangeStart, dateRangeEnd);
        } else if (queryType === 'payment') {
          data = await searchPaymentsByRange(dateRangeStart, dateRangeEnd);
        } else if (queryType === 'departure') {
          data = await searchDeparturesByRange(dateRangeStart, dateRangeEnd);
        }
      }
      // Tìm kiếm theo ngày
      else if (searchMode === 'date' && dateInput) {
        if (queryType === 'booking') {
          data = await searchBookingsByDate(dateInput);
        } else if (queryType === 'invoice') {
          data = await searchInvoicesByDate(dateInput);
        } else if (queryType === 'payment') {
          data = await searchPaymentsByDate(dateInput);
        } else if (queryType === 'refund') {
          data = await searchRefundsByDate(dateInput);
        } else if (queryType === 'departure') {
          data = await searchDeparturesByDate(dateInput);
        }
      }
      // Tìm kiếm theo text
      else if (searchInput.trim()) {
        if (queryType === 'tour') {
          const byId = await searchTourById(searchInput);
          if (byId) {
            data = [byId];
          } else {
            const byName = await searchTourByName(searchInput);
            data = byName || [];
          }
        } else if (queryType === 'booking') {
          data = await searchBooking(searchInput);
          data = data ? [data] : [];
        } else if (queryType === 'invoice') {
          data = await searchInvoice(searchInput);
          data = data ? [data] : [];
        } else if (queryType === 'payment') {
          data = await searchPayment(searchInput);
          data = data ? [data] : [];
        } else if (queryType === 'refund') {
          data = await searchRefund(searchInput);
          data = data ? [data] : [];
        } else if (queryType === 'departure') {
          data = await searchDepartureById(searchInput);
          data = data ? [data] : [];
        }
      }

      if (!data || data.length === 0) {
        setError(`Không tìm thấy ${queryType} phù hợp`);
        setLoading(false);
        return;
      }

      setResults(data);
      setLoading(false);
    } catch (err) {
      setError('Lỗi khi tìm kiếm: ' + (err.message || 'Vui lòng thử lại'));
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setDateInput('');
    setDateRangeStart('');
    setDateRangeEnd('');
    setSearchMode('text');
    setResults(null);
    setError(null);
    // Hiển thị lại dữ liệu cached của tab hiện tại
    if (cachedData[queryType]) {
      setResults(cachedData[queryType]);
    }
  };

  const currentType = queryTypes.find(t => t.id === queryType);
  const IconComponent = currentType?.icon;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tra Cứu Thông Tin</h1>
          <p className="text-gray-600">Tìm kiếm Tour, Booking, Invoice, Payment, và Refund</p>
        </div>

        {/* Query Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          {queryTypes.map((type) => {
            const TypeIcon = type.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
              green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
              yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100',
              purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
              red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
              indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100',
            };

            return (
              <button
                key={type.id}
                onClick={() => {
                  setQueryType(type.id);
                  setSearchInput('');
                  setError(null);
                }}
                className={`p-4 border-2 rounded-lg transition font-semibold ${
                  queryType === type.id
                    ? colorClasses[type.color].replace('50', '100').replace('200', '300')
                    : colorClasses[type.color]
                }`}
              >
                <TypeIcon size={24} className="mb-2 mx-auto" />
                <div className="text-sm">{type.label}</div>
              </button>
            );
          })}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          {/* Search Mode Selector */}
          {['booking', 'invoice', 'payment', 'refund', 'departure'].includes(queryType) && (
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setSearchMode('text');
                  setDateInput('');
                  setDateRangeStart('');
                  setDateRangeEnd('');
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  searchMode === 'text'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Search size={16} className="inline mr-1" />
                Tìm ID
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchMode('date');
                  setSearchInput('');
                  setDateRangeStart('');
                  setDateRangeEnd('');
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  searchMode === 'date'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Calendar size={16} className="inline mr-1" />
                Theo ngày
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchMode('range');
                  setSearchInput('');
                  setDateInput('');
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  searchMode === 'range'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Calendar size={16} className="inline mr-1" />
                Khoảng ngày
              </button>
            </div>
          )}

          {/* Search Inputs */}
          <div className="flex gap-2 mb-4">
            {searchMode === 'text' && (
              <>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={`Nhập ID ${currentType?.label.toLowerCase()}...`}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {searchMode === 'date' && (
              <>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {searchMode === 'range' && (
              <>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={dateRangeStart}
                    onChange={(e) => setDateRangeStart(e.target.value)}
                    placeholder="Từ ngày"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={dateRangeEnd}
                    onChange={(e) => setDateRangeEnd(e.target.value)}
                    placeholder="Đến ngày"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Đang tìm...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Tìm kiếm
                </>
              )}
            </button>
            {(searchInput || dateInput || dateRangeStart) && (
              <button
                type="button"
                onClick={handleClearSearch}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Xóa
              </button>
            )}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-700">Lỗi</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader size={48} className="text-red-600 animate-spin mb-4" />
            <p className="text-gray-600 font-semibold">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Results - Single Item */}
        {results && results.length === 1 && queryType !== 'tour' && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Kết quả tìm kiếm {currentType?.label}
            </h3>
            <DetailView data={results[0]} type={queryType} />
          </div>
        )}

        {/* Results - Table */}
        {results && (results.length > 1 || queryType === 'tour') && !loading && (
          <SortableTable
            columns={getColumns(queryType)}
            data={results}
            title={`Danh sách ${currentType?.label}`}
          />
        )}

        {/* No Results */}
        {!results && !loading && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-semibold">Không có dữ liệu</p>
            <p className="text-gray-500 text-sm mt-2">Hãy thử tìm kiếm hoặc chuyển sang tab khác</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getColumns(type) {
  const columns = {
    tour: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Tên Tour' },
      { key: 'destination', label: 'Điểm Đến' },
      { key: 'price', label: 'Giá', render: (v) => `${(v / 1000000).toFixed(1)}M VND` },
      { key: 'duration', label: 'Thời Gian' },
      { key: 'status', label: 'Trạng Thái', render: (v) => <StatusBadge status={v} /> },
      { key: 'currentParticipants', label: 'Người Tham Gia' },
    ],
    booking: [
      { key: 'id', label: 'ID' },
      { key: 'tourName', label: 'Tour' },
      { key: 'contactEmail', label: 'Email' },
      { key: 'contactPhone', label: 'Điện Thoại' },
      { key: 'departureDate', label: 'Ngày Khởi Hành' },
      { key: 'bookingDate', label: 'Ngày đặt' },
      { key: 'participants', label: 'Số Khách' },
      { key: 'totalPrice', label: 'Tổng Tiền', render: (v) => `${(v / 1000000).toFixed(1)}M VND` },
      { key: 'status', label: 'Trạng Thái', render: (v) => <StatusBadge status={v} /> },
    ],
    invoice: [
      { key: 'id', label: 'ID' },
      { key: 'bookingId', label: 'Booking ID' },
      { key: 'contactEmail', label: 'Email' },
      { key: 'issueDate', label: 'Ngày Lập' },
      { key: 'totalAmount', label: 'Tổng Tiền', render: (v) => `${(v / 1000000).toFixed(1)}M VND` },
      { key: 'status', label: 'Trạng Thái', render: (v) => <StatusBadge status={v} /> },
    ],
    payment: [
      { key: 'id', label: 'ID' },
      { key: 'invoiceId', label: 'Invoice ID' },
      { key: 'amount', label: 'Số Tiền', render: (v) => `${(v / 1000000).toFixed(1)}M VND` },
      { key: 'method', label: 'Phương Thức' },
      { key: 'paymentDate', label: 'Ngày Thanh Toán' },
      { key: 'reference', label: 'Mã Tham Chiếu' },
      { key: 'status', label: 'Trạng Thái', render: (v) => <StatusBadge status={v} /> },
    ],
    refund: [
      { key: 'id', label: 'ID' },
      { key: 'bookingId', label: 'Booking ID' },
      { key: 'amount', label: 'Số Tiền Hoàn', render: (v) => `${(v / 1000000).toFixed(1)}M VND` },
      { key: 'reason', label: 'Lý Do' },
      { key: 'status', label: 'Trạng Thái', render: (v) => <StatusBadge status={v} /> },
      { key: 'requestDate', label: 'Ngày Yêu Cầu' },
      { key: 'approvedDate', label: 'Ngày Duyệt' },
    ],
    departure: [
      { key: 'departureId', label: 'ID' },
      { key: 'tourName', label: 'Tour' },
      { key: 'startDate', label: 'Ngày Bắt Đầu' },
      { key: 'endDate', label: 'Ngày Kết Thúc' },
      { key: 'maxCapacity', label: 'Sức Chứa' },
      { key: 'currentCapacity', label: 'Hiện Tại' },
      { key: 'remainingCapacity', label: 'Còn Lại' },
      { key: 'status', label: 'Trạng Thái', render: (v) => <StatusBadge status={v} /> },
      { key: 'totalBookings', label: 'Số Booking' },
    ],
  };

  return columns[type] || [];
}

function StatusBadge({ status }) {
  if (!status) return <span className="text-gray-500">-</span>;

  const statusConfig = {
    // Tour
    'Active': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
    'Full': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    // Booking
    'Confirmed': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    'Completed': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    // Invoice
    'Paid': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    'Unpaid': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    'Overdue': { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
    // Payment
    'Completed': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    'Failed': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    // Refund
    'Processing': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    'Approved': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    'Rejected': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  };

  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
}

function DetailView({ data, type }) {
  const items = Object.entries(data).map(([key, value]) => ({
    label: formatLabel(key),
    value: formatValue(value)
  }));

  return (
    <div className="grid grid-cols-2 gap-6">
      {items.map((item, idx) => (
        <div key={idx}>
          <p className="text-gray-600 text-sm font-semibold">{item.label}</p>
          <p className="text-gray-800 text-lg mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map((word, idx) => {
      if (idx === 0) return word.charAt(0).toUpperCase() + word.slice(1);
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .trim();
}

function formatValue(value) {
  if (value == null) return '-';
  if (typeof value === 'number') {
    if (value % 1 === 0) return value.toLocaleString('vi-VN');
    return value.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
  }
  return String(value);
}
