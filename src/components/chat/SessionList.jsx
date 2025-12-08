import React from 'react';

export default function SessionList({ sessions, onSelect, selectedId = null }) {
  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-300 rounded-l-lg shadow-lg overflow-y-auto max-h-96 md:max-h-screen">
      <div className="bg-blue-600 text-white p-4 sticky top-0">
        <h3 className="text-lg font-bold">Danh sách chat</h3>
        <p className="text-sm text-blue-100">{sessions.length} cuộc hội thoại</p>
      </div>

      {sessions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>Không có cuộc hội thoại nào</p>
        </div>
      ) : (
        sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
              selectedId === session.id
                ? 'bg-blue-100 border-l-4 border-l-blue-600'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {session.guestOrCustomerName ?? 'Khách'}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {session.lastMessage || 'Chưa có tin nhắn'}
                </p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                session.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : session.status === 'WAITING'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {session.status}
              </span>
            </div>
            {session.unreadCount > 0 && (
              <div className="mt-2 inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {session.unreadCount} tin mới
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
