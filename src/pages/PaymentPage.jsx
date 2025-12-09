// src/pages/PaymentPage.jsx (TẠO FILE MỚI)

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBanner from '../components/TopBanner';
import { executePayment, cancelBooking } from '../services/bookingService'; // Sẽ tạo ở bước 3

// Lấy 1 ảnh QR code giả, bạn tự lưu ảnh này vào
// import FakeQrImage from '../assets/fake-qr.png'; 

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const BANK_ID = "VCB"; 


    const { invoiceId, totalAmount } = location.state || {};
const ACCOUNT_NUMBER = "0123456789"; 
const ACCOUNT_NAME = "CONG TY ABC";
const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NUMBER}-compact2.png?amount=${totalAmount}&addInfo=PAY-${invoiceId}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
    if (!invoiceId) {
        navigate('/');
        return null; 
    }

    const handleConfirmPayment = async () => {
        setLoading(true);

        try {

            alert("Đang xác nhận thanh toán... vui lòng chờ. Thông tin thanh toán sẽ được gửi qua email.");
           console.log()
            navigate('/tours'); 

        } catch (err) {
            console.error(err);
            alert(`Xác nhận thanh toán thất bại: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Bạn có chắc muốn hủy booking này? (Chỉ có thể hủy khi chưa thanh toán)")) {
            return;
        }

        setLoading(true);

        try {

            const response = await cancelBooking(invoiceId); 
            
            console.log("Hủy thành công, booking đã chuyển sang:", response.status);
            alert("Đã hủy booking thành công.");
            navigate('/');

        } catch (err) {
            console.error(err);
            alert(`Hủy thất bại: ${err.message}`); 
        } finally {
            setLoading(false);
        }
    };

    

    return (
        <>
            <TopBanner text="Thanh toán Đơn hàng" />
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                
                <h2 className="text-2xl font-bold mb-4">Hoàn tất Thanh toán</h2>
                <p className="text-lg mb-4">Vui lòng quét mã QR bên dưới để thanh toán</p>
                
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    
                    <div className="w-48 h-48 bg-gray-200 mx-auto flex items-center justify-center">
                        <img src={qrUrl} alt="QR VietQR" className="mx-auto w-64 shadow-lg rounded-md" />
                    </div>

                    <p className="text-xl font-semibold mt-4">Tổng số tiền:</p>
                    <p className="text-3xl font-bold text-red-600">
                        {new Intl.NumberFormat('vi-VN').format(totalAmount)} VND
                    </p>
                    <p className="text-gray-500 mt-2">Mã hóa đơn: {invoiceId}</p>

                    <button 
                        onClick={handleConfirmPayment}
                        disabled={loading}
                        className="w-full mt-6 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 font-semibold text-lg"
                    >
                        {loading ? "Đang xử lý..." : "Tôi đã thanh toán"}
                    </button>
                    
                    <button 
                        onClick={handleCancel}
                        disabled={loading}
                        className="w-full mt-3 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                    >
                        {loading ? "Đang xử lý..." : "Hủy Booking"}
                    </button>
                </div>
            </div>
        </>
    );
}