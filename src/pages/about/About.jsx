import React from 'react';
// Import các tệp ảnh (đây là cách thông thường trong React khi dùng Webpack/Vite)
// Nếu bạn đang dùng Next.js, hãy dùng component <Image> của Next.
const image1 = "https://res.cloudinary.com/dzc1s5foz/image/upload/v1765336916/482960491_1853365065514926_8237580525875652929_n_v4vo0j.jpg";
const image2 = "https://res.cloudinary.com/dzc1s5foz/image/upload/v1765336915/unnamed_1_xbvtfh.jpg";
const image3 = "https://res.cloudinary.com/dzc1s5foz/image/upload/v1765336917/Gemini_Generated_Image_fxwllmfxwllmfxwl_bo1xz7.png";
const image4 = "https://res.cloudinary.com/dzc1s5foz/image/upload/v1765336916/Gemini_Generated_Image_7c3hvg7c3hvg7c3h_qtbolz.png";
const image5 = "https://res.cloudinary.com/dzc1s5foz/image/upload/v1765337133/Gemini_Generated_Image_jhasesjhasesjhas_bzfyz7.png";
const image6 = "https://res.cloudinary.com/dzc1s5foz/image/upload/v1765337133/Gemini_Generated_Image_jhasesjhasesjhas_bzfyz7.png";
const image7 = "https://res.cloudinary.com/dzc1s5foz/image/upload/v1765337380/Gemini_Generated_Image_3hsgc83hsgc83hsg_sysgam.png";
// Vì chỉ có 6 ảnh rõ ràng, tôi sẽ dùng ảnh 1 cho Đặng Thị F.

export default function About() {
    const members = [
        { name: "Lê Ngọc Hảo", role: "Trưởng nhóm", image: image5 },
        { name: "Nguyễn Hoàng Tấn", role: "Backend Developer", image: image2 },
        { name: "Phạm Minh Châu", role: "Backend Developer – Data Analyst", image: image3 },
        { name: "Nguyễn Nhật Dương", role: "Backend Developer", image: image4 },
        { name: "Lê Minh Khoa", role: "Frontend Developer", image: image1 },
        { name: "Huỳnh Lê Minh Duy", role: "Backend Developer", image: image6 },
        { name: "Nguyễn Thị Hà Như", role: "Backend Developer – Data Analyst", image: image7 } // Dùng lại ảnh minh họa
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">
                    Về Nhóm Chúng Tôi
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Chúng tôi là nhóm <strong className="text-indigo-600">7 thành viên</strong> đầy nhiệt huyết, hiện đang phát triển một website du lịch đột phá nhằm mang đến trải nghiệm đặt tour <strong className="text-indigo-600">thuận tiện, thú vị và đáng tin cậy</strong> cho mọi du khách.
                </p>
            </header>

            <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2 mb-6 text-center">
                    ✨ Gặp Gỡ Đội Ngũ Sáng Lập ✨
                </h2>
                
                {/* Grid bố cục cho thành viên */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {members.map((member, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden transform hover:scale-105"
                        >
                            {/* Khung ảnh */}
                            <div className="h-64 overflow-hidden">
                                {/* Sử dụng 'object-cover' để ảnh vừa khung mà không bị méo */}
                                {/* Vì Ngô Văn E là ảnh 3 ô, tôi sẽ dùng ô giữa để minh họa */}
                                {member.name === "Ngô Văn E" ? (
                                    <img 
                                        src={member.image} 
                                        alt={`Hình ảnh của ${member.name}`} 
                                        className="w-full h-full object-cover object-[center_33%]" // Chỉ lấy phần giữa
                                    />
                                ) : (
                                    <img 
                                        src={member.image} 
                                        alt={`Hình ảnh của ${member.name}`} 
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Thông tin thành viên */}
                            <div className="p-5 text-center">
                                <h3 className="text-xl font-semibold text-indigo-600 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-sm font-medium text-gray-500">
                                    {member.role}
                                </p>
                                
                                {/* Mô tả thêm (Tùy chọn) */}
                                {/* <p className="text-gray-600 mt-3 text-sm italic">
                                    "Mô tả ngắn gọn về vai trò hoặc câu châm ngôn."
                                </p> */}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// Lưu ý: Đảm bảo bạn đã cài đặt Tailwind CSS trong dự án của mình để các class hoạt động.