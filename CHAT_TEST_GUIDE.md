# 📚 Hướng dẫn Test Chức năng Chat

## 🔧 Chuẩn bị

### 1. Kiểm tra Backend chạy

```bash
# Backend chạy tại http://localhost:8080
# WebSocket endpoint: ws://localhost:8080/ws-chat
```

### 2. Kiểm tra Frontend chạy

```bash
npm run dev
# Frontend chạy tại http://localhost:5173
```

### 3. Mở DevTools

- F12 → Console tab để xem logs
- Network tab để check requests

---

## 🧪 Test Scenarios

### **SCENARIO 1: Customer Chat (Khách hàng)**

#### Step 1: Truy cập trang Customer Chat

1. Mở browser: `http://localhost:5173/customer-chat`
2. DevTools Console sẽ show logs:
   - `✓ Chat session started`
   - `✓ WebSocket kết nối thành công`
   - `✓ Chat session created`
   - `✓ Đã subscribe session xxx`

#### Step 2: Gửi tin nhắn

1. Nhập text vào input box
2. Nhấn "Send" hoặc Enter
3. DevTools Console sẽ show:
   - `📤 Đã gửi tin nhắn: {...}`
   - Tin nhắn hiển thị ngay lập tức (bubble màu đỏ - bên phải)

#### Step 3: Kiểm tra Network

1. Mở Network tab
2. Gửi tin nhắn
3. Check 2 requests:
   - **WebSocket** (PING/PONG tự động)
   - **HTTP POST** `/api/chat/send` (fallback)

---

### **SCENARIO 2: Staff Dashboard & Chat**

#### Step 2A: Truy cập Staff Dashboard

1. Mở browser: `http://localhost:5173/staff/chat` (giả sử route này)
2. Bạn sẽ thấy 2 tabs:
   - **Chat của tôi** (Danh sách chat đã assign)
   - **Chờ xử lý** (Danh sách chat cần xử lý)

#### Step 2B: Xem Chat Chờ Xử lý

1. Nhấn tab "Chờ xử lý"
2. DevTools Console:
   - `✓ Waiting sessions loaded: [...]`
3. Nên thấy session từ Step 1 (Customer vừa start chat)

#### Step 2C: Assign & Mở Chat

1. Nhấn vào session trong danh sách
2. Tự động assign và navigate sang `/staff/chat/{sessionId}`
3. Nên thấy:
   - Header với tên customer
   - Lịch sử tin nhắn từ customer
   - Input box để gửi tin nhắn

#### Step 2D: Gửi Tin Nhắn từ Staff

1. Nhập tin nhắn (VD: "Xin chào, chúng tôi có thể giúp gì bạn?")
2. Nhấn Send
3. DevTools Console:
   - `📤 Đã gửi tin nhắn: {...}`
4. Tin nhắn hiển thị bubble màu xanh (bên trái)

---

### **SCENARIO 3: Real-time Chat (2 Tab Browser)**

#### Step 3A: Setup

1. **Tab 1**: Mở Customer Chat - `http://localhost:5173/customer-chat`
2. **Tab 2**: Mở Staff Chat - `http://localhost:5173/staff/chat`

#### Step 3B: Test Customer → Staff

1. **Tab 1**: Gửi "Tôi muốn book tour"
2. **Tab 2**: Nên thấy tin nhắn này hiển thị ngay lập tức (bubble xám bên trái)
3. **Tab 2**: Gửi "Được rồi, bạn muốn đi tour nào?"
4. **Tab 1**: Nên thấy tin nhắn này ngay lập tức (bubble đỏ bên phải)

---

## ✅ Checklist Test

### Console Logs Kiểm tra

- [ ] `✓ Chat session started` (Customer)
- [ ] `✓ WebSocket kết nối thành công`
- [ ] `✓ Chat session created` (Customer)
- [ ] `✓ Đã subscribe session xxx`
- [ ] `📨 Nhận tin nhắn: {...}` (khi nhận từ phía kia)
- [ ] `📤 Đã gửi tin nhắn: {...}` (khi gửi)
- [ ] `✓ Waiting sessions loaded` (Staff)
- [ ] `✓ Session assigned` (Staff)

### UI Elements Kiểm tra

