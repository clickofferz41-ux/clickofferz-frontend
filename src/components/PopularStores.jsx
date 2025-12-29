import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const PopularStores = () => {
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
            <h2 className="text-3xl font-bold text-textMain mb-8">Popular Stores</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {stores.map((store) => (
                    <Link
                        key={store.id}
                        to={`/store/${store.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="group bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-xl font-bold text-gray-400 mb-4 group-hover:bg-blue-50 group-hover:text-primary transition-colors overflow-hidden">
                            {(store.logo && (store.logo.startsWith('http') || store.logo.startsWith('data:'))) ? (
                                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                            ) : (
                                store.logo || store.name.charAt(0)
                            )}
                        </div>
                        <h3 className="font-semibold text-textMain text-center mb-2 group-hover:text-primary transition-colors">
                            {store.name}
                        </h3>
                        <span className="text-primary text-sm font-medium">
                            {store.offers}+ Coupons
                        </span>
                    </Link>
                ))}
            </div>

            <div className="text-center mt-8">
                <Link
                    to="/stores"
                    className="inline-block text-primary font-bold hover:underline"
                >
                    View All Stores →
                </Link>
            </div>
        </section>
    );
};

export default PopularStores;
