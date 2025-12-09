import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { getAllTours } from "../services/tourService";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

export default function Favourite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // -------------------- FIXED RANDOM --------------------

  function uuidToSeed(uuid) {
    let num = 0;
    for (let i = 0; i < uuid.length; i++) {
      num = (num * 31 + uuid.charCodeAt(i)) % 1000000007;
    }
    return num;
  }

  function makeRandom(seed) {
    return function () {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }

  function pickSeededTours(allTours, seed, count = 10) {
    const rand = makeRandom(seed);
    const selected = [];
    const used = new Set();

    for (let i = 0; i < Math.min(count, allTours.length); i++) {
      let r;
      do {
        r = Math.floor(rand() * allTours.length);
      } while (used.has(r));

      used.add(r);
      selected.push(allTours[r]);
    }

    return selected;
  }

  const loadRecommendedTours = async () => {
    try {
      const user = await getCurrentUser();

      if (!user || !user.customerId) {
        setLoading(false); // IMPORTANT FIX
        navigate("/login");
        return;
      }

      let apiRes = await getAllTours();
      console.log("📌 API Tours:", apiRes);

      // If API returns { success, data }, normalize it
      const allTours = apiRes.data || apiRes;

      if (!Array.isArray(allTours)) {
        console.error("❌ allTours không phải là array:", allTours);
        setLoading(false);
        return;
      }

      const seed = uuidToSeed(user.customerId);
      const recommended = pickSeededTours(allTours, seed, 10);

      setFavorites(recommended);
    } catch (error) {
      console.error("Lỗi khi tạo danh sách tour gợi ý:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendedTours();
  }, []);

  //   const formatCurrency = (amount) =>
  //     new Intl.NumberFormat("vi-VN", {
  //       style: "currency",
  //       currency: "VND",
  //     }).format(amount);

  if (loading)
    return <div className="min-h-screen pt-24 text-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
          Gợi Ý Dành Riêng Cho Bạn
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((tour, index) => (
            <div
              key={index}
              className="overflow-hidden border shadow-lg shadow-gray-500 rounded-lg"
            >
              {/* ẢNH TOUR */}
              <img
                src={tour.images?.[0]}
                alt={tour.name}
                className="object-cover w-full h-48 hover:scale-110 transition-all"
              />

              <div className="p-4">
                {/* Duration */}
                <p className="text-gray-500 flex items-center gap-1 text-sm mb-1">
                  <Clock width={15} /> {tour.durationText}
                </p>

                {/* Tên Tour */}
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  {tour.name}
                </h3>

                {/* Mô tả */}
                <p className="text-gray-600 mb-4 mt-2 line-clamp-3">
                  {tour.description}
                </p>

                {/* Giá + nút */}
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-red-500">
                    {tour.basePrice.toLocaleString("vi-VN")}₫
                  </h3>

                  <div className="flex gap-2">
                    {/* Xem chi tiết */}
                    <button
                      onClick={() => navigate(`/tour/${tour.tourId}`)}
                      className="px-3 py-2 bg-blue-500 rounded-md text-white"
                    >
                      Xem chi tiết
                    </button>

                    {/* Bỏ yêu thích */}
                    <button
                      onClick={() =>
                        setFavorites((prev) =>
                          prev.filter((t) => t.tourId !== tour.tourId)
                        )
                      }
                      className="px-3 py-2 bg-red-300 rounded-md text-gray-700"
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
