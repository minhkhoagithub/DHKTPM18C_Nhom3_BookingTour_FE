// --- Dữ liệu giả lập (Mock Database) ---
let mockUserDatabase = [
    { id: 'USR-001', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', role: 'Administrator' },
    { id: 'USR-002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '987-654-3210', role: 'Customer' },
    { id: 'USR-003', name: 'Peter Jones', email: 'peter.jones@example.com', phone: '555-123-4567', role: 'Customer' },
    { id: 'USR-004', name: 'Mary Johnson', email: 'mary.j@example.com', phone: '444-555-6666', role: 'Tour Guide' },
    { id: 'USR-005', name: 'David Brown', email: 'd.brown@example.com', phone: '222-333-4444', role: 'Customer' },
];

// -----------------------------------------------------------------
const API_BASE_URL = ''; // <-- Điền API của bạn vào đây sau
// -----------------------------------------------------------------


/**
 * Lấy tất cả người dùng
 */
export const getAllUsers = async () => {
    /* --- CODE API THẬT ---
    if (!API_BASE_URL) throw new Error("API base URL is not configured");
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
    }
    */

    // --- CODE GIẢ LẬP ---
    console.log("Mock API called: getAllUsers");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...mockUserDatabase]); // Trả về bản sao
        }, 500); 
    });
};

/**
 * Thêm một người dùng mới (Mô phỏng POST)
 * @param {object} newUser Dữ liệu người dùng mới từ form
 */
export const addUser = async (newUser) => {
    /* --- CODE API THẬT ---
    if (!API_BASE_URL) throw new Error("API base URL is not configured");
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });
        if (!response.ok) throw new Error('Failed to add user');
        return await response.json();
    } catch (error) {
        console.error('Failed to add user:', error);
        throw error;
    }
    */
   
    // --- CODE GIẢ LẬP ---
    console.log("Mock API called: addUser", newUser);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Tạo ID giả lập
            const newId = `USR-${String(mockUserDatabase.length + 1).padStart(3, '0')}`;
            const userToAdd = { ...newUser, id: newId };
            
            mockUserDatabase.unshift(userToAdd);
            resolve(userToAdd); 
        }, 500);
    });
};

/**
 * CẬP NHẬT MỘT USER (Mô phỏng PUT/PATCH)
 * @param {string} id ID của user
 * @param {object} updatedUserData Dữ liệu user đã cập nhật
 */
export const updateUser = async (id, updatedUserData) => {
    /* --- CODE API THẬT (PUT) ---
    if (!API_BASE_URL) throw new Error("API base URL is not configured");
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
    */
   
    // --- CODE GIẢ LẬP ---
    console.log(`Mock API called: updateUser(${id})`, updatedUserData);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockUserDatabase.findIndex(u => u.id === id);
            if (index !== -1) {
                mockUserDatabase[index] = { ...mockUserDatabase[index], ...updatedUserData };
                resolve(mockUserDatabase[index]);
            } else {
                reject(new Error('User not found for update'));
            }
        }, 500);
    });
};

/**
 * XÓA MỘT USER (Mô phỏng DELETE)
 * @param {string} id ID của user cần xóa
 */
export const deleteUser = async (id) => {
    /* --- CODE API THẬT (DELETE) ---
    if (!API_BASE_URL) throw new Error("API base URL is not configured");
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return { success: true };
    */
   
    // --- CODE GIẢ LẬP ---
    console.log(`Mock API called: deleteUser(${id})`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockUserDatabase.findIndex(u => u.id === id);
            if (index !== -1) {
                mockUserDatabase.splice(index, 1);
                resolve({ success: true });
            } else {
                reject(new Error('User not found for deletion'));
            }
        }, 500);
    });
};