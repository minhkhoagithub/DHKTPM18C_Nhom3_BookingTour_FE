// -------------------------
// POST API SERVICE - FRONTEND
// -------------------------

const API_POST_BASE = "http://localhost:8080/post";

/**
 * Tạo bài viết thuộc 1 tour
 */
export const createPostForTour = async (tourId, postData) => {
  try {
    const response = await fetch(`${API_POST_BASE}/for-tour?tourId=${tourId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (!response.ok) throw new Error("Failed to create post for tour");
    return await response.json();
  } catch (error) {
    console.error("Error createPostForTour:", error);
    throw error;
  }
};

/**
 * Tạo bài viết dùng chung (không thuộc tour)
 */
export const createGlobalPost = async (postData) => {
  try {
    const response = await fetch(`${API_POST_BASE}/global`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (!response.ok) throw new Error("Failed to create global post");
    return await response.json();
  } catch (error) {
    console.error("Error createGlobalPost:", error);
    throw error;
  }
};

/**
 * Cập nhật bài viết
 */
export const updatePost = async (postId, postData) => {
  try {
    const response = await fetch(`${API_POST_BASE}/update?postId=${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (!response.ok) throw new Error("Failed to update post");
    return await response.json();
  } catch (error) {
    console.error("Error updatePost:", error);
    throw error;
  }
};

/**
 * Xóa mềm bài viết
 */
export const deletePost = async (postId) => {
  try {
    const response = await fetch(`${API_POST_BASE}/delete?postId=${postId}`, {
      method: "POST",
    });

    if (!response.ok) throw new Error("Failed to delete post");
    return true;
  } catch (error) {
    console.error("Error deletePost:", error);
    throw error;
  }
};

/**
 * Lấy bài viết theo tour
 */
export const getPostsByTour = async (tourId) => {
  try {
    const response = await fetch(`${API_POST_BASE}/get-by-tour?tourId=${tourId}`);

    if (!response.ok) throw new Error("Failed to fetch posts by tour");
    return await response.json();
  } catch (error) {
    console.error("Error getPostsByTour:", error);
    throw error;
  }
};

 //get post ID
  export async function getPostById(postId) {
  try {
    const res = await fetch(`http://localhost:8080/post/${postId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch post detail");
    }
    return await res.json();
  } catch (err) {
    console.error("Error getPostById:", err);
    throw err;
  }
}
export const getAllPostsAdmin = async () => {
  try {
    const response = await fetch("http://localhost:8080/post/admin/get-all-post");

    if (!response.ok) throw new Error("Failed to fetch admin posts");

    return await response.json();
  } catch (error) {
    console.error("Error getAllPostsAdmin:", error);
    throw error;
  }
};




/**
 * Lấy tất cả bài viết
 */
export const getAllPosts = async () => {
  try {
    const response = await fetch(`${API_POST_BASE}/get-all`);

    if (!response.ok) throw new Error("Failed to fetch all posts");

    const data = await response.json();  
    // console.log("DATA FROM API:", data);  

    return data;
  } catch (error) {
    console.error("Error getAllPosts:", error);
    throw error;
  }
 

  
};

