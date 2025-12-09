import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import React, { useEffect, useRef } from 'react';

export default function ChatWindow({ messages, onSend, loading = false, currentUserType = 'CUSTOMER' }) {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-red-500 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Hỗ trợ khách hàng</h2>
        <p className="text-sm text-red-100">Chúng tôi sẵn sàng giúp bạn</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderType === currentUserType}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  );
}
