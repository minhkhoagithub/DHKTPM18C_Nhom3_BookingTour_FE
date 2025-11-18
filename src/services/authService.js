

// Lấy API_BASE_URL (Giả sử bạn định nghĩa nó ở một nơi)
const API_BASE_URL = 'http://localhost:8080/api'; 

// Hàm xử lý response chuẩn (copy từ tourService.js)
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const apiResponse = await response.json();
    if (apiResponse.success) {
        return apiResponse.data; // Chỉ trả về phần data
    } else {
        throw new Error(apiResponse.message || 'API call was not successful');
    }
};

/**
 * Gọi API login từ AuthController.java
 * @param {string} email
 * @param {string} password
 */
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await handleResponse(response); 

        if (data.token) {

            localStorage.setItem('jwt_token', data.token); 
            
            localStorage.setItem('user_email', data.email);
        }
        
        return data;

    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

/**
 * Xóa token khi logout
 */
export const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    // Chuyển hướng về trang chủ
    window.location.href = '/'; 
};