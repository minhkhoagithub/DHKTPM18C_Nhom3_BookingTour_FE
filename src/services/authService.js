const API_URL = "http://localhost:8080/api/auth";

/**
 * LOGIN WITH EMAIL + PASSWORD
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Sai email hoặc mật khẩu");
    }

    // Lưu token
    localStorage.setItem("token", data.data);

    return data.data;
  } catch (error) {
    throw error;
  }
}

/**
 * LOGIN WITH GOOGLE
 */
export async function loginWithGoogle(idToken) {
  try {
    const response = await fetch(`${API_URL}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Google login thất bại");
    }

    // Lưu token
    localStorage.setItem("token", data.data);

    return data.data;
  } catch (error) {
    throw error;
  }
}

/**
 * LOGOUT
 */
export function logout() {
  localStorage.removeItem("token");
}

/**
 * LẤY TOKEN HIỆN TẠI
 */
export function getToken() {
  return localStorage.getItem("token");
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
