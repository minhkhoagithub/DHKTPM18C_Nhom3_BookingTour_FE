import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStaffSessionMessages, sendStaffMessage, unassignSession } from "../../services/chatService";
import { connectWebSocket, subscribeToSession, sendMessageViaWebSocket, disconnectWebSocket } from "../../services/socket";
import StaffChatWindow from "../../components/chat/StaffChatWindow";
import { ArrowLeft } from 'lucide-react';

export default function StaffChatDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const subscriptionRef = useRef(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      loadChat();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [sessionId]);

  const loadChat = async () => {
    try {
      setLoading(true);

      // 1. Kết nối WebSocket nếu chưa kết nối
      await connectWebSocket();

      // 2. Lấy lịch sử tin nhắn
      const res = await getStaffSessionMessages(sessionId);
      if (res.data) {
        setMessages(res.data.messages || res.data);
        // Set session info từ tin nhắn đầu tiên
        const messageList = res.data.messages || res.data;
        if (messageList && messageList.length > 0) {
          setSessionInfo({
            customerName: messageList[0].guestOrCustomerName || messageList[0].customerName || "Khách hàng",
            status: "ACTIVE"
          });
        }
      }

      // 3. Subscribe để nhận tin nhắn thời gian thực
      subscriptionRef.current = subscribeToSession(sessionId, (newMessage) => {
        setMessages(prev => {
          // Kiểm tra xem tin nhắn đã tồn tại không
          const isDuplicate = prev.some(msg => msg.id === newMessage.id);
          if (isDuplicate) {
            return prev;
          }
          return [...prev, newMessage];
        });
      });

      setLoading(false);
    } catch (err) {
      console.error("❌ Load chat error:", err);
      setError(err.message || "Không thể tải chat");
      setLoading(false);
    }
  };

  const handleSend = async (content) => {
  try {
    const ok = sendMessageViaWebSocket(sessionId, content, "STAFF");

    if (!ok) {
      console.warn("WebSocket lỗi → fallback HTTP");
      await sendStaffMessage(sessionId, content);
    }

  } catch (err) {
    console.error("❌ Send message error:", err);
  }
};
;

  const handleUnassign = async () => {
    try {
      await unassignSession(sessionId);
      alert("Đã kết thúc chat");
      navigate("/staff/chat");
    } catch (err) {
      console.error("❌ Unassign error:", err);
      alert("Không thể kết thúc chat");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/staff/dashboard")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>
        <button
          onClick={handleUnassign}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Kết thúc chat
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Đang tải chat...</p>
            </div>
          </div>
        ) : (
          <StaffChatWindow
            messages={messages}
            onSend={handleSend}
            loading={loading}
            sessionInfo={sessionInfo}
          />
        )}
      </div>
    </div>
  );
}
