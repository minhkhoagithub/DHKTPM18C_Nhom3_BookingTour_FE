const API_URL = "http://localhost:8080/api/staff/search";

/**
 * Search Tour by ID
 */
export async function searchTourById(q) {
  try {
    const response = await fetch(`${API_URL}/tours/id?q=${encodeURIComponent(q)}`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ Tour search result:", data);
    return data.data || null;
  } catch (error) {
    console.error("❌ Search tour error:", error);
    throw error;
  }
}

/**
 * Search Tours by Name
 */
export async function searchTourByName(q) {
  try {
    const response = await fetch(`${API_URL}/tours/name?q=${encodeURIComponent(q)}`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ Tours search result:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Search tours error:", error);
    throw error;
  }
}

/**
 * Search Booking
 */
export async function searchBooking(q) {
  try {
    const response = await fetch(`${API_URL}/bookings?q=${encodeURIComponent(q)}`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ Booking search result:", data);
    return data.data || null;
  } catch (error) {
    console.error("❌ Search booking error:", error);
    throw error;
  }
}

/**
 * Search Invoice
 */
export async function searchInvoice(q) {
  try {
    const response = await fetch(`${API_URL}/invoices?q=${encodeURIComponent(q)}`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ Invoice search result:", data);
    return data.data || null;
  } catch (error) {
    console.error("❌ Search invoice error:", error);
    throw error;
  }
}

/**
 * Search Payment
 */
export async function searchPayment(q) {
  try {
    const response = await fetch(`${API_URL}/payments?q=${encodeURIComponent(q)}`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ Payment search result:", data);
    return data.data || null;
  } catch (error) {
    console.error("❌ Search payment error:", error);
    throw error;
  }
}

/**
 * Search Refund
 */
export async function searchRefund(q) {
  try {
    const response = await fetch(`${API_URL}/refunds?q=${encodeURIComponent(q)}`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ Refund search result:", data);
    return data.data || null;
  } catch (error) {
    console.error("❌ Search refund error:", error);
    throw error;
  }
}

/**
 * Get All Data
 */
export async function getAllSearchData() {
  try {
    const response = await fetch(`${API_URL}/all`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ All data loaded:", data);
    return data.data || {};
  } catch (error) {
    console.error("❌ Load all data error:", error);
    throw error;
  }
}

/**
 * Get All Tours
 */
export async function getAllTours() {
  try {
    const response = await fetch(`${API_URL}/tours`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ All tours loaded:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Load all tours error:", error);
    return [];
  }
}

/**
 * Get All Bookings
 */
export async function getAllBookings() {
  try {
    const response = await fetch(`${API_URL}/bookings`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ All bookings loaded:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Load all bookings error:", error);
    return [];
  }
}

/**
 * Get All Invoices
 */
export async function getAllInvoices() {
  try {
    const response = await fetch(`${API_URL}/invoices`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ All invoices loaded:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Load all invoices error:", error);
    return [];
  }
}

/**
 * Get All Payments
 */
export async function getAllPayments() {
  try {
    const response = await fetch(`${API_URL}/payments`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ All payments loaded:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Load all payments error:", error);
    return [];
  }
}

/**
 * Get All Refunds
 */
export async function getAllRefunds() {
  try {
    const response = await fetch(`${API_URL}/refunds`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ All refunds loaded:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Load all refunds error:", error);
    return [];
  }
}

/**
 * Get All Departures
 */
export async function getAllDepartures() {
  try {
    const response = await fetch(`${API_URL}/departures`,{
      headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    console.log("✓ All departures loaded:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Load all departures error:", error);
    return [];
  }
}

/**
 * Load all data in parallel using Promise.all() for better performance
 */
export async function loadAllDataParallel() {
  try {
    console.log("⏳ Loading all data in parallel...");
    const [tours, bookings, invoices, payments, refunds] = await Promise.all([
      getAllTours(),
      getAllBookings(),
      getAllInvoices(),
      getAllPayments(),
      getAllRefunds(),
    ]);

    const result = {
      tours: tours || [],
      bookings: bookings || [],
      invoices: invoices || [],
      payments: payments || [],
      refunds: refunds || [],
    };

    console.log("✓ All data loaded in parallel:", result);
    return result;
  } catch (error) {
    console.error("❌ Load data in parallel error:", error);
    throw error;
  }
}

// ============================================================
//                   📅 DATE BASED SEARCH
// ============================================================

/**
 * Search Bookings by Date
 */
export async function searchBookingsByDate(date) {
  try {
    const response = await fetch(`${API_URL}/bookings/date?date=${date}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Bookings by date:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Search bookings by date error:", error);
    return [];
  }
}

/**
 * Search Bookings by Date Range
 */
export async function searchBookingsByRange(startDate, endDate) {
  try {
    const response = await fetch(`${API_URL}/bookings/range?start=${startDate}&end=${endDate}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Bookings by range:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Search bookings by range error:", error);
    return [];
  }
}

/**
 * Search Invoices by Date
 */
export async function searchInvoicesByDate(date) {
  try {
    const response = await fetch(`${API_URL}/invoices/date?date=${date}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Invoices by date:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Search invoices by date error:", error);
    return [];
  }
}

/**
 * Search Invoices by Date Range
 */
export async function searchInvoicesByRange(startDate, endDate) {
  try {
    const response = await fetch(`${API_URL}/invoices/range?start=${startDate}&end=${endDate}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Invoices by range:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Search invoices by range error:", error);
    return [];
  }
}

/**
 * Search Payments by Date
 */
export async function searchPaymentsByDate(date) {
  try {
    const response = await fetch(`${API_URL}/payments/date?date=${date}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Payments by date:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Search payments by date error:", error);
    return [];
  }
}

/**
 * Search Payments by Date Range
 */
export async function searchPaymentsByRange(startDate, endDate) {
  try {
    const response = await fetch(`${API_URL}/payments/range?start=${startDate}&end=${endDate}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Payments by range:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Search payments by range error:", error);
    return [];
  }
}

/**
 * Search Refunds by Date
 */
export async function searchRefundsByDate(date) {
  try {
    const response = await fetch(`${API_URL}/refunds/date?date=${date}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Refunds by date:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Search refunds by date error:", error);
    return [];
  }
}

/**
 * Search Departures by ID
 */
export async function searchDepartureById(id) {
  try {
    const response = await fetch(`${API_URL}/departures/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Departure by ID:", data);
    return data.data || null;
  } catch (error) {
    console.error("❌ Search departure by ID error:", error);
    return null;
  }
}

/**
 * Search Departures by Date
 */
export async function searchDeparturesByDate(date) {
  try {
    const response = await fetch(`${API_URL}/departures/date?date=${date}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Departures by date:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Search departures by date error:", error);
    return [];
  }
}

/**
 * Search Departures by Date Range
 */
export async function searchDeparturesByRange(startDate, endDate) {
  try {
    const response = await fetch(`${API_URL}/departures/range?start=${startDate}&end=${endDate}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("✓ Departures by range:", data);
    return data.data || [];
  } catch (error) {
    console.error("❌ Search departures by range error:", error);
    return [];
  }
}
