import React, { useState, useEffect } from 'react';
import TopBanner from '../../components/TopBanner';
import {  getTourById } from '../../services/tourService';
import { useParams, useNavigate } from 'react-router-dom';

export default function TourDetail() {

    const { tourId } = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [selectedDepartureId, setSelectedDepartureId] = useState('');
    const [guestCount, setGuestCount] = useState(1);
    useEffect(() => {
        const fetchTourDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getTourById(tourId);
                setTour(response);
                if (response.departures && response.departures.length > 0) {
                    setSelectedDepartureId(response.departures[0].departureId);
                }
                console.log('Fetched tour data:', response);
            } catch (err) {
                console.error(err);
                setError('Tour not found');
            } finally {
                setLoading(false);
            }
        };
        
        fetchTourDetail();
    }, [tourId]);

    const handleBookingSubmit = (e) => {
        e.preventDefault(); 
        if (!selectedDepartureId) {
            alert("Vui lòng chọn ngày khởi hành.");
            return;
        }
        if (guestCount < 1) {
            alert("Số lượng khách phải ít nhất là 1.");
            return;
        }
        navigate(`/booking?tourId=${tourId}&departureId=${selectedDepartureId}&guests=${guestCount}`);
    };
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
                <img src={'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'} alt={tour.name} className="w-full h-full object-cover" />
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
                        
                        <div className="space-y-3 text-gray-700 text-base">
                        <p><span className="font-semibold">Địa điểm:</span> {tour.location}</p>
                        <p><span className="font-semibold">Thời gian:</span> {tour.durationText}</p>
                        <p><span className="font-semibold">Loại tour:</span> {tour.type}</p>
                        <p><span className="font-semibold">Trạng thái:</span> {tour.status}</p>
                         <hr className="my-8" />
                    </div>
                    </div>
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg border">
                            <h3 className="text-2xl font-bold text-red-500 mb-4">${tour.basePrice}</h3>
                            {/* <div className="mb-4">
                                <p className="text-gray-700"><span className="font-semibold">Thời gian:</span> {tour.time}</p>
                                <p className="text-gray-700"><span className="font-semibold">Đánh giá:</span> {tour.star}</p>
                            </div> */}
                            <form className="space-y-4" onSubmit={handleBookingSubmit}>
                                {/* <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Chọn ngày đi</label>
                                    <input type="date" id="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div> */}
                                <div className="mb-6">
                                    <p className="font-semibold text-gray-800 mb-2">Ngày khởi hành:</p>

                                    {tour.departures.length === 0 ? (
                                        <p className="text-gray-500 text-sm">Chưa có lịch khởi hành</p>
                                    ) : (
                                        <select className="w-full border rounded-md p-2 text-gray-700"
                                            value={selectedDepartureId}
                                            onChange={(e) => setSelectedDepartureId(e.target.value)}
                                        >
                                            {tour.departures.map(dep => (
                                                <option key={dep.departureId} value={dep.departureId}>
                                                    {new Date(dep.startDate).toLocaleDateString("vi-VN")} →{" "}
                                                    {new Date(dep.endDate).toLocaleDateString("vi-VN")}  
                                                    ({dep.status})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Số lượng khách</label>
                                    <input type="number" id="guests" 
                                        value={guestCount}
                                        onChange={(e) => setGuestCount(Number(e.target.value))}
                                        defaultValue="1" 
                                        min="1" 
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <button type="submit" className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 font-semibold" disabled={tour.departures.length === 0}>
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