import React from 'react';

export default function About() {
    const members = [
        "Lê Minh Khoa",
        "Nguyễn Văn A",
        "Trần Thị B",
        "Phạm Văn C",
        "Hoàng Thị D",
        "Ngô Văn E",
        "Đặng Thị F"
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Về Nhóm Chúng Tôi</h1>
            <p className="text-gray-700 mb-6 text-center">
                Chúng tôi là nhóm gồm 7 thành viên, hiện đang phát triển một website du lịch nhằm mang đến trải nghiệm đặt tour thuận tiện và thú vị cho người dùng.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Thành viên nhóm:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
                {members.map((member, index) => (
                    <li key={index}>{member}</li>
                ))}
            </ul>
        </div>
    );
}