- [ ] Message bubble render đúng (phải trái tùy senderType)
- [ ] Input box disabled khi loading
- [ ] Auto scroll to bottom khi có tin nhắn mới
- [ ] Timestamp hiển thị đúng
- [ ] Header shows customer name (Staff)
- [ ] Status badge shows ACTIVE/WAITING
- [ ] Spinner hiển thị khi loading

### Network Kiểm tra

- [ ] WebSocket connection (WS) established
- [ ] POST `/api/chat/send` success
- [ ] POST `/api/client/chat/start` success
- [ ] GET `/api/client/chat/{sessionId}/history` success
- [ ] GET `/api/staff/chat/sessions/waiting` success

---

## 🐛 Troubleshooting

### Problem 1: WebSocket lỗi 500

**Nguyên nhân**: Backend WebSocket endpoint chưa enable hoặc config sai
**Giải pháp**:

```bash
# Check backend logs
# Verify WebSocketConfig có @EnableWebSocketMessageBroker
# Verify registerStompEndpoints("/ws-chat")
```

### Problem 2: Chat không nhận tin nhắn real-time

**Nguyên nhân**: WebSocket disconnect hoặc subscription sai path
**Giải pháp**:

- Check DevTools Console có log "Đã subscribe session xxx"
- Verify topic path: `/topic/chat/{sessionId}`

### Problem 3: Message không xuất hiện

**Nguyên nhân**: Backend không broadcast về FE hoặc listener không active
**Giải pháp**:

```javascript
// Trong console
// Check subscription
console.log(subscription); // Should not be null
```

### Problem 4: CORS Error trên WebSocket

**Nguyên nhân**: Backend CORS config sai
**Giải pháp**:

```java
// Backend WebSocketConfig phải có:
registry.addEndpoint("/ws-chat")
  .setAllowedOriginPatterns("*") // Allow all origins
  .withSockJS();
```

---

## 📝 Manual Test Cases

### Test Case 1: Start Chat

```
Given: User on CustomerChatPage
When: Component mount
Then:
  - Session should be created
  - WebSocket connected
  - History loaded
  - Subscribe active
```

### Test Case 2: Send Message

```
Given: Chat window open với session active
When: User type "Hello" and click Send
Then:
  - Message posted via WebSocket
  - Message appears immediately (local echo)
  - No error in console
```

### Test Case 3: Real-time Receive

```
Given: Two browser tabs open (customer & staff)
When: Staff sends message
Then:
  - Customer tab receives message immediately
  - Message appears in customer chat window
  - Timestamp correct
```

### Test Case 4: Unassign Session

```
Given: Staff viewing chat
When: Click "Kết thúc chat"
Then:
  - Session unassigned
  - Navigate back to dashboard
  - Chat moves back to "Chờ xử lý" tab
```

---

## 🎯 Expected Behavior Summary

| Action               | Expected Result               | Status |
| -------------------- | ----------------------------- | ------ |
| Customer open chat   | Session created, WS connected | ✓      |
| Customer send msg    | Message sent via WS + HTTP    | ✓      |
| Staff open dashboard | Load waiting sessions         | ✓      |
| Staff assign chat    | Session moved to "My" tab     | ✓      |
| Staff send msg       | Message received real-time    | ✓      |
| Both send msg        | Real-time 2-way chat          | ✓      |
| Staff unassign       | Back to waiting               | ✓      |

---

## 📱 Test URLs

| Feature         | URL                                            | Notes           |
| --------------- | ---------------------------------------------- | --------------- |
| Customer Chat   | `http://localhost:5173/customer-chat`          | Khách hàng chat |
| Staff Dashboard | `http://localhost:5173/staff/chat`             | Danh sách chat  |
| Staff Chat      | `http://localhost:5173/staff/chat/{sessionId}` | Chi tiết chat   |

---

## 💡 Tips

1. **Mở 2 tabs** để test real-time chat
2. **Monitor console** để xem logs và errors
3. **Check Network tab** để verify API calls
4. **Test khi backend chạy** mới, WebSocket mới work
5. **Hard refresh** (Ctrl+Shift+R) nếu có cache issues
6. **Check browser DevTools** → Application → Storage → LocalStorage xem token
