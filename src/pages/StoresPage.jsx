import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { API_URL } from '../config';
import StoreCard from '../components/StoreCard'

function StoresPage() {
    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [activeLetter, setActiveLetter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams] = useSearchParams();

    const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

    useEffect(() => {
        fetch(`${API_URL}/api/stores`)
            .then(res => res.json())
            .then(data => {
                setStores(data);
                setFilteredStores(data);
            })
            .catch(err => console.error('Failed to fetch stores:', err));
    }, []);

    // Handle URL search param
    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearchTerm(urlSearch);
        }
    }, [searchParams]);

    useEffect(() => {
        let result = stores;

        if (activeLetter !== 'All') {
            result = result.filter(store =>
                store.name.toUpperCase().startsWith(activeLetter)
            );
        }

        if (searchTerm) {
            result = result.filter(store =>
                store.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredStores(result);
    }, [activeLetter, searchTerm, stores]);

    return (
        <div className="bg-background min-h-screen">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-textMain mb-4">All Stores</h1>
                    <p className="text-gray-500 text-lg">Browse coupons and deals from hundreds of top stores</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search stores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md h-12 px-6 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                    />
                </div>

                {/* Alphabetical Filter */}
                <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-gray-100">
                    {alphabet.map((letter) => (
                        <button
                            key={letter}
                            onClick={() => setActiveLetter(letter)}
                            className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${activeLetter === letter
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                {/* Stores Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {filteredStores.map((store) => (
                        <Link key={store.id} to={`/store/${store.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            <StoreCard store={store} />
                        </Link>
                    ))}
                </div>

                {filteredStores.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        No stores found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}

export default StoresPage;
