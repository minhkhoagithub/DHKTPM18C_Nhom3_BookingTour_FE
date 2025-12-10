const API = "http://localhost:8080/api";

/**
 * CUSTOMER - Bắt đầu chat session
 */
export async function startChat(data) {
  try {
    const response = await fetch(`${API}/client/chat/start`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message
      })
    });
    const result = await response.json();
    console.log("✓ Chat session started:", result);
    return result;
  } catch (error) {
    console.error("❌ Start chat error:", error);
    throw error;
  }
}

/**
 * CUSTOMER - Lấy lịch sử chat
 */
export async function getMessages(sessionId) {
  try {
    const response = await fetch(`${API}/client/chat/${sessionId}/history`);
    const data = await response.json();
    console.log("✓ Messages loaded:", data);
    return data;
  } catch (error) {
    console.error("❌ Get messages error:", error);
    throw error;
  }
}

/**
 * CUSTOMER - Gửi tin nhắn (HTTP fallback)
 */
export async function sendMessage(sessionId, content) {
  try {
    const response = await fetch(`${API}/client/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, content, senderType: "CUSTOMER" })
    });
    const data = await response.json();
    console.log("✓ Message sent:", data);
    return data;
  } catch (error) {
    console.error("❌ Send message error:", error);
    throw error;
  }
}

/**
 * STAFF - Lấy danh sách session đang chờ
 */
export async function getWaitingSessions() {
  try {
    const response = await fetch(`${API}/staff/chat/sessions/waiting`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
    const data = await response.json();
    console.log("✓ Waiting sessions loaded:", data);
    return data;
  } catch (error) {
    console.error("❌ Get waiting sessions error:", error);
    throw error;
  }
}

/**
 * STAFF - Lấy danh sách chat của staff
 */
export async function getStaffSessions() {
  try {
    const response = await fetch(`${API}/staff/chat/sessions/my`,{
      headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    });
    const data = await response.json();
    console.log("✓ Staff sessions loaded:", data);
    return data;
  } catch (error) {
    console.error("❌ Get staff sessions error:", error);
    throw error;
  }
}

/**
 * STAFF - Lấy lịch sử chat
 */
export async function getStaffSessionMessages(sessionId) {
  try {
    const response = await fetch(`${API}/staff/chat/sessions/${sessionId}/history`);
    const data = await response.json();
    console.log("✓ Staff messages loaded:", data);
    return data;
  } catch (error) {
    console.error("❌ Get staff messages error:", error);
    throw error;
  }
}

/**
 * STAFF - Gửi tin nhắn
 */
export async function sendStaffMessage(sessionId, content) {
  try {
    const response = await fetch(`${API}/staff/chat/sessions/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
       },
      body: JSON.stringify({ sessionId, content })
    });
    const data = await response.json();
    console.log("✓ Staff message sent:", data);
    return data;
  } catch (error) {
    console.error("❌ Send staff message error:", error);
    throw error;
  }
}

/**
 * STAFF - Assign session
 */
export async function assignSession(sessionId) {
  try {
    const response = await fetch(`${API}/staff/chat/sessions/${sessionId}/assign`, {
      method: "POST",
      headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
    });
    const data = await response.json();
    console.log("✓ Session assigned:", data);
    return data;
  } catch (error) {
    console.error("❌ Assign session error:", error);
    throw error;
  }
}

/**
 * STAFF - Unassign session
 */
export async function unassignSession(sessionId) {
  try {
    const response = await fetch(`${API}/staff/chat/sessions/${sessionId}/unassign`, {
      method: "POST",
      headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
    });
    const data = await response.json();
    console.log("✓ Session unassigned:", data);
    return data;
  } catch (error) {
    console.error("❌ Unassign session error:", error);
    throw error;
  }
}
