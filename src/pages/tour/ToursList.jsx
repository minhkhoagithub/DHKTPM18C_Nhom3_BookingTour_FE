import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopBanner from "../../components/TopBanner";
import { Clock, Heart, Search, DollarSign } from "lucide-react";
import { 
    getAllTours, 
    getUniqueTourLocations 
} from "../../services/tourService"; 
import { getCurrentUser } from "../../services/authService";
import { getFavList, saveFavList } from "../../utils/favoriteUtils";

export default function ToursList() {
    const [allTours, setAllTours] = useState([]); 
    const [tours, setTours] = useState([]); 

    const [userId, setUserId] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [locations, setLocations] = useState([]); 

    const [searchParams, setSearchParams] = useState({
        location: '',
        minPrice: '',
        maxPrice: '',
    });

    // Load dữ liệu ban đầu
    useEffect(() => {
        const init = async () => {
            const user = await getCurrentUser();
            if (user?.customerId) {
                setUserId(user.customerId);
                setFavorites(getFavList(user.customerId));
            }

            const data = await getAllTours();
            setAllTours(data); 
            setTours(data);    

            try {
                const locationData = await getUniqueTourLocations();
                setLocations(locationData);
            } catch (error) {
                console.error("Không thể load địa điểm:", error);
            }
        };

        init();
    }, []);

    // Lắng nghe searchParams hoặc allTours để lọc Real-time
    useEffect(() => {
        handleClientSideSearch();
    }, [searchParams, allTours]);

    const toggleFavorite = (tourId) => {
        if (!userId) {
            alert("Bạn cần đăng nhập để yêu thích tour!");
            return;
        }
        let updated;
        if (favorites.includes(tourId)) {
            updated = favorites.filter((id) => id !== tourId);
        } else {
            updated = [...favorites, tourId];
        }

        saveFavList(userId, updated);
        setFavorites(updated);
    };

    // HÀM XỬ LÝ THAY ĐỔI INPUT VÀ RÀNG BUỘC UI/UX MỚI
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newSearchParams = { ...searchParams };
        
        const isPriceField = name === 'minPrice' || name === 'maxPrice';
        const processedValue = isPriceField 
            ? (value === '' ? '' : Number(value)) 
            : value;

        // 1. Cập nhật giá trị mới
        newSearchParams[name] = processedValue;

        // 2. LOGIC RÀNG BUỘC (Exclusive Logic)
        if (name === 'location') {
            // Nếu chọn một địa điểm cụ thể (value !== ''), reset giá
            if (value !== '') {
                newSearchParams.minPrice = '';
                newSearchParams.maxPrice = '';
            }
        } else if (isPriceField) {
            // Nếu nhập giá trị giá (value !== ''), reset địa điểm về rỗng ('Tất cả Địa điểm')
            if (value !== '') {
                newSearchParams.location = ''; 
            }
        }

        setSearchParams(newSearchParams);
    };

    // Hàm thực hiện LỌC CLIENT-SIDE
    const handleClientSideSearch = () => {
        const { location, minPrice, maxPrice } = searchParams;
        
        const hasFilters = location || (minPrice !== '' && minPrice !== 0) || (maxPrice !== '' && maxPrice !== 0);

        if (!hasFilters) {
            setTours(allTours);
            return;
        }

        const filtered = allTours.filter(tour => {
            let match = true;
            const price = tour.basePrice;

            // 1. Lọc theo Location
            if (location && tour.location !== location) {
                match = false;
            }
            
            // 2. Lọc theo Giá Tối thiểu (Min Price)
            if (match && minPrice !== '' && price < minPrice) {
                match = false;
            }

            // 3. Lọc theo Giá Tối đa (Max Price)
            if (match && maxPrice !== '' && price > maxPrice) {
                match = false;
            }
            
            return match;
        });

        setTours(filtered);
    };

    // Hàm handleSearch (đã bị xóa do lọc Real-time)

    return (
        <>
            <TopBanner text="Our Tours" />

            <section className="w-full py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-3 font-serif">
                        All Destinations
                    </h2>
                    <hr className="text-red-500 w-[200px] bg-red-500 mx-auto h-1 mb-10" />

                    {/* KHUNG LỌC REAL-TIME */}
                    <div className='bg-white border border-gray-300 shadow-xl rounded-lg hidden lg:block max-w-4xl mx-auto p-4 mb-10'>
                        
                        <div className='grid gap-4 grid-cols-3'> 
                            
                            {/* 1. Location */}
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="location-select" className='flex font-semibold text-gray-700 gap-1 items-center'>
                                    <Search className='w-4 h-4 text-red-500' />
                                    Địa điểm
                                </label>
                                <select 
                                    id="location-select" 
                                    name="location" 
                                    value={searchParams.location} 
                                    onChange={handleInputChange} 
                                    className='border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm'
                                >
                                    <option value="">Tất cả Địa điểm</option>
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* 2. Min Price */}
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="min-price" className='flex font-semibold text-gray-700 gap-1 items-center'>
                                    <DollarSign className='w-4 h-4 text-green-600' />
                                    Giá thấp nhất (₫)
                                </label>
                                <input 
                                    id="min-price" 
                                    type="number" 
                                    name="minPrice" 
                                    placeholder="Giá tối thiểu"
                                    value={searchParams.minPrice} 
                                    onChange={handleInputChange} 
                                    // DISABLED nếu đã chọn địa điểm
                                    disabled={searchParams.location !== ''}
                                    className={`border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm ${searchParams.location !== '' ? 'bg-gray-100 cursor-not-allowed border-gray-300' : 'border-gray-300'}`} 
                                />
                            </div>
                            
                            {/* 3. Max Price */}
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="max-price" className='flex font-semibold text-gray-700 gap-1 items-center'>
                                    <DollarSign className='w-4 h-4 text-red-600' />
                                    Giá cao nhất (₫)
                                </label>
                                <input 
                                    id="max-price" 
                                    type="number" 
                                    name="maxPrice" 
                                    placeholder="Giá tối đa"
                                    value={searchParams.maxPrice} 
                                    onChange={handleInputChange} 
                                    // DISABLED nếu đã chọn địa điểm
                                    disabled={searchParams.location !== ''}
                                    className={`border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm ${searchParams.location !== '' ? 'bg-gray-100 cursor-not-allowed border-gray-300' : 'border-gray-300'}`} 
                                />
                            </div>
                        </div>
                    </div>
                    {/* KẾT THÚC KHUNG LỌC REAL-TIME */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.map((destination) => (
                             <div
                                key={destination.tourId}
                                className="overflow-hidden border shadow-lg rounded-lg flex flex-col"
                            >
                                <img
                                    src={destination.images?.[0]}
                                    alt={destination.name}
                                    className="object-cover w-full h-48 hover:scale-110 transition-all"
                                />

                                <div className="p-4 flex flex-col flex-1">
                                    <p className="text-gray-500 flex items-center gap-1 text-sm mb-1">
                                        <Clock width={15} /> {destination.durationText}
                                    </p>

                                    <h3 className="text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
                                        {destination.name}
                                    </h3>

                                    <p className="text-gray-600 mb-4 mt-2 line-clamp-3 min-h-[4.5rem]">
                                        {destination.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-2">
                                        <h3 className="text-2xl font-bold text-red-500">
                                            {destination.basePrice.toLocaleString("vi-VN")}₫
                                        </h3>

                                        <div className="flex gap-2">
                                            <Link to={`/tour/${destination.tourId}`}>
                                                <button className="px-3 py-2 bg-blue-500 rounded-md text-white">
                                                    Xem chi tiết
                                                </button>
                                            </Link>

                                            <button
                                                onClick={() => toggleFavorite(destination.tourId)}
                                                className={`p-2 rounded-md ${
                                                    favorites.includes(destination.tourId)
                                                        ? "bg-red-500"
                                                        : "bg-gray-300"
                                                }`}
                                            >
                                                <Heart
                                                    className="w-6 h-6"
                                                    color="white"
                                                    fill={
                                                        favorites.includes(destination.tourId)
                                                            ? "white"
                                                            : "none"
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {tours.length === 0 && allTours.length > 0 && (
                            <p className="text-center col-span-full text-gray-500 mt-5">
                                Không tìm thấy tour nào phù hợp với tiêu chí tìm kiếm.
                            </p>
                        )}
                        {allTours.length === 0 && (
                            <p className="text-center col-span-full text-gray-500 mt-5">
                                Đang tải danh sách tours...
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}