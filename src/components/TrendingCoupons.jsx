import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import CouponCard from '../components/CouponCard';

const TrendingCoupons = () => {
    const [trendingCoupons, setTrendingCoupons] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/coupons?trending=true`)
            .then(res => res.json())
            .then(data => {
                // Handle new response format { coupons: [], pagination: {} }
                const items = data.coupons || data;
                setTrendingCoupons(Array.isArray(items) ? items : []);
            })
            .catch(err => {
                console.error('Failed to fetch trending coupons:', err);
                setTrendingCoupons([]); // Set empty array on error
            });
    }, []);

    const overlayColors = [
        'from-teal-400/20 to-teal-600/20',
        'from-yellow-400/20 to-yellow-600/20',
        'from-pink-400/20 to-pink-600/20',
        'from-purple-400/20 to-purple-600/20',
        'from-blue-400/20 to-blue-600/20',
        'from-orange-400/20 to-orange-600/20',
    ];

    return (
        <section className="bg-white py-16 border-y border-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-textMain mb-8">
                    Trending Coupons, Discounts & Promotions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trendingCoupons.map((coupon, index) => (
                        <div key={coupon._id} className="relative">
                            {/* Colored overlay background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${overlayColors[index % overlayColors.length]} rounded-xl -z-10`}></div>
                            <CouponCard coupon={coupon} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link
                        to="/trending"
                        className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-md"
                    >
                        View All Trending Coupons
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TrendingCoupons;
