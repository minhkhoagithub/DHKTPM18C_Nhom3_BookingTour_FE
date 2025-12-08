import React, { useState } from 'react';
import { Search, AlertCircle, BookOpen, ShoppingCart, Receipt, CreditCard, RotateCcw } from 'lucide-react';

export default function StaffQueryPage() {
  const [queryType, setQueryType] = useState('tour');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queryTypes = [
    { id: 'tour', label: 'Tour', icon: BookOpen, color: 'blue' },
    { id: 'booking', label: 'Booking', icon: ShoppingCart, color: 'green' },
    { id: 'invoice', label: 'Invoice', icon: Receipt, color: 'yellow' },
    { id: 'payment', label: 'Payment', icon: CreditCard, color: 'purple' },
    { id: 'refund', label: 'Refund', icon: RotateCcw, color: 'red' },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchInput.trim()) {
      setError('Vui lòng nhập giá trị tìm kiếm');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // TODO: Gọi API thực tế ở đây
      // const res = await fetch(`/api/staff/query/${queryType}?q=${searchInput}`);
      
      // Dữ liệu mock để demo
      const mockData = {
        tour: {
          id: 'TOUR-001',
          name: 'Tour Hà Nội - Hạ Long 3 Ngày 2 Đêm',
          destination: 'Hạ Long Bay',
          price: 4500000,
          duration: '3 ngày 2 đêm',
          status: 'Active',
          maxParticipants: 20,
          currentParticipants: 15,
        },
        booking: {
          id: 'BK-12345',
          customerName: 'Nguyễn Văn A',
          customerEmail: 'a@example.com',
          tourName: 'Tour Hà Nội - Hạ Long',
          bookingDate: '2025-12-01',
          departureDate: '2025-12-15',
          participants: 2,
          totalPrice: 9000000,
          status: 'Confirmed',
        },
        invoice: {
          id: 'INV-12345',
          bookingId: 'BK-12345',
          customerName: 'Nguyễn Văn A',
          issueDate: '2025-12-01',
          dueDate: '2025-12-08',
          totalAmount: 9000000,
          status: 'Paid',
          items: [
            { description: 'Tour Hà Nội - Hạ Long (2 khách)', quantity: 1, unitPrice: 4500000, total: 9000000 }
          ]
        },
        payment: {
          id: 'PAY-12345',
          invoiceId: 'INV-12345',
          amount: 9000000,
          paymentDate: '2025-12-05',
          method: 'Bank Transfer',
          status: 'Completed',
          reference: 'TRAN123456789',
        },
        refund: {
          id: 'REF-12345',
          bookingId: 'BK-12345',
          amount: 4500000,
          reason: 'Hủy tour do lý do cá nhân',
          status: 'Processing',
          requestDate: '2025-12-10',
          approvedDate: null,
        },
      };

      setResults(mockData[queryType]);
      setLoading(false);
    } catch (err) {
      setError('Lỗi khi tìm kiếm thông tin: ' + err.message);
      setLoading(false);
    }
  };

  const currentType = queryTypes.find(t => t.id === queryType);
  const IconComponent = currentType?.icon;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tra Cứu Thông Tin</h1>
          <p className="text-gray-600">Tìm kiếm và xem chi tiết thông tin Tour, Booking, Invoice, Payment, và Refund</p>
        </div>

        {/* Query Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {queryTypes.map((type) => {
            const TypeIcon = type.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
              green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
              yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100',
              purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
              red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
            };

            return (
              <button
                key={type.id}
                onClick={() => {
                  setQueryType(type.id);
                  setResults(null);
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
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={`Nhập ID hoặc tên ${currentType?.label.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {loading ? 'Đang tìm...' : 'Tìm kiếm'}
            </button>
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

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Result Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <div className="flex items-center gap-3">
                {IconComponent && <IconComponent size={28} />}
                <h2 className="text-2xl font-bold">Thông Tin {currentType?.label}</h2>
              </div>
            </div>

            {/* Result Content */}
            <div className="p-6">
              {queryType === 'tour' && results && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm">Tên Tour</p>
                    <p className="text-xl font-semibold text-gray-800">{results.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Điểm Đến</p>
                    <p className="text-xl font-semibold text-gray-800">{results.destination}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Giá</p>
                    <p className="text-xl font-semibold text-blue-600">{(results.price / 1000000).toFixed(1)}M VND</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Thời Gian</p>
                    <p className="text-xl font-semibold text-gray-800">{results.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Trạng Thái</p>
                    <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {results.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Số Người Tham Gia</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {results.currentParticipants}/{results.maxParticipants}
                    </p>
                  </div>
                </div>
              )}

              {queryType === 'booking' && results && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm">Mã Booking</p>
                    <p className="text-xl font-semibold text-gray-800">{results.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Khách Hàng</p>
                    <p className="text-xl font-semibold text-gray-800">{results.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-lg text-gray-800">{results.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Tour</p>
                    <p className="text-lg text-gray-800">{results.tourName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Ngày Khởi Hành</p>
                    <p className="text-lg font-semibold text-gray-800">{results.departureDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Số Lượng Khách</p>
                    <p className="text-lg font-semibold text-gray-800">{results.participants} người</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Tổng Tiền</p>
                    <p className="text-xl font-semibold text-blue-600">{(results.totalPrice / 1000000).toFixed(1)}M VND</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Trạng Thái</p>
                    <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {results.status}
                    </span>
                  </div>
                </div>
              )}

              {queryType === 'invoice' && results && (
                <div>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-gray-600 text-sm">Mã Invoice</p>
                      <p className="text-xl font-semibold text-gray-800">{results.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Mã Booking</p>
                      <p className="text-lg text-gray-800">{results.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Khách Hàng</p>
                      <p className="text-lg text-gray-800">{results.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Ngày Lập</p>
                      <p className="text-lg text-gray-800">{results.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Trạng Thái</p>
                      <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {results.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Tổng Tiền</p>
                      <p className="text-xl font-semibold text-blue-600">{(results.totalAmount / 1000000).toFixed(1)}M VND</p>
                    </div>
                  </div>

                  {results.items && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-800 mb-3">Chi Tiết Hóa Đơn</h3>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-gray-600">Mô Tả</th>
                            <th className="px-4 py-2 text-right text-gray-600">Số Lượng</th>
                            <th className="px-4 py-2 text-right text-gray-600">Đơn Giá</th>
                            <th className="px-4 py-2 text-right text-gray-600">Thành Tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-200">
                              <td className="px-4 py-2">{item.description}</td>
                              <td className="px-4 py-2 text-right">{item.quantity}</td>
                              <td className="px-4 py-2 text-right">{(item.unitPrice / 1000000).toFixed(1)}M VND</td>
                              <td className="px-4 py-2 text-right font-semibold">{(item.total / 1000000).toFixed(1)}M VND</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {queryType === 'payment' && results && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm">Mã Payment</p>
                    <p className="text-xl font-semibold text-gray-800">{results.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Mã Invoice</p>
                    <p className="text-lg text-gray-800">{results.invoiceId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Số Tiền</p>
                    <p className="text-2xl font-semibold text-blue-600">{(results.amount / 1000000).toFixed(1)}M VND</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phương Thức</p>
                    <p className="text-lg text-gray-800">{results.method}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Ngày Thanh Toán</p>
                    <p className="text-lg text-gray-800">{results.paymentDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Mã Tham Chiếu</p>
                    <p className="text-lg font-mono text-gray-800">{results.reference}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 text-sm mb-2">Trạng Thái</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {results.status}
                    </span>
                  </div>
                </div>
              )}

              {queryType === 'refund' && results && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm">Mã Refund</p>
                    <p className="text-xl font-semibold text-gray-800">{results.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Mã Booking</p>
                    <p className="text-lg text-gray-800">{results.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Số Tiền Hoàn</p>
                    <p className="text-2xl font-semibold text-orange-600">{(results.amount / 1000000).toFixed(1)}M VND</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Lý Do</p>
                    <p className="text-lg text-gray-800">{results.reason}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Ngày Yêu Cầu</p>
                    <p className="text-lg text-gray-800">{results.requestDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Trạng Thái</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      results.status === 'Processing' 
                        ? 'bg-yellow-100 text-yellow-700'
                        : results.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {results.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Results */}
        {!results && !loading && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">Nhập thông tin và nhấn "Tìm kiếm" để xem kết quả</p>
          </div>
        )}
      </div>
    </div>
  );
}
