// Tạo file mới: src/services/apiClient.js

export const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Lấy header xác thực (JWT Token) từ localStorage.
 */
export const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token'); 
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    return {};
};

/**
 * Xử lý response chuẩn từ API Spring Boot
 */
export const handleResponse = async (response) => {
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