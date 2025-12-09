import React from 'react';

export default function MessageBubble({ message, isOwn = false, senderName = null }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const displayName = senderName || message.guestOrCustomerName || (isOwn ? 'Tôi' : 'Khách');

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md`}>
        {/* Tên người gửi */}
        {!isOwn && (
          <p className="text-xs text-gray-600 mb-1 px-2 font-semibold">
            {displayName}
          </p>
        )}
        
        {/* Bubble tin nhắn */}
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-red-500 text-white rounded-br-none'
              : 'bg-gray-300 text-gray-800 rounded-bl-none'
          }`}
        >
          <p className="break-words">{message.content}</p>
          <p className={`text-xs mt-1 ${isOwn ? 'text-red-100' : 'text-gray-600'}`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}
