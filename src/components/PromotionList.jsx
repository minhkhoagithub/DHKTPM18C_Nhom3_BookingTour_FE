import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PromotionList() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("http://localhost:8080/promotion/active-current");
        const data = await res.json();
        console.log("Fetched promotions:", data);

        // Fetch thông tin tour cho từng promotion
        const resultWithTours = await Promise.all(
  data.map(async (promo) => {
    // Nếu không có tourId → khuyến mãi áp dụng TẤT CẢ tour
    if (!promo.tourId) {
      return {
        ...promo,
        tour: "ALL"  // hoặc null, hoặc [] tùy bạn dùng UI hiển thị
      };
    }

    // Ngược lại → lấy thông tin tour theo ID
    const tourRes = await fetch(`http://localhost:8080/api/tours/${promo.tourId}`);
    const tourData = await tourRes.json();

    console.log(`Fetched tour for promotion ${promo.id}:`, tourData);

    return { 
      ...promo, 
      tour: tourData 
    };
  })
);

        setPromotions(resultWithTours);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load promotions", err);
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return <p className="text-center py-10 text-muted-foreground">Đang tải khuyến mãi...</p>;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          🔥 Khuyến Mãi Hiện Tại
        </h2>

        {promotions.length === 0 ? (
          <p className="text-center text-muted-foreground">Không có khuyến mãi nào.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo) => (
              <div key={promo.promotionId} className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-4">
                <h3 className="font-bold text-xl text-primary mb-2">{promo.title}</h3>

                <p className="text-muted-foreground mb-3 text-red-600">
                  Giảm giá: <span className="font-semibold">{promo.value}</span>
                </p>

                {/* Thông tin Tour */}
                {promo.tour && promo.tour !== "ALL" && (
  <div className="border-t pt-3 mt-3 text-sm">
    <h4 className="font-semibold">Tour áp dụng:</h4>
    
    <p><b>{promo.tour.name}</b></p>

    {promo.tour.images && promo.tour.images.length > 0 && (
      <img
        src={promo.tour.images[0]}
        alt={promo.tour.name}
        className="object-cover w-full h-48 hover:scale-110 transition-all"
      />
    )}

    <p>Giá gốc: {promo.tour.basePrice.toLocaleString("vi-VN")} VND</p>

    <Link to={`/tour/${promo.tour.tourId}`}>
      <button className="px-3 py-2 bg-blue-500 rounded-md text-white mt-2">
        Xem chi tiết
      </button>
    </Link>
  </div>
)}

{/* Nếu khuyến mãi áp dụng cho TẤT CẢ tour */}
{promo.tour === "ALL" && (
  <div className="border-t pt-3 mt-3 text-sm">
    <h4 className="font-semibold">Áp dụng cho:</h4>
    <p className="font-bold text-green-600 text-lg mt-1">
      🎉 Tất cả các tour trên hệ thống
    </p>

    <p className="text-gray-600 mt-1">
      Bạn có thể sử dụng khuyến mãi này cho bất kỳ tour nào hiện có.
    </p>

    <Link to="/tours">
      <button className="mt-3 px-3 py-2 bg-blue-500 rounded-md text-white">
        Xem tất cả tour
      </button>
    </Link>
  </div>
)}

                <button className="mt-4 w-full bg-primary text-white py-2 rounded-lg">
                  Xem Chi Tiết
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
