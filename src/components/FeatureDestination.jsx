import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Components/Css/reactSlick.css";
import { Clock, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllTours } from "../services/tourService";
import { getCurrentUser } from "../services/authService";
import { getFavList, saveFavList } from "../utils/favoriteUtils";

export default function FeatureDestination() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 3, dots: true },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Lấy thông tin user
      const user = await getCurrentUser();
      if (user?.customerId) {
        setUserId(user.customerId);
        setFavorites(getFavList(user.customerId)); // load danh sách yêu thích
      }

      // Lấy tour
      try {
        const response = await getAllTours();
        setTours(response.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
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

  if (loading) {
    return (
      <section className="w-full py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Loading featured tours...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 px-6 md:px-0">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-3 font-serif">
          Featured Destinations
        </h2>
        <hr className="w-[200px] bg-red-500 mx-auto h-1 mb-10" />

        <div className="slider-container">
          <Slider {...settings}>
            {tours.map((destination) => (
              <div key={destination.tourId}>
                <div className="overflow-hidden border shadow-lg rounded-lg mb-5 mr-5">
                  <img
                    src={destination.images[0]}
                    alt={destination.name}
                    className="object-cover w-full h-48 hover:scale-110 transition-all"
                  />

                  <div className="p-4 flex flex-col">
                    <p className="text-gray-500 flex items-center gap-1 text-sm">
                      <Clock width={15} /> {destination.durationText}
                    </p>

                    <h3 className="text-xl font-bold line-clamp-2 min-h-[3.5rem]">
                      {destination.name}
                    </h3>

                    <p className="text-gray-600 mt-2 line-clamp-3 min-h-[4.5rem]">
                      {destination.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <h3 className="text-2xl font-bold text-red-500">
                        {destination.basePrice.toLocaleString("vi-VN")}₫
                      </h3>

                      <Link to={`/tour/${destination.tourId}`}>
                        <button className="px-3 py-2 bg-blue-500 rounded-md text-white">
                          Xem
                        </button>
                      </Link>

                      <button
                        onClick={() => toggleFavorite(destination.tourId)}
                        className={`px-3 py-2 rounded-md ${
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
          </Slider>
        </div>
      </div>
    </section>
  );
}
