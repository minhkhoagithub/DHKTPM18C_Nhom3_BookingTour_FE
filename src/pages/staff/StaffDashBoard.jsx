import { useEffect, useState } from "react";
import { MessageSquare, AlertCircle, Clock, CheckCircle, ArrowLeft, XCircle } from "lucide-react";
import SessionList from "../../components/chat/SessionList";
import StaffChatWindow from "../../components/chat/StaffChatWindow";
import { getStaffSessions, getWaitingSessions, assignSession, unassignSession } from "../../services/chatService";
import { connectWebSocket, disconnectWebSocket } from "../../services/socket";

export default function StaffDashboard() {
  const [sessions, setSessions] = useState([]);
  const [waitingSessions, setWaitingSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [activeTab, setActiveTab] = useState("my");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    initializeDashboard();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      await connectWebSocket();
      loadMySessions();
    } catch (err) {
      console.error("❌ Initialize dashboard error:", err);
      setError(err.message || "Không thể tải dashboard");
      setLoading(false);
    }
  };

  const loadMySessions = async () => {
    try {
      const res = await getStaffSessions();
      setSessions(res.data || []);
      setActiveTab("my");
      setSelectedSessionId(null);
      setLoading(false);
    } catch (err) {
      console.error("❌ Load sessions error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const loadWaitingSessions = async () => {
    try {
      setLoading(true);
      const res = await getWaitingSessions();
      setWaitingSessions(res.data || []);
      setActiveTab("waiting");
      setSelectedSessionId(null);
      setLoading(false);
    } catch (err) {
      console.error("❌ Load waiting sessions error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAcceptSession = async (e, sessionId) => {
    e.stopPropagation();
    setAssigningId(sessionId);
    try {
      await assignSession(sessionId);
      console.log("✓ Session assigned");
      await loadWaitingSessions();
      await loadMySessions();
      setSelectedSessionId(null);
    } catch (err) {
      console.error("❌ Assign error:", err);
      alert("Không thể nhận chat này");
    } finally {
      setAssigningId(null);
    }
  };

  const handleUnassignSession = async (sessionId) => {
    if (window.confirm("Bạn chắc chắn muốn bỏ nhận chat này?")) {
      setAssigningId(sessionId);
      try {
        await unassignSession(sessionId);
        console.log("✓ Session unassigned");
        await loadMySessions();
        await loadWaitingSessions();
        setSelectedSessionId(null);
      } catch (err) {
        console.error("❌ Unassign error:", err);
        alert("Không thể bỏ nhận chat này");
      } finally {
        setAssigningId(null);
      }
    }
  };

  const handleSelectSession = (sessionId) => {
    setSelectedSessionId(sessionId);
  };

  const currentSessions = activeTab === "my" ? sessions : waitingSessions;
  const selectedSession = currentSessions.find(s => s.sessionId === selectedSessionId);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR - SESSION LIST */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 border-b border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={24} />
            <h1 className="text-2xl font-bold">Quản lý Chat</h1>
          </div>
          <p className="text-red-100 text-sm">Hỗ trợ khách hàng trực tuyến</p>
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={loadMySessions}
            className={`flex-1 py-4 px-4 font-semibold text-sm transition relative ${
              activeTab === "my"
                ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare size={18} />
              <span>Chat của tôi</span>
              <span className="ml-1 bg-gray-300 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                {sessions.length}
              </span>
            </div>
          </button>
          <button
            onClick={loadWaitingSessions}
            className={`flex-1 py-4 px-4 font-semibold text-sm transition relative ${
              activeTab === "waiting"
                ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock size={18} />
              <span>Chờ xử lý</span>
              {waitingSessions.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  {waitingSessions.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded flex items-start gap-2">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-700 font-semibold text-sm">Lỗi</p>
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          </div>
        )}

        {/* SESSION LIST */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 flex-1">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-sm font-medium">Đang tải...</p>
          </div>
        ) : currentSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 flex-1 text-center">
            <MessageSquare className="text-gray-300 mb-3" size={40} />
            <p className="text-gray-600 font-medium">
              {activeTab === "my" ? "Không có chat nào" : "Không có chat chờ xử lý"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === "my" ? "Kiểm tra tab 'Chờ xử lý'" : "Tất cả chat đều được xử lý"}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {currentSessions.map((session) => (
              <div
                key={session.sessionId}
                onClick={() => handleSelectSession(session.sessionId)}
                className={`p-4 border-b border-gray-200 transition cursor-pointer ${
                  selectedSessionId === session.sessionId 
                    ? "bg-red-100 border-l-4 border-red-600" 
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {session.guestOrCustomerName || session.guestName || "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-600">{session.customerEmail || session.guestEmail}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${
                    session.status === 'OPEN'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {session.status === 'OPEN' ? 'Mở' : 'Đóng'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{session.lastMessage || "Bắt đầu cuộc chat"}</p>
                
                {/* Nút Nhận chỉ hiển thị ở tab "Chờ xử lý" */}
                {activeTab === "waiting" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptSession(e, session.sessionId);
                    }}
                    disabled={assigningId === session.sessionId}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-semibold transition"
                  >
                    {assigningId === session.sessionId ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang nhận...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Nhận chat
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MAIN CONTENT - CHAT DETAIL */}
      <div className="flex-1 bg-white flex flex-col">
        {selectedSessionId && selectedSession ? (
          <>
            {/* CHAT HEADER */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 border-b border-red-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedSessionId(null)}
                  className="hover:bg-red-500 p-2 rounded-lg transition"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-lg font-bold">{selectedSession.guestOrCustomerName || selectedSession.guestName}</h2>
                  <p className="text-red-100 text-sm">{selectedSession.customerEmail || selectedSession.guestEmail}</p>
                </div>
              </div>
              {activeTab === "my" && (
                <button
                  onClick={() => handleUnassignSession(selectedSessionId)}
                  disabled={assigningId === selectedSessionId}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-400 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                  title="Bỏ nhận chat"
                >
                  {assigningId === selectedSessionId ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Bỏ nhận
                    </>
                  )}
                </button>
              )}
            </div>

            {/* CHAT CONTENT */}
            <div className="flex-1 overflow-hidden">
              <StaffChatWindow sessionId={selectedSessionId} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-200 rounded-full mb-4">
                <MessageSquare className="text-gray-400" size={48} />
              </div>
              <p className="text-gray-600 text-lg font-semibold">Chọn một cuộc hội thoại để bắt đầu</p>
              <p className="text-gray-500 text-sm mt-2">
                {activeTab === "my" 
                  ? "Danh sách các chat bạn đang xử lý" 
                  : "Danh sách các chat đang chờ được xử lý"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
