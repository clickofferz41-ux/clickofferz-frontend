import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import CouponCard from '../components/CouponCard'
import Breadcrumbs from '../components/Breadcrumbs'
import Sidebar from '../components/Sidebar'
import { useGetStoreBySlugQuery, useGetCouponsByStoreQuery } from '../store/api/apiSlice'

function StorePage() {
    const { slug } = useParams();
    const [activeFilter, setActiveFilter] = useState('All');
    const [page, setPage] = useState(1);
    const filterTabs = ['All', 'Codes', 'Sales'];
    const LIMIT = 12;

    const { data: store, isLoading: storeLoading, isError: storeError } = useGetStoreBySlugQuery(slug);
    const { data: couponsResponse, isLoading: couponsLoading } = useGetCouponsByStoreQuery({ slug, page, limit: LIMIT }, {
        skip: !store,
    });
    const coupons = couponsResponse?.coupons ?? (Array.isArray(couponsResponse) ? couponsResponse : []);
    const totalPages = couponsResponse?.pagination?.totalPages ?? 1;

    const loading = storeLoading || couponsLoading;

    const filteredCoupons = coupons.filter((c) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Codes') return c.type === 'Code';
        if (activeFilter === 'Sales') return c.type === 'Deal';
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </div>
        );
    }

    if (storeError || !store) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-textMain mb-4">Store Not Found</h1>
                    <Link to="/stores" className="text-primary hover:underline">View All Stores</Link>
                </div>
            </div>
        );
    }

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Stores', href: '/stores' },
        { label: store.name },
    ];

    return (
        <div className="bg-background min-h-screen">
            {/* Store Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumbs items={breadcrumbs} />
                    <div className="flex items-center gap-6 mt-4">
                        <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden">
                            {store.logoType === 'upload' || store.logoType === 'url' ? (
                                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                            ) : store.logoType === 'emoji' ? (
                                <span className="text-4xl">{store.logo}</span>
                            ) : store.logoType === 'text' ? (
                                <span className="text-lg font-bold text-gray-600">{store.logo}</span>
                            ) : (
                                <span className="text-2xl font-bold text-gray-400">{store.logo}</span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-textMain mb-2">{store.name}</h1>
                            <p className="text-gray-500">{coupons.length} Active Coupons & Deals</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-yellow-500">★★★★★</span>
                                <span className="text-sm text-gray-500">4.5/5 (1,234 reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex gap-6">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveFilter(tab)}
                                className={`py-4 px-2 font-medium transition-colors border-b-2 ${activeFilter === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-textMain'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-textMain mb-6">Available Coupons & Deals</h2>
                        {filteredCoupons.length > 0 ? (
                            <div className="space-y-6">
                                {filteredCoupons.map((coupon) => (
                                    <CouponCard key={coupon._id} coupon={coupon} />
                                ))}
                                {totalPages > 1 && (
                                    <div className="pt-2 flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={page === 1}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium ${page === 1
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-primary'
                                                }`}
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-500">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={page === totalPages}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium ${page === totalPages
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-primary'
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-textMain mb-2">No Coupons Available</h3>
                                <p className="text-gray-500">Check back later for new deals from {store.name}!</p>
                            </div>
                        )}
                    </div>
                    <div><Sidebar /></div>
                </div>
            </div>
        </div>
    );
}

export default StorePage;
