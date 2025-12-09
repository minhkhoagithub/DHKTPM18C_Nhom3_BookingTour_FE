import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { getAllTours } from "../services/tourService";
import { getCurrentUser } from "../services/authService";
import { getFavList, saveFavList } from "../utils/favoriteUtils";

export default function Favourite() {
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadFavoriteTours = async () => {
    try {
      const user = await getCurrentUser();
      if (!user?.customerId) {
        navigate("/login");
        return;
      }

      setUserId(user.customerId);

      const favIds = getFavList(user.customerId);
      const allTours = await getAllTours();

      const favTours = allTours.filter((t) => favIds.includes(t.tourId));
      setFavorites(favTours);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavoriteTours();
  }, []);

  const removeFavorite = async (tourId) => {
    const favIds = getFavList(userId);
    const newList = favIds.filter((id) => id !== tourId);
    saveFavList(userId, newList);

    setFavorites((prev) => prev.filter((t) => t.tourId !== tourId));
  };

  if (loading)
    return <div className="min-h-screen pt-24 text-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
          Tour Yêu Thích Của Bạn
        </h1>

        {favorites.length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            Bạn chưa yêu thích tour nào.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((tour) => (
            <div
              key={tour.tourId}
              className="overflow-hidden border shadow-lg rounded-lg flex flex-col"
            >
              <img
                src={tour.images[0]}
                alt={tour.name}
                className="object-cover w-full h-48 hover:scale-110 transition-all"
              />

              <div className="p-4 flex flex-col h-full">
                <p className="text-gray-500 flex items-center gap-1 text-sm mb-1">
                  <Clock width={15} /> {tour.durationText}
                </p>

                <h3 className="text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
                  {tour.name}
                </h3>

                <p className="text-gray-600 mb-4 mt-2 line-clamp-3 min-h-[4.5rem]">
                  {tour.description}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <h3 className="text-2xl font-bold text-red-500">
                    {tour.basePrice.toLocaleString("vi-VN")}₫
                  </h3>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/tour/${tour.tourId}`)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Xem chi tiết
                    </button>

                    <button
                      onClick={() => removeFavorite(tour.tourId)}
                      className="px-3 py-2 bg-red-300 rounded-md"
                    >
                      Bỏ yêu thích
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
