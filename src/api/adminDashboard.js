// file: src/api/axiosClient.js

const API_BASE_URL = 'http://localhost:8080/';

/**
 * 1. HÀM DÙNG CHUNG (Thay thế thư viện Axios)
 * Hàm này tự động thêm Header và xử lý lỗi
 */
const request = async (endpoint, { method = 'GET', body, responseType = 'json' } = {}) => {
    // Cấu hình headers
    const headers = {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ...' // Thêm token ở đây nếu cần
    };

    // Cấu hình fetch
    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    // Nếu tải file (PDF) thì không được set Content-Type là json cho request (tuỳ backend), 
    // nhưng thường fetch tự xử lý, ta chỉ quan trọng response trả về.
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        // Xử lý kiểu trả về: Blob (File) hoặc JSON (Dữ liệu)
        if (responseType === 'blob') {
            return await response.blob();
        }

        return await response.json();

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

/**
 * 2. CÁC HÀM GỌI API CHO DASHBOARD (Viết trực tiếp tại đây)
 */

// Lấy tổng quan (Summary)
export const getDashboardSummary = async () => {
    return await request('api/admin/statistics/dashboard-summary');
};

// Lấy doanh thu theo tháng
export const getRevenueByMonth = async (year) => {
    return await request(`api/admin/statistics/revenue-by-month?year=${year}`);
};

// Lấy booking gần đây
export const getRecentBookings = async () => {
    return await request('api/admin/statistics/recent-bookings');
};

// Tải báo cáo PDF (quan trọng: set responseType là blob)
export const downloadRevenueReport = async () => {
    return await request('api/admin/statistics/reports/revenue-pdf', { 
        method: 'GET',
        responseType: 'blob' 
    });
};

// 3. EXPORT MẶC ĐỊNH (Nếu các file cũ đang import default axiosClient)
// Giúp code cũ không bị lỗi khi gọi axiosClient.get(...)
const axiosClient = {
    get: (url) => request(url, { method: 'GET' }),
    post: (url, body) => request(url, { method: 'POST', body }),
    put: (url, body) => request(url, { method: 'PUT', body }),
    delete: (url) => request(url, { method: 'DELETE' }),
};

export default axiosClient;