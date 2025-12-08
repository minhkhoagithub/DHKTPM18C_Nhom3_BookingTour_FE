const API_URL = "http://localhost:8080/api/auth";

/**
 * LOGIN WITH EMAIL + PASSWORD
 */
export async function login(email, password) {
  try {
    // Xoá toàn bộ localStorage trước khi login mới
    localStorage.clear();
    console.log("✓ Đã xoá toàn bộ localStorage cũ");

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    console.log("Login response từ BE:", data);

    if (!response.ok) {
      throw new Error(data.message || "Sai email hoặc mật khẩu");
    }

    // Lưu token
    localStorage.setItem("token", data.data);
    console.log("✓ Token đã lưu:", data.data);

    return data.data;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
}

/**
 * LOGIN WITH GOOGLE
 */
export async function loginWithGoogle(idToken) {
  try {
    // Xoá toàn bộ localStorage trước khi login mới
    localStorage.clear();
    console.log("✓ Đã xoá toàn bộ localStorage cũ");

    const response = await fetch(`${API_URL}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });

    const data = await response.json();

    console.log("Google login response từ BE:", data);

    if (!response.ok) {
      throw new Error(data.message || "Google login thất bại");
    }

    // Lưu token
    localStorage.setItem("token", data.data);
    console.log("✓ Token từ Google đã lưu:", data.data);

    return data.data;
  } catch (error) {
    console.error("❌ Google login error:", error);
    throw error;
  }
}

/**
 * LOGOUT
 */
export function logout() {
  localStorage.clear();
  console.log("✓ Đã xoá toàn bộ localStorage");
}

/**
 * LẤY TOKEN HIỆN TẠI
 */
export function getToken() {
  const token = localStorage.getItem("token");
  console.log("🔑 Token hiện tại:", token ? "Có token" : "Không có token");
  return token;
}

/**
 * LƯU USER INFO
 */
export function setUserInfo(userInfo) {
  if (userInfo) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    console.log("✓ User info đã lưu:", userInfo);
  } else {
    console.warn("⚠️ Không có user info để lưu");
  }
}

/**
 * LẤY USER INFO
 */
export function getUserInfo() {
  const userInfo = localStorage.getItem("userInfo");
  const result = userInfo ? JSON.parse(userInfo) : null;
  console.log("📋 User info từ localStorage:", result);
  return result;
}

/**
 * GỬI REQUEST CÓ KÈM BEARER TOKEN (dùng cho API cần đăng nhập)
 */
export async function authFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json"
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  return response.json();
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const response = await authFetch(`${API_URL}/me`);

  // BE trả về ApiResponse → data nằm trong response.data
  return response.data || null;
}

