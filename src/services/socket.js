import { Client } from '@stomp/stompjs';

let stompClient = null;

/**
 * Kết nối WebSocket sử dụng @stomp/stompjs
 */
export function connectWebSocket(token = null) {
  return new Promise((resolve, reject) => {
    if (stompClient && stompClient.connected) {
      resolve(stompClient);
      return;
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws-chat',
      connectHeaders: headers,
      onConnect: () => resolve(stompClient),
      onStompError: (frame) => reject(frame),
      onWebSocketError: (err) => reject(err)
    });

    stompClient.activate();
  });
}



/**
 * Đăng ký nhận tin nhắn cho session
 */
export function subscribeToSession(sessionId, callback) {
  if (!stompClient || !stompClient.connected) {
    console.warn("⚠️ WebSocket chưa kết nối");
    return null;
  }

  const subscription = stompClient.subscribe(
    `/topic/chat/${sessionId}`,
    (message) => {
      try {
        const msg = JSON.parse(message.body);
        console.log("📨 Nhận tin nhắn:", msg);
        callback(msg);
      } catch (error) {
        console.error("❌ Error parsing message:", error);
      }
    }
  );

  console.log(`✓ Đã subscribe session ${sessionId}`);
  return subscription;
}

/**
 * Gửi tin nhắn qua WebSocket
 */
export function sendMessageViaWebSocket(sessionId, content, senderType = "CUSTOMER") {
  if (!stompClient || !stompClient.connected) {
    console.warn("⚠️ WebSocket chưa kết nối");
    return;
  }

  const message = {
    sessionId,
    content,
    senderType, // CUSTOMER hoặc STAFF
    timestamp: new Date().toISOString()
  };

  try {
    stompClient.publish({
      destination: "/app/chat/send",
      body: JSON.stringify(message)
    });
    console.log("📤 Đã gửi tin nhắn:", message);
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
}

/**
 * Ngắt kết nối WebSocket
 */
export function disconnectWebSocket() {
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
    console.log("✓ WebSocket ngắt kết nối");
  }
}

/**
 * Kiểm tra trạng thái kết nối
 */
export function isConnected() {
  return stompClient && stompClient.connected;
}
