import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CouponCard from '../components/CouponCard'
import { useGetCouponsQuery, useGetCategoriesQuery } from '../store/api/apiSlice'

const LIMIT = 12;

function DealsPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) setSearchTerm(urlSearch);
    }, [searchParams]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [activeFilter, searchTerm]);

    const queryArgs = {
        type: 'Deal',
        page,
        limit: LIMIT,
        ...(activeFilter !== 'All' && { category: activeFilter }),
        ...(searchTerm && { search: searchTerm }),
    };

    const { data, isLoading, isFetching } = useGetCouponsQuery(queryArgs);
    const { data: categoriesData = [] } = useGetCategoriesQuery();

    const deals = data?.coupons ?? (Array.isArray(data) ? data : []);
    const totalPages = data?.pagination?.totalPages ?? 1;
    const categories = ['All', ...(Array.isArray(categoriesData) ? categoriesData.map((c) => c.name) : [])];

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="bg-gradient-to-br from-accent to-orange-600">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-4xl font-bold text-white mb-4">Daily Deals</h1>
                    <p className="text-orange-100 text-lg">No code needed - just click and save instantly</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search deals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow h-12 px-6 rounded-lg border border-gray-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 shadow-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${activeFilter === cat
                                    ? 'bg-accent text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 mb-8 flex items-center justify-between border border-gray-100">
                    <span className="text-gray-600">
                        Showing <span className="font-bold text-textMain">{deals.length}</span> results on this page
                    </span>
                    <Link to="/coupons" className="text-accent font-medium hover:underline">View Coupon Codes Instead →</Link>
                </div>

                {isLoading || isFetching ? (
                    <div className="text-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading deals...</p>
                    </div>
                ) : deals.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {deals.map((deal) => (
                                <CouponCard key={deal._id} coupon={deal} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${page === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-accent'}`}
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNum = index + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${page === pageNum ? 'bg-accent text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${page === totalPages ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-accent'}`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-textMain mb-2">No Deals Found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DealsPage
