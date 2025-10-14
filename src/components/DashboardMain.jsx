
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Package } from 'lucide-react';
export default function DashboardMain() {
    const statsCardsData = [
    { title: "Total Revenue", value: "$45,231.89", change: "+20.1% from last month", icon: <DollarSign className="h-6 w-6 text-gray-500" /> },
    { title: "Bookings", value: "+2350", change: "+180.1% from last month", icon: <Users className="h-6 w-6 text-gray-500" /> },
    { title: "Tours Active", value: "152", change: "+19% from last month", icon: <Package className="h-6 w-6 text-gray-500" /> },
    { title: "New Users", value: "+573", change: "+201 since last hour", icon: <Users className="h-6 w-6 text-gray-500" /> },
];
const salesData = [
    { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 }, { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 }, { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
    { name: 'Jul', revenue: 7000 }, { name: 'Aug', revenue: 6500 }, { name: 'Sep', revenue: 7500 },
    { name: 'Oct', revenue: 8000 }, { name: 'Nov', revenue: 9000 }, { name: 'Dec', revenue: 8500 },
];
const recentBookingsData = [
    { name: "Olivia Martin", email: "olivia.martin@email.com", tour: "Paris Adventure", amount: "$1,999.00", status: "Confirmed" },
    { name: "Jackson Lee", email: "jackson.lee@email.com", tour: "Tokyo Lights", amount: "$3,250.00", status: "Pending" },
    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", tour: "Bali Escape", amount: "$1,500.00", status: "Confirmed" },
    { name: "William Kim", email: "will@email.com", tour: "Venice Canals", amount: "$2,100.00", status: "Cancelled" },
    { name: "Sofia Davis", email: "sofia.davis@email.com", tour: "India Wonders", amount: "$2,800.00", status: "Confirmed" },
];
    return (
        <>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsCardsData.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                        {card.icon}
                    </div>
                    <div className="mt-4">
                        <p className="text-3xl font-bold">{card.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{card.change}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#ef4444" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                <div className="space-y-4">
                    {recentBookingsData.slice(0, 5).map((booking, index) => (
                        <div key={index} className="flex items-center">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">{booking.name}</p>
                                <p className="text-sm text-gray-500">{booking.email}</p>
                            </div>
                            <div className="ml-auto font-medium">{booking.amount}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
    )
}