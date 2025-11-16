// --- Dữ liệu giả lập (Mock Database) ---
// Chúng ta di chuyển dữ liệu cứng từ các component vào đây
import Bali from '../assets/Bali.jpg';
import Paris from '../assets/Paris.jpg';
import Tokyo from '../assets/Tokyo.jpg';
import India from '../assets/India.jpg';
import Venice from '../assets/Venice.jpg';

// Đây là "bảng" tour của chúng ta
const mockTourDatabase = [
    { name: 'Baliya', img: Bali, time: '5 Days - 4 Nights', star: '3 (12 reviews)', price: '69,999', description: 'Trải nghiệm vẻ đẹp kỳ vĩ và văn hóa độc đáo của Bali...' },
    { name: 'Venice', img: Venice, time: '5 Days - 4 Nights', star: '3 (12 reviews)', price: '69,999', description: 'Khám phá thành phố kênh đào lãng mạn Venice...' },
    { name: 'Tokyo', img: Tokyo, time: '5 Days - 4 Nights', star: '3 (12 reviews)', price: '69,999', description: 'Đắm mình trong sự giao thoa giữa truyền thống và hiện đại tại Tokyo...' },
    { name: 'India', img: India, time: '5 Days - 4 Nights', star: '3 (12 reviews)', price: '69,999', description: 'Chiêm ngưỡng vẻ đẹp hùng vĩ của đền Taj Mahal và khám phá văn hóa Ấn Độ...' },
    { name: 'Paris', img: Paris, time: '5 Days - 4 Nights', star: '3 (12 reviews)', price: '69,999', description: 'Khám phá kinh đô ánh sáng Paris với tháp Eiffel và những con đường lãng mạn...' },
    { name: 'Tokyo-2', img: Tokyo, time: '5 Days - 4 Nights', star: '3 (12 reviews)', price: '69,999', description: 'Một chuyến đi khác đến Tokyo...' },
    { name: 'Bali-2', img: Bali, time: '5 Days - 4 Nights', star: '3 (12 reviews)', price: '69,999', description: 'Khám phá thêm về Bali...' },
    { name: 'Paris-2', img: Paris, time: '5 Days - 4 Nights', star: '3 (12 reviews)', price: '69,999', description: 'Trải nghiệm Paris về đêm...' },
];

// -----------------------------------------------------------------
// API LINK
const API_BASE_URL = ''; // 
// -----------------------------------------------------------------


/**
 * Lấy tất cả các tour
 */
export const getAllTours = async () => {
    
    /* --- KHI CÓ API THẬT, BẠN SẼ DÙNG CODE NÀY (BỎ COMMENT RA) ---
    if (!API_BASE_URL) {
        console.error("Vui lòng cung cấp API_BASE_URL trong tourService.js");
        throw new Error("API base URL is not configured");
    }
    try {
        const response = await fetch(`${API_BASE_URL}/tours`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch tours:', error);
        throw error; // Ném lỗi ra để component xử lý
    }
    */

    // --- CODE GIẢ LẬP (ĐỂ TEST) ---
    // (Sau này khi có API thật, bạn hãy xóa đoạn code "new Promise" này đi)
    console.log("Mock API called: getAllTours");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockTourDatabase); // Trả về dữ liệu tĩnh
        }, 500); // Giả lập độ trễ mạng
    });
};

/**
 * Lấy một tour bằng tên (hoặc ID)
 * @param {string} name Tên của tour
 */
export const getTourByName = async (name) => {

    /* --- KHI CÓ API THẬT, BẠN SẼ DÙNG CODE NÀY (BỎ COMMENT RA) ---
    if (!API_BASE_URL) {
        console.error("Vui lòng cung cấp API_BASE_URL trong tourService.js");
        throw new Error("API base URL is not configured");
    }
    try {
        const response = await fetch(`${API_BASE_URL}/tour/${name}`); // Hoặc /tours?name=${name}
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch tour ${name}:`, error);
        throw error;
    }
    */
   
    // --- CODE GIẢ LẬP (ĐỂ TEST) ---
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
export const deleteTour = async (name) => {
    /* --- CODE API THẬT (DELETE) ---
    if (!API_BASE_URL) throw new Error("API base URL is not configured");
    const response = await fetch(`${API_BASE_URL}/tours/${name}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete tour');
    return { success: true };
    */
   
    // --- CODE GIẢ LẬP ---
    console.log(`Mock API called: deleteTour(${name})`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockTourDatabase.findIndex(t => t.name === name);
            if (index !== -1) {
                mockTourDatabase.splice(index, 1); // Xóa 1 phần tử tại vị trí index
                resolve({ success: true });
            } else {
                reject(new Error('Tour not found for deletion'));
            }
        }, 500);
    });
};