import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CouponCard from '../components/CouponCard'
import { useGetCouponsQuery, useGetCategoriesQuery } from '../store/api/apiSlice'
import useDebouncedValue from '../hooks/useDebouncedValue'

const LIMIT = 12;
const PAGE_WINDOW_SIZE = 7;

function getVisiblePages(totalPages, currentPage) {
    if (totalPages <= PAGE_WINDOW_SIZE) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfWindow = Math.floor(PAGE_WINDOW_SIZE / 2);
    let start = Math.max(1, currentPage - halfWindow);
    let end = Math.min(totalPages, start + PAGE_WINDOW_SIZE - 1);

    if (end - start + 1 < PAGE_WINDOW_SIZE) {
        start = Math.max(1, end - PAGE_WINDOW_SIZE + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function DealsPage() {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [page, setPage] = useState(1);
    const debouncedSearchTerm = useDebouncedValue(searchTerm.trim(), 350);

    const queryArgs = {
        type: 'Deal',
        page,
        limit: LIMIT,
        ...(activeFilter !== 'All' && { category: activeFilter }),
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    };

    const { data, isLoading, isFetching } = useGetCouponsQuery(queryArgs);
    const { data: categoriesData = [] } = useGetCategoriesQuery();

    const deals = data?.coupons ?? (Array.isArray(data) ? data : []);
    const totalPages = data?.pagination?.totalPages ?? 1;
    const categories = ['All', ...(Array.isArray(categoriesData) ? categoriesData.map((c) => c.name) : [])];
    const visiblePages = useMemo(() => getVisiblePages(totalPages, page), [totalPages, page]);

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
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="flex-grow h-12 px-6 rounded-lg border border-gray-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 shadow-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveFilter(cat);
                                    setPage(1);
                                }}
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
                                {visiblePages[0] > 1 && (
                                    <>
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            className="w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent"
                                        >
                                            1
                                        </button>
                                        {visiblePages[0] > 2 && <span className="px-1 text-gray-400">...</span>}
                                    </>
                                )}
                                {visiblePages.map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${page === pageNum ? 'bg-accent text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent'}`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                                {visiblePages[visiblePages.length - 1] < totalPages && (
                                    <>
                                        {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
                                        <button
                                            onClick={() => handlePageChange(totalPages)}
                                            className="w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent"
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
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
