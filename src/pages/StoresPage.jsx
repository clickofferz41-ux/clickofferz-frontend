import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import StoreCard from '../components/StoreCard'
import { useGetStoresQuery } from '../store/api/apiSlice'

function StoresPage() {
    const [activeLetter, setActiveLetter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams] = useSearchParams();

    const { data: stores = [] } = useGetStoresQuery();
    const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) setSearchTerm(urlSearch);
    }, [searchParams]);

    const filteredStores = stores.filter((store) => {
        const matchesLetter = activeLetter === 'All' || store.name.toUpperCase().startsWith(activeLetter);
        const matchesSearch = !searchTerm || store.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesLetter && matchesSearch;
    });

    return (
        <div className="bg-background min-h-screen">
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-textMain mb-4">All Stores</h1>
                    <p className="text-gray-500 text-lg">Browse coupons and deals from hundreds of top stores</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search stores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md h-12 px-6 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                    />
                </div>

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

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {filteredStores.map((store) => (
                        <Link key={store.id} to={`/store/${store.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            <StoreCard store={store} />
                        </Link>
                    ))}
                </div>

                {filteredStores.length === 0 && (
                    <div className="text-center py-16 text-gray-400">No stores found matching your criteria.</div>
                )}
            </div>
        </div>
    );
}

export default StoresPage
