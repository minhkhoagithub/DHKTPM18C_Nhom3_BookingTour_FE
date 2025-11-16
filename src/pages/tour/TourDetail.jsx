import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TopBanner from '../../components/TopBanner';
import { getTourByName } from '../../services/tourService';


export default function TourDetail() {

    const { tourId } = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTourDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getTourByName(tourId);
                setTour(data);
            } catch (err) {
                console.error(err);
                setError('Tour not found');
            } finally {
                setLoading(false);
            }
        };
        
        fetchTourDetail();
    }, [tourId]);
if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 text-center">
                <h2 className="text-2xl font-bold">Loading tour details...</h2>
            </div>
        );
    }
    if (error) {
        return (
            <>
                <TopBanner text="Error" />
                <div className="max-w-7xl mx-auto py-12 px-4 text-center">
                    <h2 className="text-2xl font-bold">Không tìm thấy tour</h2>
                    <p>Tour bạn đang tìm kiếm không tồn tại.</p>
                </div>
            </>
        );
    }
    if (!tour) {
        return null; 
    }

    return (
        <>
            <div className="h-[400px] relative -mt-12">
                <img src={tour.img} alt={tour.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <h1 className="text-white text-5xl font-bold font-serif">{tour.name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-16 px-4 md:px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold mb-4">{tour.name}</h2>
                        <p className="text-gray-600 mb-6 text-lg">{tour.description}</p>
                        
                        <h3 className="text-2xl font-semibold mb-4">Hành trình (ví dụ)</h3>
                        <ul className="space-y-2 list-disc list-inside text-gray-700">
                            <li>Ngày 1: Đến {tour.name}, nhận phòng khách sạn.</li>
                            <li>Ngày 2: Tham quan các địa điểm nổi tiếng.</li>
                            <li>Ngày 3: Khám phá ẩm thực địa phương.</li>
                            <li>Ngày 4: Mua sắm và tự do khám phá.</li>
                            <li>Ngày 5: Trở về.</li>
                        </ul>
                    </div>
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg border">
                            <h3 className="text-2xl font-bold text-red-500 mb-4">${tour.price}</h3>
                            <div className="mb-4">
                                <p className="text-gray-700"><span className="font-semibold">Thời gian:</span> {tour.time}</p>
                                <p className="text-gray-700"><span className="font-semibold">Đánh giá:</span> {tour.star}</p>
                            </div>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Chọn ngày đi</label>
                                    <input type="date" id="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <div>
                                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Số lượng khách</label>
                                    <input type="number" id="guests" defaultValue="1" min="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <button type="submit" className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 font-semibold">
                                    Đặt Ngay
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}