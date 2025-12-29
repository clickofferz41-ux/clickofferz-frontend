import React, { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import FeaturedStores from '../components/FeaturedStores'
import TrendingCoupons from '../components/TrendingCoupons'
import PopularStores from '../components/PopularStores'
import LatestCoupons from '../components/LatestCoupons'
import BlogSection from '../components/BlogSection'
import Newsletter from '../components/Newsletter'
import { Link } from 'react-router-dom'
import { API_URL } from '../config'

import SEO from '../components/SEO'

function HomePage() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/categories`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data.slice(0, 12));
                }
            })
            .catch(err => {
                console.error('Failed to fetch categories:', err);
                setCategories([]); // Set empty array on error
            });
    }, []);

    return (
        <>
            <SEO
                title="Home"
                description="Discover the best coupons, promo codes, and deals for your favorite stores. Save money on every purchase with ClickOfferz."
                keywords="coupons, promo codes, deals, discounts, savings, online shopping"
            />
            <Hero />
            <FeaturedStores />
            <TrendingCoupons />
            <PopularStores />
            <LatestCoupons />
            <BlogSection />

            {/* Categories Section */}
            <section className="bg-white py-16 border-t border-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Top Categories</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat._id || cat.name}
                                to={`/coupons?category=${encodeURIComponent(cat.name.toLowerCase())}`}
                                className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all font-medium"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    )
}

export default HomePage
