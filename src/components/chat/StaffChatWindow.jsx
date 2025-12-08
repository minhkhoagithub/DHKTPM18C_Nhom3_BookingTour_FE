import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { getStaffSessionMessages, sendStaffMessage } from '../../services/chatService';
import { subscribeToSession } from '../../services/socket';

export default function StaffChatWindow({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);
  const loadedRef = useRef(false);
  const pollIntervalRef = useRef(null);

  // Load tin nhắn khi sessionId thay đổi
  useEffect(() => {
    loadedRef.current = false;
    setMessages([]);
    
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    loadChat();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [sessionId]);

  const loadChat = async () => {
    try {
      setLoading(true);
      const res = await getStaffSessionMessages(sessionId);
      const loadedMessages = res.data.messages || [];
      setMessages(loadedMessages);

      // Subscribe to updates
      subscriptionRef.current = subscribeToSession(sessionId, (newMessage) => {
        console.log('📨 Tin nhắn mới từ WebSocket:', newMessage);
        setMessages((prev) => {
          // Kiểm tra duplicate
          const isDuplicate = prev.some(msg => msg.id === newMessage.id);
          if (isDuplicate) return prev;
          return [...prev, newMessage];
        });
      });

      // Polling fallback - reload messages mỗi 3 giây để đảm bảo không miss tin nhắn
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await getStaffSessionMessages(sessionId);
          const newMessages = res.data.messages || [];
          
          // Kiểm tra có tin nhắn mới không
          const hasNewMessages = newMessages.some(
            newMsg => !messages.some(oldMsg => oldMsg.id === newMsg.id)
          );
          
          if (hasNewMessages) {
            console.log('🔄 Polling: Tìm thấy tin nhắn mới');
            setMessages(newMessages);
          }
        } catch (err) {
          console.error('❌ Polling error:', err);
        }
      }, 3000);

      setLoading(false);
    } catch (err) {
      console.error('❌ Load chat error:', err);
      setLoading(false);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const messageContent = inputValue.trim();
    setInputValue('');

    // Tạo tin nhắn tạm thời để hiển thị ngay
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      senderType: 'STAFF',
      timestamp: new Date().toISOString(),
      guestOrCustomerName: 'Bạn'
    };

    // Thêm vào messages ngay lập tức
    setMessages(prev => [...prev, tempMessage]);

    try {
      await sendStaffMessage(sessionId, messageContent);
    } catch (err) {
      console.error('❌ Send message error:', err);
      alert('Không thể gửi tin nhắn');
      setInputValue(messageContent);
      // Xóa tin nhắn tạm thời nếu gửi thất bại
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có tin nhắn nào. Bắt đầu cuộc hội thoại...</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble
              key={msg.id || `msg-${idx}-${msg.timestamp}`}
              message={msg}
              isOwn={msg.senderType === 'STAFF'}
              senderName={msg.guestOrCustomerName}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nhập tin nhắn..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
          >
            <Send size={18} />
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
}
