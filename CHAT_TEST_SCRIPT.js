/**
 * TEST SCRIPT CHO CHAT FUNCTIONALITY
 * Copy-paste các đoạn code này vào DevTools Console để test
 */

// ============================================
// 1. TEST WEBSOCKET CONNECTION
// ============================================
console.log("=== TEST 1: WebSocket Connection ===");
async function testWebSocketConnection() {
  try {
    const { connectWebSocket, isConnected } = await import('/src/services/socket.js');
    await connectWebSocket();
    
    if (isConnected()) {
      console.log("✅ WebSocket connected successfully!");
      return true;
    } else {
      console.log("❌ WebSocket connection failed");
      return false;
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}

// Chạy: testWebSocketConnection()

// ============================================
// 2. TEST START CHAT (CUSTOMER)
// ============================================
console.log("=== TEST 2: Start Chat ===");
async function testStartChat() {
  try {
    const response = await fetch('http://localhost:8080/api/client/chat/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    
    if (data.data && data.data.id) {
      console.log("✅ Chat started! Session ID:", data.data.id);
      localStorage.setItem('testSessionId', data.data.id);
      return data.data.id;
    } else {
      console.log("❌ Failed to start chat:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return null;
  }
}

// Chạy: testStartChat()

// ============================================
// 3. TEST SEND MESSAGE
// ============================================
console.log("=== TEST 3: Send Message ===");
async function testSendMessage(sessionId, message = "Test message") {
  try {
    const response = await fetch('http://localhost:8080/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId,
        content: message,
        senderType: 'CUSTOMER'
      })
    });
    const data = await response.json();
    
    if (data.data) {
      console.log("✅ Message sent successfully!");
      console.log("Response:", data.data);
      return true;
    } else {
      console.log("❌ Failed to send message:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}

// Chạy: 
// const sessionId = localStorage.getItem('testSessionId');
// testSendMessage(sessionId, "Hello from test!")

// ============================================
// 4. TEST GET CHAT HISTORY
// ============================================
console.log("=== TEST 4: Get Chat History ===");
async function testGetHistory(sessionId) {
  try {
    const response = await fetch(`http://localhost:8080/api/client/chat/${sessionId}/history`);
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      console.log(`✅ Got ${data.data.length} messages`);
      console.log("Messages:", data.data);
      return data.data;
    } else {
      console.log("❌ Failed to get history:", data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return [];
  }
}

// Chạy:
// const sessionId = localStorage.getItem('testSessionId');
// testGetHistory(sessionId)

// ============================================
// 5. TEST STAFF WAITING SESSIONS
// ============================================
console.log("=== TEST 5: Get Waiting Sessions (Staff) ===");
async function testGetWaitingSessions() {
  try {
    const response = await fetch('http://localhost:8080/api/staff/chat/sessions/waiting');
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      console.log(`✅ Got ${data.data.length} waiting sessions`);
      console.log("Sessions:", data.data);
      if (data.data.length > 0) {
        localStorage.setItem('testStaffSessionId', data.data[0].id);
        console.log("First session ID saved:", data.data[0].id);
      }
      return data.data;
    } else {
      console.log("❌ Failed to get sessions:", data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return [];
  }
}

// Chạy: testGetWaitingSessions()

// ============================================
// 6. TEST ASSIGN SESSION (STAFF)
// ============================================
console.log("=== TEST 6: Assign Session (Staff) ===");
async function testAssignSession(sessionId) {
  try {
    const response = await fetch(`http://localhost:8080/api/staff/chat/sessions/${sessionId}/assign`, {
      method: 'POST'
    });
    const data = await response.json();
    
    if (data.data) {
      console.log("✅ Session assigned successfully!");
      console.log("Response:", data.data);
      return true;
    } else {
      console.log("❌ Failed to assign:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}

// Chạy:
// const sessionId = localStorage.getItem('testStaffSessionId');
// testAssignSession(sessionId)

// ============================================
// 7. TEST STAFF SEND MESSAGE
// ============================================
console.log("=== TEST 7: Send Message (Staff) ===");
async function testStaffSendMessage(sessionId, message = "Staff response") {
  try {
    const response = await fetch('http://localhost:8080/api/staff/chat/sessions/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId,
        content: message,
        senderType: 'STAFF'
      })
    });
    const data = await response.json();
    
    if (data.data) {
      console.log("✅ Staff message sent!");
      console.log("Response:", data.data);
      return true;
    } else {
      console.log("❌ Failed:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}

// Chạy:
// const sessionId = localStorage.getItem('testStaffSessionId');
// testStaffSendMessage(sessionId, "How can I help?")

// ============================================
// 8. FULL TEST FLOW (RUN SEQUENTIALLY)
// ============================================
console.log("=== TEST 8: Full Flow Test ===");
async function testFullFlow() {
  console.log("🔄 Starting full flow test...\n");
  
  // Step 1: Start chat
  console.log("Step 1: Starting chat...");
  const sessionId = await testStartChat();
  if (!sessionId) {
    console.log("❌ Failed at step 1");
    return;
  }
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 1000));
  
  // Step 2: Send customer message
  console.log("\nStep 2: Sending customer message...");
  await testSendMessage(sessionId, "Hello, I want to book a tour");
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 1000));
  
  // Step 3: Get history
  console.log("\nStep 3: Getting chat history...");
  await testGetHistory(sessionId);
  
  console.log("\n✅ Full flow test completed!");
  console.log(`Session ID for staff: ${sessionId}`);
}

// Chạy: testFullFlow()

// ============================================
// 9. HELPER: LOG CURRENT STORAGE
// ============================================
function logStorage() {
  console.log("=== LocalStorage Data ===");
  console.log("Token:", localStorage.getItem('token'));
  console.log("User Info:", localStorage.getItem('userInfo'));
  console.log("Test Session ID:", localStorage.getItem('testSessionId'));
  console.log("Test Staff Session ID:", localStorage.getItem('testStaffSessionId'));
}

// Chạy: logStorage()

// ============================================
// 10. QUICK START
// ============================================
console.log(`
╔════════════════════════════════════════════╗
║   CHAT FUNCTIONALITY TEST COMMANDS          ║
╚════════════════════════════════════════════╝

🟢 QUICK START:
1. testStartChat()                    // Create chat session
2. testGetWaitingSessions()           // View waiting chats (Staff)
3. testAssignSession(sessionId)       // Assign to staff
4. testSendMessage(sessionId, "msg")  // Send message
5. testGetHistory(sessionId)          // View history

🔵 FULL TEST:
testFullFlow()                        // Run all steps

🔧 UTILITIES:
logStorage()                          // View localStorage
testWebSocketConnection()             // Check WebSocket

📝 NOTES:
- sessionId is auto-saved to localStorage after testStartChat()
- Use localStorage.getItem('testSessionId') to get it
- For staff tests, first call testGetWaitingSessions()
- Monitor Network tab to see HTTP requests
- Monitor Console for WebSocket logs
`);
