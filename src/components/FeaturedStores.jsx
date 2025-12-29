import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import StoreCard from './StoreCard';

const FeaturedStores = () => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/stores`)
            .then(res => res.json())
            .then(data => {
                const items = Array.isArray(data) ? data : [];
                setStores(items.slice(0, 12));
            })
            .catch(err => {
                console.error('Failed to fetch stores:', err);
                setStores([]); // Set empty array on error
            });
    }, []);

    return (
        <section className="container mx-auto px-4 py-16">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold text-textMain">Featured Stores</h2>
                <Link to="/stores" className="text-primary font-medium hover:underline">View All Stores</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {stores.map((store) => (
                    <Link key={store.id} to={`/store/${store.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <StoreCard store={store} />
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FeaturedStores;
