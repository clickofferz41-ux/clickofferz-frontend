import React from 'react';
import { Link } from 'react-router-dom';
import { useGetStoresQuery } from '../store/api/apiSlice';
import StoreCard from './StoreCard';

const FeaturedStores = () => {
    const { data: stores = [] } = useGetStoresQuery();

    return (
        <section className="container mx-auto px-4 py-16">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold text-textMain">Featured Stores</h2>
                <Link to="/stores" className="text-primary font-medium hover:underline">View All Stores</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {stores.slice(0, 12).map((store) => (
                    <Link key={store.id} to={`/store/${store.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <StoreCard store={store} />
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FeaturedStores;
