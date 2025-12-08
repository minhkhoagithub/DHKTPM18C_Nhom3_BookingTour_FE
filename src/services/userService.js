
// -----------------------------------------------------------------
const API_URL = "http://localhost:8080/api/admin/customers";

/**
 * Lấy tất cả người dùng
 */
export const getAllUsers = async () => {
  

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Nếu API cần token, thêm ở đây:
        // "Authorization": `Bearer ${yourToken}`
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch users");
    }

    // Trả về mảng customers
    return result.data;

  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

/**
 * Thêm một người dùng mới (Mô phỏng POST)
 * @param {object} newUser Dữ liệu người dùng mới từ form
 */
export const addUser = async (newUser) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${yourToken}`
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) throw new Error(`Failed to add user: ${response.status}`);

    const result = await response.json();
    return result.data; 
  } catch (error) {
    console.error("Failed to add user:", error);
    throw error;
  }
};



/**
 * CẬP NHẬT MỘT USER (Mô phỏng PUT/PATCH)
 * @param {string} id ID của user
 * @param {object} updatedUserData Dữ liệu user đã cập nhật
 */
/**
 * Cập nhật thông tin một user
 * @param {string} id ID của user
 * @param {object} updatedUserData Dữ liệu user cập nhật
 */
export const updateUser = async (id, updatedUserData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${yourToken}`
      },
      body: JSON.stringify(updatedUserData),
    });

    if (!response.ok) throw new Error(`Failed to update user: ${response.status}`);

    const result = await response.json();
    return result.data; // Trả về user vừa cập nhật
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    throw error;
  }
};
/**
 * Xóa một user
 * @param {string} id ID của user cần xóa
 */
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${yourToken}`
      },
    });

    if (!response.ok) throw new Error(`Failed to delete user: ${response.status}`);

    const result = await response.json();
    return result.success; // Trả về true/false
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    throw error;
  }
};