import React, { useState } from 'react';
import { startChat, getWaitingSessions, assignSession, sendMessage, sendStaffMessage, getMessages, getStaffSessionMessages } from '../services/chatService';
import { connectWebSocket, isConnected } from '../services/socket';

export default function ChatTestPanel() {
  const [testLog, setTestLog] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    setTestLog(prev => [...prev, { timestamp, message, type }]);
  };

  const clearLogs = () => setTestLog([]);

  const logStyle = (type) => {
    const styles = {
      success: 'text-green-600',
      error: 'text-red-600',
      info: 'text-blue-600',
      warning: 'text-yellow-600'
    };
    return styles[type] || styles.info;
  };

  // Test 1: Kết nối WebSocket
  const testWebSocket = async () => {
    try {
      setLoading(true);
      addLog('Kết nối WebSocket...', 'info');
      await connectWebSocket();
      
      if (isConnected()) {
        addLog('✅ WebSocket kết nối thành công!', 'success');
      } else {
        addLog('❌ WebSocket kết nối thất bại', 'error');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Start Chat
  const testStartChat = async () => {
    try {
      setLoading(true);
      addLog('Bắt đầu chat session...', 'info');
      const res = await startChat();
      
      if (res.data && res.data.id) {
        setSessionId(res.data.id);
        addLog(`✅ Chat session tạo thành công! ID: ${res.data.id}`, 'success');
      } else {
        addLog('❌ Tạo chat thất bại', 'error');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Get Waiting Sessions
  const testWaitingSessions = async () => {
    try {
      setLoading(true);
      addLog('Lấy danh sách chat chờ xử lý...', 'info');
      const res = await getWaitingSessions();
      
      if (res.data && Array.isArray(res.data)) {
        addLog(`✅ Tìm ${res.data.length} session chờ xử lý`, 'success');
        res.data.forEach((session, i) => {
          addLog(`  ${i + 1}. ${session.customerName} (${session.id})`, 'info');
        });
      } else {
        addLog('❌ Lấy danh sách thất bại', 'error');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test 4: Assign Session
  const testAssignSession = async () => {
    if (!sessionId) {
      addLog('⚠️ Vui lòng tạo chat trước (Test Start Chat)', 'warning');
      return;
    }

    try {
      setLoading(true);
      addLog(`Assign session ${sessionId}...`, 'info');
      const res = await assignSession(sessionId);
      
      if (res.data) {
        addLog(`✅ Session assigned thành công!`, 'success');
      } else {
        addLog('❌ Assign thất bại', 'error');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test 5: Send Customer Message
  const testSendCustomerMessage = async () => {
    if (!sessionId) {
      addLog('⚠️ Vui lòng tạo chat trước', 'warning');
      return;
    }

    try {
      setLoading(true);
      const message = `Test message from customer at ${new Date().toLocaleTimeString()}`;
      addLog(`Gửi tin nhắn từ customer: "${message}"...`, 'info');
      const res = await sendMessage(sessionId, message);
      
      if (res.data) {
        addLog(`✅ Tin nhắn gửi thành công!`, 'success');
      } else {
        addLog('❌ Gửi thất bại', 'error');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test 6: Send Staff Message
  const testSendStaffMessage = async () => {
    if (!sessionId) {
      addLog('⚠️ Vui lòng tạo chat trước', 'warning');
      return;
    }

    try {
      setLoading(true);
      const message = `Test message from staff at ${new Date().toLocaleTimeString()}`;
      addLog(`Gửi tin nhắn từ staff: "${message}"...`, 'info');
      const res = await sendStaffMessage(sessionId, message);
      
      if (res.data) {
        addLog(`✅ Tin nhắn staff gửi thành công!`, 'success');
      } else {
        addLog('❌ Gửi thất bại', 'error');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test 7: Get Messages
  const testGetMessages = async () => {
    if (!sessionId) {
      addLog('⚠️ Vui lòng tạo chat trước', 'warning');
      return;
    }

    try {
      setLoading(true);
      addLog('Lấy lịch sử tin nhắn...', 'info');
      const res = await getMessages(sessionId);
      
      if (res.data && Array.isArray(res.data)) {
        addLog(`✅ Lấy ${res.data.length} tin nhắn`, 'success');
        res.data.forEach((msg, i) => {
          addLog(`  ${i + 1}. [${msg.senderType}] ${msg.content}`, 'info');
        });
      } else {
        addLog('❌ Lấy tin nhắn thất bại', 'error');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Test 8: Get Staff Messages
  const testGetStaffMessages = async () => {
    if (!sessionId) {
      addLog('⚠️ Vui lòng tạo chat trước', 'warning');
      return;
    }

    try {
      setLoading(true);
      addLog('Lấy lịch sử tin nhắn (Staff)...', 'info');
      const res = await getStaffSessionMessages(sessionId);
      
      if (res.data && Array.isArray(res.data)) {
        addLog(`✅ Lấy ${res.data.length} tin nhắn`, 'success');
        res.data.forEach((msg, i) => {
          addLog(`  ${i + 1}. [${msg.senderType}] ${msg.content}`, 'info');
        });
      } else {
        addLog('❌ Lấy tin nhắn thất bại', 'error');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🧪 Chat Test Panel</h1>

      {/* Current Session Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-lg">
        <p className="text-sm font-semibold text-gray-700">
          Session ID: <span className="text-blue-600 font-mono">{sessionId || 'Not created'}</span>
        </p>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <button
          onClick={testWebSocket}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          1️⃣ Test WebSocket
        </button>
        <button
          onClick={testStartChat}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          2️⃣ Start Chat (Customer)
        </button>
        <button
          onClick={testWaitingSessions}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          3️⃣ Get Waiting Sessions
        </button>
        <button
          onClick={testAssignSession}
          disabled={loading}
          className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 disabled:bg-gray-400"
        >
          4️⃣ Assign Session (Staff)
        </button>
        <button
          onClick={testSendCustomerMessage}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
        >
          5️⃣ Send Customer Msg
        </button>
        <button
          onClick={testSendStaffMessage}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
        >
          6️⃣ Send Staff Msg
        </button>
        <button
          onClick={testGetMessages}
          disabled={loading}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:bg-gray-400"
        >
          7️⃣ Get Messages (Customer)
        </button>
        <button
          onClick={testGetStaffMessages}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          8️⃣ Get Messages (Staff)
        </button>
        <button
          onClick={clearLogs}
          disabled={loading}
          className="md:col-span-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
        >
          🗑️ Clear Logs
        </button>
      </div>

      {/* Test Logs */}
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto font-mono text-sm">
        {testLog.length === 0 ? (
          <p className="text-gray-500">Chưa có log. Bắt đầu test bằng cách click các button ở trên.</p>
        ) : (
          <div className="space-y-1">
            {testLog.map((log, i) => (
              <div key={i} className={`flex gap-3 ${logStyle(log.type)}`}>
                <span className="text-gray-500 flex-shrink-0">[{log.timestamp}]</span>
                <span className="flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700">
        <h3 className="font-bold mb-2">📖 Hướng dẫn sử dụng:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click <strong>Test WebSocket</strong> trước để kết nối</li>
          <li>Click <strong>Start Chat</strong> để tạo session (lưu lại Session ID)</li>
          <li>Click <strong>Send Customer Msg</strong> để gửi tin nhắn từ customer</li>
          <li>Click <strong>Get Waiting Sessions</strong> để xem chat chờ (phía staff)</li>
          <li>Click <strong>Assign Session</strong> để nhận chat (phía staff)</li>
          <li>Click <strong>Send Staff Msg</strong> để gửi tin nhắn từ staff</li>
          <li>Click <strong>Get Messages</strong> để xem lịch sử chat</li>
        </ol>
      </div>
    </div>
  );
}
