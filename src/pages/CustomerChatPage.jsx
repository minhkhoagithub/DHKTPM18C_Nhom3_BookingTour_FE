import { useState, useEffect } from "react";
import { getMessages, sendMessage, startChat } from "../services/chatService";
import { connectWebSocket, subscribeToSession, sendMessageViaWebSocket, disconnectWebSocket } from "../services/socket";
import ChatWindow from "../components/chat/ChatWindow";

export default function CustomerChatPage() {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let subscription = null;

  // Khởi tạo chat session
  useEffect(() => {
    initializeChat();
    
    return () => {
      if (subscription) subscription.unsubscribe();
      disconnectWebSocket();
    };
  }, []);

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // 1. Bắt đầu chat session
      const res = await startChat();
      if (!res.data) throw new Error("Failed to start chat");
      
      setSession(res.data);
      console.log("✓ Chat session created:", res.data);

      // 2. Kết nối WebSocket
      await connectWebSocket();

      // 3. Lấy lịch sử tin nhắn
      const historyRes = await getMessages(res.data.id);
      if (historyRes.data) {
        setMessages(historyRes.data);
      }

      // 4. Subscribe để nhận tin nhắn thời gian thực
      subscription = subscribeToSession(res.data.id, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });

      setLoading(false);
    } catch (err) {
      console.error("❌ Initialize chat error:", err);
      setError(err.message || "Không thể bắt đầu chat");
      setLoading(false);
    }
  };

  const handleSend = async (content) => {
    if (!session) return;

    try {
      // Gửi qua WebSocket
      if (sendMessageViaWebSocket) {
        sendMessageViaWebSocket(session.id, content, "CUSTOMER");
      }
      
      // Fallback: Gửi qua HTTP
      await sendMessage(session.id, content);
    } catch (err) {
      console.error("❌ Send message error:", err);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto h-96 md:h-screen md:max-h-[600px]">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center h-full bg-white rounded-lg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-600">Đang kết nối...</p>
            </div>
          </div>
        ) : (
          <ChatWindow 
            messages={messages} 
            onSend={handleSend} 
            loading={loading}
            currentUserType="CUSTOMER"
          />
        )}
      </div>
    </div>
  );
}
