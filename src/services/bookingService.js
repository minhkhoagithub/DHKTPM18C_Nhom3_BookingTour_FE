
const API_URL = "http://localhost:8080/api/admin/bookings";

/**
 * Lấy tất cả booking
 */
export const getAllBookings = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                
            },
        });

        if (!response.ok) throw new Error(`Failed to fetch bookings: ${response.status}`);

        const result = await response.json();

        if (!result.success) throw new Error(result.message || "Failed to fetch bookings");

        return result.data; 
    } catch (error) {
        console.error("Failed to fetch all bookings:", error);
        throw error;
    }
};

/**
 * Lấy chi tiết một booking theo ID
 * @param {string} id UUID của booking
 */
export const getBookingById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) throw new Error(`Failed to fetch booking ${id}: ${response.status}`);

        const result = await response.json();

        if (!result.success) throw new Error(result.message || `Failed to fetch booking ${id}`);

        return result.data; 
    } catch (error) {
        console.error(`Failed to fetch booking ${id}:`, error);
        throw error;
    }
};


export const createBooking = async (bookingData) => {
    try {
        const response = await fetch("http://localhost:8080/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Booking failed:", error);
            throw new Error(error.message || "Booking failed");
        }

        return await response.json();
    } catch (err) {
        console.error("Error creating booking:", err);
        throw err;
    }
};

export const executePayment = async (invoiceId, paymentData) => {
    try {
        // POST /api/bookings/{invoiceId}/pay
        const response = await api.post(
            `http://localhost:8080/api/bookings/${invoiceId}/pay`, 
            paymentData
        );
        console.log("Payment response:", response);
        return response.data; 
        
    } catch (error) {
        // ... (xử lý lỗi)
    }
};

export const cancelBooking = async (invoiceId) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/bookings/invoice/${invoiceId}/cancel`, 
            {
                method: "PUT", // Sử dụng phương thức PUT
                headers: {
                    // Không cần "Content-Type" vì không gửi body
                },
                // Không cần "body"
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Hủy booking thất bại:", error);
            throw new Error(error.message || "Hủy booking thất bại");
        }

        // Trả về BookingResponseDTO (đã cập nhật status: "CANCELLED")
        //
        return await response.json();
    } catch (err) {
        console.error("Lỗi khi hủy booking:", err);
        throw err;
    }
};
