import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetCouponsQuery } from '../store/api/apiSlice';
import CouponCard from './CouponCard';

const LatestCoupons = () => {
    const [filter, setFilter] = useState('All');
    const { data } = useGetCouponsQuery({ limit: 20 });
    const allCoupons = data?.coupons ?? (Array.isArray(data) ? data : []);

    const filteredCoupons = allCoupons.filter(c => {
        if (filter === 'All') return true;
        return c.type === filter;
    }).slice(0, 9);

    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-textMain mb-2">Latest Coupons & Deals</h2>
                        <p className="text-gray-500">Discover the best verified coupons from top stores</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        <button
                            onClick={() => setFilter('All')}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'All' ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('Code')}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'Code' ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}
                        >
                            Codes
                        </button>
                        <button
                            onClick={() => setFilter('Deal')}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'Deal' ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}
                        >
                            Deals
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCoupons.map((coupon) => (
                        <CouponCard key={coupon._id} coupon={coupon} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        to="/coupons"
                        className="inline-block px-8 py-3 bg-white border border-gray-200 text-textMain font-bold rounded-full hover:shadow-md transition-all"
                    >
                        View All Coupons
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestCoupons;
