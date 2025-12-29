import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../config'

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/categories`);
            const data = await response.json();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center">
                <div className="text-gray-400">Loading categories...</div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-textMain mb-4">Browse Categories</h1>
                    <p className="text-gray-500 text-lg">Find the best deals organized by category</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {categories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No categories available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category._id}
                                to={`/coupons?category=${category.name.toLowerCase()}`}
                                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center"
                            >
                                <div className="w-20 h-20 mb-4 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110">
                                    {category.imageType === 'upload' || category.imageType === 'url' ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl">{category.icon || '📁'}</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-textMain group-hover:text-primary transition-colors mb-2">
                                    {category.name}
                                </h3>
                                <span className="text-gray-400 text-sm">{category.couponCount || 0} Coupons</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoriesPage;
