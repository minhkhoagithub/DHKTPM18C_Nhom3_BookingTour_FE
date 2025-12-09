// Lấy danh sách yêu thích
export function getFavList(userId) {
  if (!userId) return [];
  const key = `favoriteTours_${userId}`;
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : [];
}

// Lưu danh sách yêu thích
export function saveFavList(userId, list) {
  if (!userId) return;
  const key = `favoriteTours_${userId}`;
  localStorage.setItem(key, JSON.stringify(list));
}

// Kiểm tra 1 tour có được yêu thích không
export function isFavorite(userId, tourId) {
  const list = getFavList(userId);
  return list.includes(tourId);
}
