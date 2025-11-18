// src/pages/BookingPage.jsx (TẠO FILE MỚI)

import React, {useEffect, useState} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TopBanner from '../components/TopBanner';
import { createBooking } from '../services/bookingService';
const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"]; //
const PASSENGER_TYPES = ["ADL", "CHD", "INF"];
export default function BookingPage() {
    const [searchParams] = useSearchParams();
const navigate = useNavigate();
    const tourId = searchParams.get('tourId');
    const departureId = searchParams.get('departureId');
    const guests = searchParams.get('guests');

    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [passengers, setPassengers] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initialPassengers = Array.from({ length: guests }, () => ({
            fullName: '',
            birthDate: '',
            gender: 'MALE',    
            type: 'ADL',     
            roomSingle: false
        }));
        setPassengers(initialPassengers);
    }, [guests]);
    const handlePassengerChange = (index, field, value) => {
        const newPassengers = [...passengers];
        
        newPassengers[index] = { 
            ...newPassengers[index], 
            [field]: value 
        };
        
        setPassengers(newPassengers);
    };
    const handleRoomSingleChange = (index, isChecked) => {
         const newPassengers = [...passengers];
         newPassengers[index] = { 
            ...newPassengers[index], 
            roomSingle: isChecked 
        };
        setPassengers(newPassengers);
    };
    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        // TODO: Thêm validation (kiểm tra email, sđt, tên...)
        if (!contactEmail || !contactPhone) {
            alert("Vui lòng nhập đầy đủ thông tin liên hệ.");
            setLoading(false);
            return;
        }
        const bookingData = {
            departureId: departureId,
            contactEmail: contactEmail,
            contactPhone: contactPhone,
            promotionRef: null, 
            passengers: passengers 
        };
        console.log("Chuẩn bị gửi booking với dữ liệu:", bookingData);
        try {
            console.log("Đang gửi payload:", JSON.stringify(bookingData, null, 2));
            const response = await createBooking(bookingData);
            console.log("Booking thành công:", response);
            alert("Đặt tour thành công!" );
            const { invoiceId, totalPrice } = response;

            if (!invoiceId) {
                console.error("Lỗi: BE không trả về invoiceId. Kiểm tra BookingServiceImpl.");
                alert("Đã xảy ra lỗi khi khởi tạo thanh toán.");
                setLoading(false);
                return;
            }
            navigate('/payment', { 
                state: { 
                    invoiceId: invoiceId, 
                    totalAmount: totalPrice 
                } 
            });

        } catch (err) {
            console.error(err);
            alert(`Đặt tour thất bại: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <TopBanner text="Xác nhận Đặt Tour" />
            <div className="max-w-4xl mx-auto py-12 px-4">
                <h2 className="text-3xl font-bold mb-6">Thông tin Đặt Tour</h2>
                
                {/* Tóm tắt thông tin đã chọn */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p><strong>Tour ID:</strong> {tourId}</p>
                    <p><strong>Departure ID:</strong> {departureId}</p>
                    <p><strong>Số lượng khách:</strong> {guests}</p>
                </div>

                <form onSubmit={handleSubmitBooking}>
                    {/* Phần thông tin liên hệ */}
                    <div className="border p-4 rounded-lg mb-6 bg-white">
                        <h3 className="text-xl font-bold mb-4">Thông tin liên hệ (Người đặt)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Email liên hệ</label>
                                <input 
                                    type="email" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    required
                                 />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input 
                                    type="tel" 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    required
                                    />
                            </div>
                        </div>
                    </div>

                    {/* Phần thông tin hành khách (tạo tự động) */}
                    <div className="bg-white p-6 rounded-lg shadow">
                         <h3 className="text-xl font-bold mb-4">Thông tin Hành khách (Tổng: {guests})</h3>
                        
                        {passengers.map((passenger, index) => (
                            <div key={index} className="border-t pt-4 mb-4">
                                <h4 className="text-lg font-semibold mb-2 text-red-600">Hành khách {index + 1}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Tên */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Họ và Tên (*)</label>
                                        <input 
                                            type="text" 
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                                            value={passenger.fullName}
                                            onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {/* Ngày sinh */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày sinh (*)</label>
                                        <input 
                                            type="date" 
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                                            value={passenger.birthDate}
                                            onChange={(e) => handlePassengerChange(index, 'birthDate', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {/* Giới tính */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                        <select
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
                                            value={passenger.gender}
                                            onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                        >
                                            {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    {/* Loại hành khách */}
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700">Loại hành khách</label>
                                        <select
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
                                            value={passenger.type}
                                            onChange={(e) => handlePassengerChange(index, 'type', e.target.value)}
                                        >
                                            {PASSENGER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    {/* Phòng đơn */}
                                    <div className="md:col-span-2 flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id={`roomSingle-${index}`}
                                            className="h-4 w-4 text-red-600 border-gray-300 rounded"
                                            checked={passenger.roomSingle}
                                            onChange={(e) => handleRoomSingleChange(index, e.target.checked)}
                                        />
                                        <label htmlFor={`roomSingle-${index}`} className="ml-2 block text-sm text-gray-900">Yêu cầu phòng đơn (phụ thu)</label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="w-full mt-6 bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 font-semibold text-lg">
                        Xác nhận & Đặt Tour
                    </button>
                </form>
            </div>
        </>
    );
}