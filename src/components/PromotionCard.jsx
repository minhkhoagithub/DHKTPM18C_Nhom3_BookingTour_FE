import React, { useEffect, useState } from "react";

export default function PromotionCard({ tourId }) {
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tourId) return;

    const fetchPromotion = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/promotion/highest-value-by-tour?tourId=${tourId}`
        );

        const data = await response.json();
        setPromotion(data);
        console.log("Fetched promotion:", data);
      } catch (error) {
        console.error("Error fetching promotion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [tourId]);

  if (loading) return <p>Loading promotion...</p>;

  if (!promotion) return <p>No promotion available for this tour.</p>;

  return (
    <div className="p-4 rounded-lg border shadow-sm bg-green-50">
      <h3 className="text-xl font-bold text-green-700">🔥 Khuyến mãi</h3>
      <p className="text-lg font-semibold">
        {promotion.name}
      </p>
      <p className="mt-2">
        Giá giảm:{" "}
        <span className="font-bold text-red-600">
          {promotion.value}
          {promotion.type === "PERCENT" ? "%" : "₫"}
          
        </span>
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Ngày hết hạn: {promotion.endDate}
      </p>
    </div>
  );
}
