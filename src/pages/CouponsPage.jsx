import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CouponCard from '../components/CouponCard'
import { API_URL } from '../config'

function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams] = useSearchParams();

    // Pagination State
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 12;

    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearchTerm(urlSearch);
        }

        const urlCategory = searchParams.get('category');
        if (urlCategory) {
            setActiveFilter(urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1));
        }
    }, [searchParams]);

    // Fetch Categories
    useEffect(() => {
        fetch(`${API_URL}/api/categories`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const categoryNames = ['All', ...data.map(c => c.name)];
                    setCategories(categoryNames);
                }
            })
            .catch(err => console.error('Failed to fetch categories:', err));
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        setCoupons([]);
        setFilteredCoupons([]);
        setPage(1);
        fetchCoupons(1);
    }, [activeFilter, searchTerm]);

    const fetchCoupons = (pageNum) => {
        setLoading(true);

        // Always request with pagination params, but handle legacy array response
        let query = `${API_URL}/api/coupons?page=${pageNum}&limit=${LIMIT}`;

        if (activeFilter !== 'All') {
            query += `&category=${encodeURIComponent(activeFilter)}`;
        }
        if (searchTerm) {
            query += `&search=${encodeURIComponent(searchTerm)}`;
        }

        fetch(query)
            .then(res => res.json())
            .then(data => {
                let items = [];
                let total = 0;
                let calculatedTotalPages = 1;

                if (Array.isArray(data)) {
                    // Legacy/Fallback: Backend returned all items (array)
                    // We must paginate client-side
                    total = data.length;
                    calculatedTotalPages = Math.ceil(total / LIMIT);

                    // Slice for current page
                    const startIndex = (pageNum - 1) * LIMIT;
                    const endIndex = startIndex + LIMIT;
                    items = data.slice(startIndex, endIndex);
                } else {
                    // New Format: Backend handled pagination
                    items = data.coupons || [];
                    const meta = data.pagination || {};
                    total = meta.total || 0;
                    calculatedTotalPages = meta.totalPages || 1;
                }

                setCoupons(items);
                setFilteredCoupons(items);
                setTotalPages(calculatedTotalPages);
                setLoading(false);

                // Scroll to top of grid
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(err => {
                console.error('Failed to fetch coupons:', err);
                setLoading(false);
            });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            fetchCoupons(newPage);
        }
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Page Header */}
            <div className="bg-gradient-to-br from-primary to-blue-700">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-4xl font-bold text-white mb-4">Coupons & Deals</h1>
                    <p className="text-blue-100 text-lg">Verified promo codes that save you money at checkout</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow h-12 px-6 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${activeFilter === cat
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="bg-white rounded-xl p-4 mb-8 flex items-center justify-between border border-gray-100">
                    <span className="text-gray-600">
                        Showing <span className="font-bold text-textMain">{filteredCoupons.length}</span> results on this page
                    </span>
                    <Link to="/deals" className="text-primary font-medium hover:underline">
                        View Deals Instead →
                    </Link>
                </div>

                {/* Coupons Grid */}
                {loading ? (
                    <div className="text-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading coupons...</p>
                    </div>
                ) : filteredCoupons.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCoupons.map((coupon) => (
                                <CouponCard key={coupon._id} coupon={coupon} />
                            ))}
                        </div>

                        {/* Numbered Pagination */}
                        <div className="mt-12 flex justify-center items-center gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium ${page === 1
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-primary'
                                    }`}
                            >
                                Previous
                            </button>

                            {/* Page Numbers */}
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                // Simple logic: show all pages if small count, or basic range
                                // handling huge page counts (e.g., > 10) appropriately is a nice-to-have,
                                // but for now mapping all is okay if <= 10.
                                // Let's adding basic truncation if needed later, but standard mapping is requested "1 2 3".
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${page === pageNum
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium ${page === totalPages
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-primary'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-textMain mb-2">No Coupons Found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CouponsPage;
