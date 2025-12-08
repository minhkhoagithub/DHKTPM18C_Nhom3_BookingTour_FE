# 🧪 Hướng dẫn Test Chat Functionality

Bạn có **3 cách** để test chức năng chat:

---

## ✅ **Cách 1: Dùng ChatTestPanel (Dễ nhất)**

### Setup

1. **Import component vào AppRouter.jsx:**

```jsx
import ChatTestPage from "./pages/ChatTestPage";

// Thêm route
<Route path="/test-chat" element={<ChatTestPage />} />;
```

2. **Mở browser:**

```
http://localhost:5173/test-chat
```

3. **Bắt đầu test:**
   - Click các button theo thứ tự (1️⃣ → 2️⃣ → 3️⃣...)
   - Xem logs hiển thị kết quả
   - Mỗi test sẽ ghi lại log với timestamp

### Ưu điểm:

✅ UI đẹp, dễ sử dụng
✅ Không cần mở DevTools
✅ Logs hiển thị ngay trong UI
✅ Có hướng dẫn step-by-step

---

## ✅ **Cách 2: Dùng DevTools Console (Nâng cao)**

### Setup

1. Mở browser DevTools (F12)
2. Chuyển sang **Console** tab
3. Copy file `CHAT_TEST_SCRIPT.js` content
4. Paste vào console

### Các lệnh chính:

```javascript
// 1. Kết nối WebSocket
testWebSocketConnection();

// 2. Tạo chat session (Customer)
await testStartChat();

// 3. Xem chat chờ xử lý (Staff)
await testGetWaitingSessions();

// 4. Gửi tin nhắn (Customer)
const sessionId = localStorage.getItem("testSessionId");
await testSendMessage(sessionId, "Hello!");

// 5. Gửi tin nhắn (Staff)
await testStaffSendMessage(sessionId, "Hi there!");

// 6. Xem lịch sử
await testGetHistory(sessionId);

// 7. Chạy toàn bộ flow
await testFullFlow();
```

### Ưu điểm:

✅ Linh hoạt, có thể tùy chỉnh
✅ Kiểm soát chi tiết mỗi bước
✅ Xem raw response từ API

---

## ✅ **Cách 3: Test thực tế (Mở 2 Tab)**

### Setup

1. **Tab 1 - Customer Chat:**

   ```
   http://localhost:5173/customer-chat
   ```

2. **Tab 2 - Staff Chat:**

   ```
   http://localhost:5173/staff/chat
   ```

3. **Mở DevTools ở cả 2 tab** (F12)

### Test Flow:

```
Tab 1 (Customer):
1. Trang tự load chat session
2. Nhập tin nhắn: "Tôi muốn book tour"
3. Nhấn Send
4. Xem console logs

Tab 2 (Staff):
1. Refresh trang
2. Click tab "Chờ xử lý"
3. Nên thấy chat từ customer
4. Click để mở chat
5. Xem tin nhắn từ customer
6. Gửi tin nhắn trả lời
7. Quay lại Tab 1 để thấy reply

Real-time:
- Tin nhắn từ Tab 1 sẽ hiện ở Tab 2 ngay lập tức (via WebSocket)
- Và ngược lại
```

### Ưu điểm:

✅ Test thực tế nhất
✅ Kiểm tra real-time 2 chiều
✅ Kiểm tra UI/UX
✅ Gần nhất với user behavior

---

## 📊 Test Checklist

Dù dùng cách nào, hãy check các điểm này:

### ✅ WebSocket

- [ ] `✓ WebSocket kết nối thành công` - log hiển thị
- [ ] Browser DevTools → Network tab → WS connection là "101 Switching Protocols"

### ✅ Customer Chat

- [ ] `✓ Chat session started`
- [ ] `✓ Chat session created`
- [ ] `✓ Đã subscribe session xxx`
- [ ] Tin nhắn được gửi (HTTP POST `/api/chat/send`)
- [ ] Tin nhắn hiển thị ngay lập tức ở UI

### ✅ Staff Dashboard

