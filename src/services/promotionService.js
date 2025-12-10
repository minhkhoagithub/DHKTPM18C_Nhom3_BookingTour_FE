
const API_ADMIN_BASE_URL = 'http://localhost:8080/promotion';


/**
 * Lấy TẤT CẢ các khuyến mãi.
 * @returns {Promise<Array<object>>} Danh sách các khuyến mãi (PromotionDTOs).
 */
export const getAllPromotions = async () => { 
    if (!API_ADMIN_BASE_URL) {
        throw new Error("Admin API base URL is not configured");
    }
    
    try {
        const url = `${API_ADMIN_BASE_URL}`; 
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        
        const apiResponse = await response.json();
        
        // 🚀 SỬA LỖI: Kiểm tra nếu phản hồi là mảng (List) thì trả về trực tiếp
        if (Array.isArray(apiResponse)) {
             console.log("API returned raw List, returning it.");
             return apiResponse;
        } 
        
        // Nếu không phải mảng, giả định nó là đối tượng ApiResponse có trường data
        if (apiResponse && apiResponse.data) {
             console.log("API returned ApiResponse, returning data field.");
             return apiResponse.data;
        }

        // Trường hợp không tìm thấy dữ liệu
        return [];
        
    } catch (error) {
        console.error(`Failed to fetch all promotions`, error); 
        throw error; 
    }
};


/**
 * Tạo khuyến mãi riêng cho Tour (sử dụng tourId trong params).
 */
export const createForTourPromotion = async (tourId, promoData) => {
    // API: POST http://localhost:8080/promotion/for-tour?tourId={tourId}
    const url = `${API_ADMIN_BASE_URL}/for-tour?tourId=${tourId}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoData),
    });
    
    if (!response.ok) {
        throw new Error(`Failed to create tour-specific promotion: ${response.status}`);
    }
    return response.json();
};

/**
 * Tạo khuyến mãi dùng chung (Global).
 */
export const createGlobalPromotion = async (promoData) => {
    // API: POST http://localhost:8080/promotion/global
    const url = `${API_ADMIN_BASE_URL}/global`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoData),
    });

    if (!response.ok) {
        throw new Error(`Failed to create global promotion: ${response.status}`);
    }
    return response.json();
};


/**
 * Xóa mềm một khuyến mãi (softDelete).
 * API: POST http://localhost:8080/promotion/delete?promotionId={promotionId}
 * @param {string} promotionId ID của khuyến mãi cần xóa.
 * @returns {Promise<void>} 
 */
export const softDeletePromotion = async (promotionId) => { 
    if (!API_ADMIN_BASE_URL) {
        throw new Error("API base URL is not configured");
    }
    if (!promotionId) {
        throw new Error("Promotion ID is required for deletion");
    }

    // Xây dựng URL với promotionId là query parameter
    const url = `${API_ADMIN_BASE_URL}/delete?promotionId=${promotionId}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST', // Backend sử dụng POST
            // Không cần body vì chỉ truyền ID qua params
        });

        // Backend trả về void, nên status mong đợi là 200 (OK) hoặc 204 (No Content)
        if (!response.ok) {
            // Cố gắng đọc lỗi từ backend nếu có
            const errorText = await response.text();
            throw new Error(`Failed to delete promotion: ${response.status} - ${errorText}`);
        }
        
        // Trả về void (không có nội dung)
        return;

    } catch (error) {
        console.error(`Failed to soft delete promotion ID ${promotionId}:`, error);
        throw error;
    }
};