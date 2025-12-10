const API_BASE_URL = 'http://localhost:8080/';


const request = async (endpoint, { method = 'GET', body, responseType = 'json' } = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `Lỗi HTTP: ${response.status}`);
        }

        if (responseType === 'blob') {
            return await response.blob(); 
        }

        return await response.json(); 

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const getDashboardSummary = async () => {
    return await request('api/admin/statistics/dashboard-summary');
};

export const getRevenueByMonth = async (year) => {
    return await request(`api/admin/statistics/revenue-by-month?year=${year}`);
};

export const getRecentBookings = async () => {
    return await request('api/admin/statistics/recent-bookings');
};

export const downloadRevenueReport = async () => {
    return await request('api/admin/statistics/reports/revenue-pdf', { 
        method: 'GET',
        responseType: 'blob'
    });
};

const adminDashboard = {
    get: (url) => request(url, { method: 'GET' }),
    post: (url, body) => request(url, { method: 'POST', body }),
    put: (url, body) => request(url, { method: 'PUT', body }),
    delete: (url) => request(url, { method: 'DELETE' }),
};

export default adminDashboard;