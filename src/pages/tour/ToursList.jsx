import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopBanner from "../../components/TopBanner";
import { Clock, Heart } from "lucide-react";
import { getAllTours } from "../../services/tourService";
import { getCurrentUser } from "../../services/authService";
import { getFavList, saveFavList } from "../../utils/favoriteUtils";

export default function ToursList() {
  const [tours, setTours] = useState([]);
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();
      if (user?.customerId) {
        setUserId(user.customerId);
        setFavorites(getFavList(user.customerId));
      }

      const data = await getAllTours();
      setTours(data);
    };

    init();
  }, []);

  const toggleFavorite = (tourId) => {
    if (!userId) {
      alert("Bạn cần đăng nhập để yêu thích tour!");
      return;
    }

    let updated;

    if (favorites.includes(tourId)) {
      updated = favorites.filter((id) => id !== tourId);
    } else {
      updated = [...favorites, tourId];
    }

    saveFavList(userId, updated);
    setFavorites(updated);
  };

  return (
    <>
      <TopBanner text="Our Tours" />

      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-3 font-serif">
            All Destinations
          </h2>
          <hr className="text-red-500 w-[200px] bg-red-500 mx-auto h-1 mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((destination) => (
              <div
                key={destination.tourId}
                className="overflow-hidden border shadow-lg rounded-lg flex flex-col"
              >
                <img
                  src={destination.images[0]}
                  alt={destination.name}
                  className="object-cover w-full h-48 hover:scale-110 transition-all"
                />

                <div className="p-4 flex flex-col flex-1">
                  <p className="text-gray-500 flex items-center gap-1 text-sm mb-1">
                    <Clock width={15} /> {destination.durationText}
                  </p>

                  <h3 className="text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
                    {destination.name}
                  </h3>

                  <p className="text-gray-600 mb-4 mt-2 line-clamp-3 min-h-[4.5rem]">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <h3 className="text-2xl font-bold text-red-500">
                      {destination.basePrice.toLocaleString("vi-VN")}₫
                    </h3>

                    <div className="flex gap-2">
                      <Link to={`/tour/${destination.tourId}`}>
                        <button className="px-3 py-2 bg-blue-500 rounded-md text-white">
                          Xem chi tiết
                        </button>
                      </Link>

                      <button
                        onClick={() => toggleFavorite(destination.tourId)}
                        className={`p-2 rounded-md ${
                          favorites.includes(destination.tourId)
                            ? "bg-red-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <Heart
                          className="w-6 h-6"
                          color="white"
                          fill={
                            favorites.includes(destination.tourId)
                              ? "white"
                              : "none"
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
