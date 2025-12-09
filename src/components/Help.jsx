import React from "react";
import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* TITLE */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Trung Tâm Trợ Giúp
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn trong suốt hành trình.
        </p>

        {/* FAQ SECTIONS */}
        <div className="space-y-10">
          {/* 1. ĐẶT TOUR */}
          <section className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              ✈️ Hướng dẫn đặt tour
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>• Làm sao để đặt tour?</strong>
                <br />
                Chọn tour bạn muốn → Nhấn “Đặt Tour” → Nhập thông tin hành khách
                → Thanh toán.
              </p>

              <p>
                <strong>• Tôi có cần tạo tài khoản để đặt tour không?</strong>
                <br />
                Có. Tài khoản giúp bạn theo dõi đơn hàng, lịch sử và yêu thích.
              </p>

              <p>
                <strong>• Tôi có thể đặt cho nhiều người không?</strong>
                <br />
                Hoàn toàn được! Bạn có thể thêm nhiều hành khách trong bước đặt
                tour.
              </p>
            </div>
          </section>

          {/* 2. THANH TOÁN */}
          <section className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              💳 Thanh toán & hóa đơn
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>• Những phương thức thanh toán hỗ trợ?</strong>
                <br />
                Chúng tôi hỗ trợ thẻ ngân hàng, ví điện tử, chuyển khoản và
                thanh toán QR.
              </p>

              <p>
                <strong>• Tôi có nhận được hóa đơn không?</strong>
                <br />
                Có, hệ thống sẽ gửi hóa đơn qua email và hiển thị trong “Tour đã
                đặt”.
              </p>

              <p>
                <strong>• Thanh toán không thành công?</strong>
                <br />
                Vui lòng thử lại sau 5 phút hoặc liên hệ hỗ trợ.
              </p>
            </div>
          </section>

          {/* 3. HỦY & HOÀN TIỀN */}
          <section className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              ❌ Hủy tour & Hoàn tiền
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>• Tôi có thể hủy tour không?</strong>
                <br />
                Bạn có thể hủy trong mục “Tour đã đặt”, tùy theo điều kiện của
                từng tour.
              </p>

              <p>
                <strong>• Khi nào tôi nhận được tiền hoàn?</strong>
                <br />
                Trong vòng 3–7 ngày làm việc tùy phương thức thanh toán.
              </p>

              <p>
                <strong>• Phí hủy là bao nhiêu?</strong>
                <br />
                Mỗi tour có quy định riêng – xem chi tiết trong trang tour.
              </p>
            </div>
          </section>

          {/* 4. TÀI KHOẢN */}
          <section className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">
              🔐 Tài khoản & Bảo mật
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>• Tôi muốn đổi thông tin cá nhân?</strong>
                <br />
                Bạn có thể chỉnh sửa tại mục “Cài đặt tài khoản”.
              </p>

              <p>
                <strong>• Thông tin cá nhân có được bảo mật?</strong>
                <br />
                Chúng tôi mã hóa toàn bộ dữ liệu và không chia sẻ cho bên thứ
                ba.
              </p>
            </div>
          </section>
        </div>

        {/* CONTACT SUPPORT */}
        <div className="mt-16 p-8 bg-blue-50 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <HelpCircle /> Cần hỗ trợ thêm?
          </h2>

          <p className="text-gray-700 mb-4">
            Liên hệ với đội ngũ chăm sóc khách hàng 24/7 của chúng tôi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 bg-white shadow p-4 rounded-lg flex-1">
              <Phone className="text-blue-600" />
              <div>
                <p className="font-bold">Hotline</p>
                <p>1900 9999</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white shadow p-4 rounded-lg flex-1">
              <Mail className="text-blue-600" />
              <div>
                <p className="font-bold">Email</p>
                <p>support@travelsteven.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white shadow p-4 rounded-lg flex-1">
              <MessageCircle className="text-blue-600" />
              <div>
                <p className="font-bold">Chat trực tuyến</p>
                <p>Hỗ trợ ngay lập tức</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
