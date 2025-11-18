import React,{ useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import TopBanner from '../../components/TopBanner';
import { getAllTours } from '../../services/tourService';

export default function ToursList() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await getAllTours();
                setTours(data); 
            } catch (error) {
                console.error("Failed to fetch tours:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);
    return (
        <>
            <TopBanner text="Our Tours" />

            <section className='w-full py-16'>
                <div className='max-w-7xl mx-auto px-4 md:px-6'>
                    <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-3 font-serif'>All Destinations</h2>
                    <hr className='text-red-500 w-[200px] bg-red-500 mx-auto h-1 mb-10' />
                    
                    {/* Hiển thị tour dạng lưới */}
                    {loading ? (
                        <div className='text-center text-xl'>Loading tours...</div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.map((destination, index) => (
                            <div key={index} className='overflow-hidden border shadow-lg shadow-gray-500 rounded-lg'>
                                <div className=''>
                                    <img 
                                    src={destination.img} 
                                    alt={destination.name} 
                                    width={600} 
                                    height={400}
                                    className='object-cover w-full h-48 hover:scale-110 transition-all'
                                    />
                                    <div className='p-4'>
                                        <p className='text-gray-500 flex items-center gap-1 text-sm mb-1'><Clock width={15}/>{destination.time}</p>
                                        <h3 className='text-xl font-bold mb-2'>{destination.name}</h3>
                                        <p className='flex gap-1 items-center'><Star width={20} fill='red'/>{destination.star}</p>
                                        <p className='text-gray-600 mb-4 mt-2'>Experience the beauty and culture of {destination.name}</p>
                                        <div className='flex gap-4'>
                                            <button className='px-3 py-2 bg-red-500 rounded-md text-white'>${destination.price}</button>
                                            <Link to={`/tour/${destination.tourId}`}>
                                                <button className='px-3 py-2 bg-black rounded-md text-white'>Learn More</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>                 
            </section>
        </>
    );
}