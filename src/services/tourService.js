
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




// Xử lý trước khi thêm tour mới
// Upload Ảnh lên Cloudinary (Tạo Mảng Link)
   export const uploadImages = async (files) => {
  const CLOUD_NAME = "dzwn8lpqf";
  const PRESET_NAME = "ml_default"; // kiểm tra tên preset
  const FOLDER = "tours";

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const uploadPromises = [...files].map(async (file) => {
    const formData = new FormData();
    formData.append("file", file); // bắt buộc là dạng File/Blob
    formData.append("upload_preset", PRESET_NAME);
    formData.append("folder", FOLDER);

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Cloudinary error:", err);
      throw new Error(`Failed to upload: ${file.name}`);
    }

    const data = await res.json();
    return data.secure_url;
  });

  return Promise.all(uploadPromises);
};


/**
 * THÊM MỘT TOUR MỚI (Mô phỏng POST)
 * @param {object} newTour Dữ liệu tour mới từ form
 */
export const addTour = async (newTour) => {
    // --- CODE API THẬT ---
    if (!API_BASE_URL) throw new Error("API base URL is not configured");

    // 1. Lấy mảng URL từ Cloudinary
    console.log("Images received:", newTour.images);
    const imageUrls = await uploadImages(newTour.images);
    
    //  xử lý 'FormData' để upload file
    const formData = new FormData();
    formData.append("name", newTour.name);
    formData.append("description", newTour.description);
    formData.append("location", newTour.location);
    formData.append("basePrice", newTour.basePrice);
    formData.append("durationDays", newTour.durationDays);
    formData.append("durationText", newTour.durationText);
    formData.append("type", newTour.type);
    formData.append("status", newTour.status);
    imageUrls.forEach(url =>  formData.append("images", url))
    
    const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Bỏ header này khi dùng FormData
         body: JSON.stringify({
        ...newTour,
        images: imageUrls
    }) // Dùng body này nếu chỉ gửi JSON (không có file)
        // body: formData
    });
    if (!response.ok) throw new Error('Failed to add tour');
    return await response.json();

};

/**
 * CẬP NHẬT MỘT TOUR (Mô phỏng PUT/PATCH)
 *  @param {string} id id để update
 * @param {object} updatedTourData Dữ liệu tour đã cập nhật
 */
export const updateTour = async (id, updatedTourData) => {
  if (!API_BASE_URL) throw new Error("API base URL is not configured");

  // 1. Upload ảnh mới (nếu có)
  let newImageUrls = [];
  if (updatedTourData.newImageFiles && updatedTourData.newImageFiles.length > 0) {
    newImageUrls = await uploadImages(updatedTourData.newImageFiles);
  }

  // 2. Gộp ảnh cũ + ảnh mới
  const finalImages = [
    ...(updatedTourData.images || []), 
    ...newImageUrls
  ];

  // 3. Gửi PUT lên server
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...updatedTourData,
      images: finalImages,
    })
  });

  if (!response.ok) throw new Error("Failed to update tour");

  return await response.json();
};


/**
 * XÓA MỘT TOUR (Mô phỏng DELETE)
 * @param {string} name Tên của tour cần xóa
 */
const API_URL = "http://localhost:8080/api/tours";

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

/**
 * Lấy danh sách Tour có tên chứa chuỗi tìm kiếm (Frontend filtering).
 * API này gọi getAllTours và lọc ở phía client.
 * @param {string} searchName Chuỗi tìm kiếm tên tour
 * @returns {Promise<Array<object>>} Danh sách các Tour khớp.
 */
export const getTourByNameContains = async (searchName) => {
    if (!API_BASE_URL) {
        console.error("Vui lòng cung cấp API_BASE_URL trong tourService.js");
        throw new Error("API base URL is not configured");
    }

    if (!searchName || searchName.trim() === '') {
        return [];
    }

    const searchUrl = `http://localhost:8080/api/admin/tours/search?name=${encodeURIComponent(searchName)}`; 

    try {
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        
        const apiResponse = await response.json();
        
        // 2. Trả về dữ liệu từ trường 'data' (đã được lọc và ánh xạ DTO ở backend)
        return apiResponse.data || []; 

    } catch (error) {
        console.error("Failed to fetch tours from search API:", error);
        throw error; 
    }
};