const API_URL = "http://localhost:8080/api/ai";

/**
 * Chat với AI
 */
export async function chatWithAI(message) {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    console.log("✓ AI response:", data);

    if (!response.ok) {
      throw new Error(data.answer || "Lỗi khi chat với AI");
    }

    return data.answer || data;
  } catch (error) {
    console.error("❌ AI chat error:", error);
    throw error;
  }
}
