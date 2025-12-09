// service/departureService.js

// Khai báo lại hoặc import nếu cần, nhưng tốt nhất là nên dùng một file config chung
const API_ADMIN_BASE_URL = 'http://localhost:8080/api/admin/tours'; 
// Lưu ý: Nếu muốn lấy TẤT CẢ departures độc lập, bạn nên đổi BASE URL thành:
// const API_ADMIN_BASE_URL = 'http://localhost:8080/api/admin'; 
// và fetch từ '/departures', nhưng tôi sẽ giữ cấu trúc cũ để dễ thay đổi.


/**
 * Lấy TẤT CẢ các chuyến khởi hành (Departures) (Không lọc theo Tour ID).
 * @returns {Promise<Array<object>>} Danh sách các chuyến khởi hành.
 */
// ĐÃ XÓA tham số tourId ở đây
export const getAllDepartures = async () => { 
    if (!API_ADMIN_BASE_URL) {
        console.error("Vui lòng cung cấp API_ADMIN_BASE_URL trong departureService.js");
        throw new Error("Admin API base URL is not configured");
    }
    
    // ĐÃ XÓA kiểm tra if (!tourId)

    try {
        // Đường dẫn API giả định: http://localhost:8080/api/admin/tours/departures
        // Hoặc bạn có thể dùng 'http://localhost:8080/api/departures' nếu có endpoint riêng.
        const response = await fetch(`${API_ADMIN_BASE_URL}/departures`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        
        const apiResponse = await response.json();
        
        // Giả định dữ liệu thực tế nằm trong trường 'data'
        return apiResponse.data || []; 
        
    } catch (error) {
        // Cập nhật thông báo lỗi để phản ánh việc lấy tất cả
        console.error(`Failed to fetch all departures`, error); 
        throw error; 
    }
};

/**
 * Thêm một chuyến khởi hành mới cho một Tour cụ thể.
 * POST /api/tours/{tourId}/departures
 * @param {string} tourId ID của tour
 * @param {object} newDepartureData Dữ liệu chuyến đi mới
 */
export const addDeparture = async (tourId, newDepartureData) => {
    if (!API_ADMIN_BASE_URL) throw new Error("API base URL is not configured");
    if (!tourId) throw new Error("Tour ID is required to add a departure");

    try {
        const response = await fetch(`${API_ADMIN_BASE_URL}/${tourId}/departures`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newDepartureData),
        });

        if (!response.ok) {
            // Đọc và ném ra lỗi từ backend nếu có
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to add departure: ${response.status}`);
        }
        
        return await response.json(); // Trả về ApiResponse
        
    } catch (error) {
        console.error(`Failed to add departure for Tour ${tourId}:`, error);
        throw error;
    }
};

/**
 * Xóa mềm một chuyến khởi hành (Departure) bằng ID.
 * DELETE /api/admin/tours/departures/{departureId}
 * @param {string} departureId ID của chuyến khởi hành cần xóa.
 */
export const deleteDeparture = async (departureId) => {
    if (!API_ADMIN_BASE_URL) throw new Error("API base URL is not configured");
    if (!departureId) throw new Error("Departure ID is required for deletion");

    // Xây dựng URL: /api/admin/tours/departures/{departureId}
    const url = `${API_ADMIN_BASE_URL}/departures/${departureId}`;
    
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 
                // Thêm Header Authorization nếu cần token
                // 'Authorization': `Bearer ${token}` 
            },
        });

        if (!response.ok) {
            // Đọc và ném ra lỗi từ backend nếu có
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to delete departure: ${response.status}`);
        }
        
        // Trả về ApiResponse chứa thông báo thành công (200/204)
        return await response.json();
        
    } catch (error) {
        console.error(`Failed to delete departure ID ${departureId}:`, error);
        throw error;
    }
};

/**
 * Cập nhật một chuyến khởi hành (Departure) bằng ID.
 * PUT /api/admin/tours/departures/{departureId}
 * @param {string} departureId ID của chuyến khởi hành cần cập nhật.
 * @param {object} updatedData Dữ liệu cập nhật (startDate, endDate, maxCapacity, status).
 * @returns {Promise<object>} DepartureDTO đã cập nhật.
 */
export const updateDeparture = async (departureId, updatedData) => {
    if (!API_ADMIN_BASE_URL) throw new Error("API base URL is not configured");
    if (!departureId) throw new Error("Departure ID is required for update");

    // Xây dựng URL: /api/admin/tours/departures/{departureId}
    const url = `${API_ADMIN_BASE_URL}/departures/${departureId}`;
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                // Thêm Header Authorization nếu cần
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            // Đọc và ném ra lỗi từ backend nếu có
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update departure: ${response.status}`);
        }
        
        // Trả về DepartureDTO đã cập nhật (như định nghĩa trong Controller)
        return await response.json(); 
        
    } catch (error) {
        console.error(`Failed to update departure ID ${departureId}:`, error);
        throw error;
    }
};