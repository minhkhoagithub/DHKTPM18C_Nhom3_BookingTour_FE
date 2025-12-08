import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import ChatWindow from './ChatWindow';
import ChatInitForm from './ChatInitForm';
import { startChat, getMessages, sendMessage } from '../../services/chatService';
import { connectWebSocket, subscribeToSession, sendMessageViaWebSocket } from '../../services/socket';
import { getUserInfo } from '../../services/authService';

const CHAT_SESSION_STORAGE_KEY = 'chat_session_id';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('init'); // 'init' hoặc 'chat'
  let subscription = null;

  // Kiểm tra khi mở chat
  useEffect(() => {
    if (isOpen) {
      checkExistingSession();
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [isOpen]);

  /**
   * Kiểm tra có session cũ trong localStorage hay không
   */
  const checkExistingSession = async () => {
    try {
      const existingSessionId = localStorage.getItem(CHAT_SESSION_STORAGE_KEY);

      if (existingSessionId) {
        // Có session cũ, load lại
        console.log("✓ Có session cũ:", existingSessionId);
        await loadExistingSession(existingSessionId);
      } else {
        // Không có session, kiểm tra xem có user login hay không
        const userInfo = getUserInfo();
        if (userInfo) {
          console.log("✓ User đã login:", userInfo);
          // User đã login, dùng info của user
          await startNewSessionWithUser(userInfo);
        } else {
          console.log("⚠️ Không có session, không có user login");
          // Guest, hiện form điền thông tin
          setStage('init');
          setLoading(false);
        }
      }
    } catch (err) {
      console.error("❌ Error checking session:", err);
      setError(err.message);
      setStage('init');
      setLoading(false);
    }
  };

  /**
   * Load session cũ từ localStorage
   */
  const loadExistingSession = async (sessionId) => {
    try {
      setLoading(true);

      // Kết nối WebSocket
      await connectWebSocket();

      // Lấy lịch sử tin nhắn
      const historyRes = await getMessages(sessionId);
      if (historyRes.data) {
        setMessages(historyRes.data.messages);
      }

      // Subscribe để nhận tin nhắn real-time
      subscription = subscribeToSession(sessionId, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });

      // Lưu session vào state
      setSession({ id: sessionId });
      setStage('chat');
      setError(null);
      setLoading(false);

      console.log("✓ Loaded existing session:", sessionId);
    } catch (err) {
      console.error("❌ Load session error:", err);
      setError(err.message || "Không thể tải session");
      setStage('init');
      setLoading(false);
    }
  };

  /**
   * Bắt đầu chat session mới với user đã login
   */
  const startNewSessionWithUser = async (userInfo) => {
    try {
      setLoading(true);

      // Gửi request startChat (sử dụng email/name của user)
      const res = await startChat({
        name: userInfo.email || userInfo.customerName,
        email: userInfo.email,
        message: 'Xin chào, tôi muốn được hỗ trợ.' // Message mặc định
      });

      if (!res.data || !res.data.sessionId) {
        throw new Error("Failed to start chat");
      }

      // Lưu session ID vào localStorage
      localStorage.setItem(CHAT_SESSION_STORAGE_KEY, res.data.sessionId);
      console.log("✓ Chat session created:", res.data.sessionId);

      // Kết nối WebSocket
      await connectWebSocket();

      // Subscribe
      subscription = subscribeToSession(res.data.sessionId, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });

      // Load lịch sử
      const historyRes = await getMessages(res.data.sessionId);
      if (historyRes.data) {
        setMessages(historyRes.data.messages);
      }

      setSession({ id: res.data.sessionId });
      setStage('chat');
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("❌ Start session error:", err);
      setError(err.message);
      setStage('init');
      setLoading(false);
    }
  };

  /**
   * Submit form khởi tạo chat (Guest)
   */
  const handleInitSubmit = async (formData) => {
    try {
      setLoading(true);

      // Gửi request startChat
      const res = await startChat({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      if (!res.data || !res.data.sessionId) {
        throw new Error("Failed to start chat");
      }

      // Lưu session ID vào localStorage
      localStorage.setItem(CHAT_SESSION_STORAGE_KEY, res.data.sessionId);
      console.log("✓ Chat session created:", res.data.sessionId);

      // Kết nối WebSocket
      await connectWebSocket();

      // Subscribe
      subscription = subscribeToSession(res.data.sessionId, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });

      // Load lịch sử (sẽ có 1 message từ client vừa gửi)
      const historyRes = await getMessages(res.data.sessionId);
      if (historyRes.data) {
        setMessages(historyRes.data.messages);
      }

      setSession({ id: res.data.sessionId });
      setStage('chat');
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("❌ Init submit error:", err);
      setError(err.message || "Không thể bắt đầu chat");
      setLoading(false);
    }
  };

  /**
   * Gửi tin nhắn
   */
  const handleSend = async (content) => {
    if (!session) return;

    try {
      // Gửi qua WebSocket
      sendMessageViaWebSocket(session.id, content, "CUSTOMER");

      // Fallback: Gửi qua HTTP
      await sendMessage(session.id, content);
    } catch (err) {
      console.error("❌ Send message error:", err);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
    }
  };

  /**
   * Đóng chat
   */
  const handleClose = () => {
    setIsOpen(false);
    if (subscription) subscription.unsubscribe();
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center group"
          title="Mở chat"
        >
          <MessageCircle size={24} />
          <span className="absolute bottom-16 right-0 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Chat với chúng tôi
          </span>
        </button>
      )}

      {/* Chat Window - Floating */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-red-500 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Hỗ trợ khách hàng</h3>
              <p className="text-xs text-red-100">Chúng tôi sẵn sàng giúp bạn</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-red-600 p-1 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {error ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      checkExistingSession();
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            ) : loading && stage === 'init' ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mb-2"></div>
                  <p className="text-gray-600 text-sm">Đang kết nối...</p>
                </div>
              </div>
            ) : stage === 'init' ? (
              <div className="flex-1 overflow-y-auto p-4">
                <ChatInitForm onSubmit={handleInitSubmit} loading={loading} />
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
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={handleClose}
        />
      )}
    </>
  );
}
