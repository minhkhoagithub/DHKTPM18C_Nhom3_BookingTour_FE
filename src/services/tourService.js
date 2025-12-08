
// API LINK
const API_BASE_URL = 'http://localhost:8080/api/tours'; // 
// -----------------------------------------------------------------



/**
 * Lấy tất cả các tour
 */
    export const getAllTours = async () => {
    if (!API_BASE_URL) {
        console.error("Vui lòng cung cấp API_BASE_URL trong tourService.js");
        throw new Error("API base URL is not configured");
    }

    try {
        const response = await fetch(`${API_BASE_URL}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch tours from API:", error);
        throw error; 
    }
};

/**
 * Lấy một tour bằng tên (hoặc ID)
 * @param {string} name Tên của tour
 */
export const getTourByName = async (name) => {

    // (Sau này khi có API thật, bạn hãy xóa đoạn code "new Promise" này đi)
    console.log(`Mock API called: getTourByName(${name})`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const tour = mockTourDatabase.find(t => t.name === name);
            if (tour) {
                resolve(tour);
            } else {
                reject(new Error('Tour not found'));
            }
        }, 300);
    });
};

export const getTourById = async (id) => {
    if (!API_BASE_URL) {
        console.error("Vui lòng cung cấp API_BASE_URL trong tourService.js");
        throw new Error("API base URL is not configured");
    }
    console.log(`Fetching tour with ID: ${id} from API`);
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error(`Failed to fetch tour with ID ${id}:`, error);
        throw error;
    }
};

/**
 * THÊM MỘT TOUR MỚI (Mô phỏng POST)
 * @param {object} newTour Dữ liệu tour mới từ form
 */
export const addTour = async (newTour) => {
    /* --- CODE API THẬT ---
    if (!API_BASE_URL) throw new Error("API base URL is not configured");
    
    // API thật sẽ cần xử lý 'FormData' nếu bạn upload file
    // const formData = new FormData();
    // formData.append('name', newTour.name);
    // ... (thêm các trường khác)
    // formData.append('imageFile', newTour.imageFile); // Giả sử newTour có imageFile
    
    const response = await fetch(`${API_BASE_URL}/tours`, {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' }, // Bỏ header này khi dùng FormData
        // body: JSON.stringify(newTour), // Dùng body này nếu chỉ gửi JSON (không có file)
        body: formData
    });
    if (!response.ok) throw new Error('Failed to add tour');
    return await response.json();
    */
   
    // --- CODE GIẢ LẬP ---
    console.log("Mock API called: addTour", newTour);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Thêm tour mới vào đầu mảng
            mockTourDatabase.unshift(newTour);
            resolve(newTour); // Trả về tour vừa được thêm
        }, 500);
    });
};

/**
 * CẬP NHẬT MỘT TOUR (Mô phỏng PUT/PATCH)
 * @param {string} originalName Tên gốc của tour để tìm
 * @param {object} updatedTourData Dữ liệu tour đã cập nhật
 */
export const updateTour = async (originalName, updatedTourData) => {
    /* --- CODE API THẬT (PUT) ---
    if (!API_BASE_URL) throw new Error("API base URL is not configured");
    const response = await fetch(`${API_BASE_URL}/tours/${originalName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTourData),
    });
    if (!response.ok) throw new Error('Failed to update tour');
    return await response.json();
    */
   
    // --- CODE GIẢ LẬP ---
    console.log(`Mock API called: updateTour(${originalName})`, updatedTourData);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockTourDatabase.findIndex(t => t.name === originalName);
            if (index !== -1) {
                // Hợp nhất dữ liệu cũ với dữ liệu mới
                mockTourDatabase[index] = { ...mockTourDatabase[index], ...updatedTourData };
                resolve(mockTourDatabase[index]);
            } else {
                reject(new Error('Tour not found for update'));
            }
        }, 500);
    });
};

/**
 * XÓA MỘT TOUR (Mô phỏng DELETE)
 * @param {string} name Tên của tour cần xóa
 */
const API_URL = "http://localhost:8080/api/admin/tours";

export const deleteTour = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Nếu cần token:
        // "Authorization": `Bearer ${yourToken}`
      },
    });

    if (!response.ok) throw new Error(`Failed to delete tour: ${response.status}`);

    const result = await response.json();
    return result; 
  } catch (error) {
    console.error(`Failed to delete tour ${id}:`, error);
    throw error;
  }
};