- [ ] `✓ Waiting sessions loaded`
- [ ] Nhìn thấy chat từ customer trong danh sách
- [ ] Click → navigate to `/staff/chat/{sessionId}`

### ✅ Staff Chat

- [ ] `✓ Session assigned`
- [ ] Hiển thị lịch sử tin nhắn từ customer
- [ ] Gửi tin nhắn thành công (HTTP POST)
- [ ] Tin nhắn hiển thị trong chat window

### ✅ Real-time (2 Tab)

- [ ] Customer gửi → Staff nhận ngay (via WebSocket)
- [ ] Staff gửi → Customer nhận ngay (via WebSocket)
- [ ] Message bubble styling đúng (phải/trái)
- [ ] Timestamp chính xác

---

## 🐛 Troubleshooting

### Problem: WebSocket Error

```
GET http://localhost:8080/ws-chat 500
```

**Giải pháp:**

- [ ] Kiểm tra backend chạy `http://localhost:8080`
- [ ] Verify WebSocketConfig class có `@EnableWebSocketMessageBroker`
- [ ] Check `/ws-chat` endpoint registered

### Problem: Chat không nhận tin nhắn

```
⚠️ Không có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
```

**Giải pháp:**

- [ ] Check backend `/api/client/chat/start` working
- [ ] Check `connectWebSocket()` success
- [ ] Monitor console for `subscribeToSession` log

### Problem: CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Giải pháp:**

```java
// Backend - WebSocketConfig.java
registry.addEndpoint("/ws-chat")
  .setAllowedOriginPatterns("*")  // ← Check this
  .withSockJS();
```

### Problem: 404 Not Found on API

```
GET http://localhost:8080/api/client/chat/xxx 404
```

**Giải pháp:**

- [ ] Check endpoint URL đúng
- [ ] Check backend route mapping
- [ ] Verify authentication token (nếu cần)

---

## 🎯 Kỳ vọng sau khi test xong

✅ **Console Logs** (DevTools → Console):

```
✓ WebSocket kết nối thành công
✓ Chat session created: xxx
✓ Đã subscribe session xxx
📨 Nhận tin nhắn: {...}
📤 Đã gửi tin nhắn: {...}
✓ Session assigned
```

✅ **Network Requests** (DevTools → Network):

```
ws://localhost:8080/ws-chat (101 Switching Protocols)
POST /api/client/chat/start (200 OK)
POST /api/chat/send (200 OK)
GET /api/staff/chat/sessions/waiting (200 OK)
POST /api/staff/chat/sessions/xxx/assign (200 OK)
```

✅ **UI Display**:

```
Customer Chat:
- Header: "Hỗ trợ khách hàng"
- Message bubbles: phải-trái chính xác
- Input box: active

Staff Dashboard:
- 2 tabs: "Chat của tôi" + "Chờ xử lý"
- Session list: shows customer name, status
- Unread count: badge red

Staff Chat:
- Header: customer name + status
- Messages: from both sides
- Input: active
```

---

## 💡 Tips & Tricks

1. **Save Session ID:**

   ```javascript
   // Sau testStartChat()
   sessionId = localStorage.getItem("testSessionId");
   console.log(sessionId);
   ```

2. **Quick Reset:**

   ```javascript
   localStorage.clear();
   location.reload();
   ```

3. **Monitor WebSocket:**

   ```javascript
   // In console
   console.log(window.stompClient);
   console.log(window.stompClient.connected);
   ```

4. **Fake Message Simulation:**

   ```javascript
   // In console (broadcast to all subscribers)
   stompClient.send(
     "/app/chat/send",
     {},
     JSON.stringify({
       sessionId: "xxx",
       content: "Simulated message",
       senderType: "CUSTOMER",
     })
   );
   ```

5. **Check Browser Storage:**
   - DevTools → Application → LocalStorage
   - Look for: `token`, `userInfo`, `testSessionId`

---

## 📞 Support

Nếu có lỗi:

1. Check console logs (F12 → Console)
2. Check network requests (F12 → Network)
3. Check backend logs
4. Verify WebSocket connection (F12 → Network → WS)
5. Check API endpoints match backend routes

---

**Good luck with testing! 🚀**
