const bookingData = {
  departureId: "d0000000-0000-0000-0000-000000000309",
  contactEmail: "tai_khoan_vang_lai@gmail.com",
  contactPhone: "0900112233",
  promotionRef: null,
  passengers: [
    {
      fullName: "Khách Vãng Lai (ADL)",
      type: "ADL",
      birthDate: "1990-01-15",
      gender: "MALE",
      roomSingle: false
    },
    {
      fullName: "Hành Khách 2",
      type: "ADL",
      birthDate: "1995-05-20",
      gender: "FEMALE",
      roomSingle: false
    }
  ]
};



export const createBooking = async (bookingData) => {
    try {
        const response = await fetch("http://localhost:8080/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
        return response.data; // Trả về PaymentResponseDTO
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
