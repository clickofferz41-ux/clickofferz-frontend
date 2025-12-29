import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState({ stores: [], coupons: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [data, setData] = useState({ stores: [], coupons: [] });
    const navigate = useNavigate();

    // Fetch stores and coupons for autocomplete
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [storesRes, couponsRes] = await Promise.all([
                    fetch(`${API_URL}/api/stores`),
                    fetch(`${API_URL}/api/coupons?limit=100`) // Get more for search
                ]);

                const stores = await storesRes.json();
                const couponsData = await couponsRes.json();

                // Handle new response format { coupons: [], pagination: {} }
                const coupons = couponsData.coupons || couponsData;
                const storesArray = Array.isArray(stores) ? stores : [];
                const couponsArray = Array.isArray(coupons) ? coupons : [];

                setData({ stores: storesArray, coupons: couponsArray });
            } catch (error) {
                console.error('Error fetching search data:', error);
                setData({ stores: [], coupons: [] }); // Set empty on error
            }
        };
        fetchData();
    }, []);

    // Filter suggestions as user types
    React.useEffect(() => {
        if (searchQuery.length > 0) {
            const query = searchQuery.toLowerCase();

            const matchingStores = data.stores
                .filter(store => store.name.toLowerCase().includes(query))
                .slice(0, 3);

            const matchingCoupons = data.coupons
                .filter(coupon =>
                    coupon.title.toLowerCase().includes(query) ||
                    coupon.storeName.toLowerCase().includes(query)
                )
                .slice(0, 3);

            if (matchingStores.length > 0 || matchingCoupons.length > 0) {
                setSuggestions({ stores: matchingStores, coupons: matchingCoupons });
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    }, [searchQuery, data]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            // Default to searching stores if generic search
            navigate(`/stores?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleStoreClick = (storeName) => {
        setSearchQuery(storeName);
        setShowSuggestions(false);
        navigate(`/store/${storeName.toLowerCase().replace(/\s+/g, '-')}`);
    };

    const handleCouponClick = (coupon) => {
        setSearchQuery(coupon.title);
        setShowSuggestions(false);
        const path = coupon.type === 'Deal' ? '/deals' : '/coupons';
        navigate(`${path}?search=${encodeURIComponent(coupon.title)}`);
    };

    return (
        <section className="bg-gradient-to-br from-blue-50 to-white py-20 border-b border-gray-100 relative">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center" onClick={() => setShowSuggestions(false)}>
                    <h1 className="text-5xl md:text-6xl font-bold text-textMain mb-4">
                        Your Favorite Stores. <span className="text-primary">The Best Deals.</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Saving Shoppers <span className="font-bold text-primary">$1 Billion</span> Since 2000
                    </p>

                    {/* Search Bar */}
                    <div className="relative mb-10 max-w-2xl mx-auto z-20">
                        <form onSubmit={handleSearch}>
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Search stores, coupons, deals..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                                        className="w-full h-14 px-6 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm text-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    {/* Suggestions Dropdown */}
                                    {showSuggestions && (suggestions.stores.length > 0 || suggestions.coupons.length > 0) && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden text-left z-50 max-h-96 overflow-y-auto">

                                            {/* Stores Section */}
                                            {suggestions.stores.length > 0 && (
                                                <div className="border-b border-gray-100 last:border-0">
                                                    <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Stores
                                                    </div>
                                                    {suggestions.stores.map((store) => (
                                                        <div
                                                            key={store._id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStoreClick(store.name);
                                                            }}
                                                            className="px-6 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {store.logo && (
                                                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden text-lg">
                                                                        {store.logo}
                                                                    </div>
                                                                )}
                                                                <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                                                                    {store.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Coupons Section */}
                                            {suggestions.coupons.length > 0 && (
                                                <div>
                                                    <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Coupons & Deals
                                                    </div>
                                                    {suggestions.coupons.map((coupon) => (
                                                        <div
                                                            key={coupon._id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCouponClick(coupon);
                                                            }}
                                                            className="px-6 py-3 hover:bg-blue-50 cursor-pointer group"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-medium text-gray-700 group-hover:text-primary truncate max-w-[200px] md:max-w-sm">
                                                                        {coupon.title}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400">
                                                                        {coupon.storeName}
                                                                    </p>
                                                                </div>
                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                                                                    {coupon.discount || 'Deal'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-md whitespace-nowrap h-14"
                                >
                                    Find Deals
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-8 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">✓</span>
                            <span className="font-semibold text-gray-700">VERIFIED COUPONS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🏪</span>
                            <span className="font-semibold text-gray-700">5000+ STORES</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🔥</span>
                            <span className="font-semibold text-gray-700">DAILY UPDATES</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
