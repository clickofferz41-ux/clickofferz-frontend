import React from 'react';
import { Link } from 'react-router-dom';
import { useGetSettingsQuery, useGetCategoriesQuery } from '../store/api/apiSlice';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaTiktok } from 'react-icons/fa';

const Footer = () => {
    const { data: settings } = useGetSettingsQuery();
    const { data: categoriesData = [] } = useGetCategoriesQuery();

    const socialLinks = settings?.socialLinks ?? {};

    const favoriteCategories = Array.isArray(categoriesData)
        ? categoriesData.slice(0, 5).map((cat) => ({
            name: cat.name,
            href: `/coupons?category=${encodeURIComponent(cat.name.toLowerCase())}`,
        }))
        : [];

    const siteLinks = [
        { name: 'Home', href: '/' },
        { name: 'Stores', href: '/stores' },
        { name: 'Categories', href: '/categories' },
        { name: 'Coupons', href: '/coupons' },
        { name: 'Deals', href: '/deals' },
        { name: 'Blog', href: '/blog' },
    ];

    const getHelp = [
        { name: 'About Us', href: '/about-us' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms and Conditions', href: '/terms-conditions' },
        { name: 'Cookie Policy', href: '/cookie-policy' },
        { name: 'Contact Us', href: '/contact-us' },
    ];

    const iconConfig = {
        facebook:  { icon: FaFacebook,  color: '#1877F2', name: 'Facebook' },
        instagram: { icon: FaInstagram, color: '#E4405F', name: 'Instagram' },
        twitter:   { icon: FaTwitter,   color: '#000000', name: 'Twitter' },
        youtube:   { icon: FaYoutube,   color: '#FF0000', name: 'YouTube' },
        linkedin:  { icon: FaLinkedin,  color: '#0A66C2', name: 'LinkedIn' },
        tiktok:    { icon: FaTiktok,    color: '#000000', name: 'TikTok' },
    };

    const activeSocials = Object.keys(socialLinks)
        .filter((key) => socialLinks[key])
        .map((key) => ({ ...iconConfig[key], url: socialLinks[key] }));

    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            {/* Newsletter Section */}
            <div className="bg-gray-800 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Subscribe To Our Weekly Newsletter!</h3>
                    <p className="text-gray-400 mb-6">Get the latest coupons and deals delivered to your inbox</p>
                    <div className="flex flex-col md:flex-row justify-center gap-3 max-w-xl mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-grow h-12 px-6 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                        />
                        <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all whitespace-nowrap">
                            SUBSCRIBE
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-white font-bold text-lg mb-4 uppercase">Favorite Categories</h4>
                            <ul className="space-y-2">
                                {favoriteCategories.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.href} className="hover:text-primary transition-colors text-sm">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-lg mb-4 uppercase">Site Links</h4>
                            <ul className="space-y-2">
                                {siteLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.href} className="hover:text-primary transition-colors text-sm">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-lg mb-4 uppercase">Get Help</h4>
                            <ul className="space-y-2">
                                {getHelp.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-lg mb-4">
                                Click<span className="text-primary">Offerz</span>
                            </h4>
                            <p className="text-sm text-gray-400 mb-4">
                                Your trusted source for saving money online since 2000. We've helped shoppers save over $1 billion.
                            </p>
                            <div className="flex gap-3 flex-wrap">
                                {activeSocials.length > 0 ? (
                                    activeSocials.map((social) => {
                                        const IconComponent = social.icon;
                                        return (
                                            <a
                                                key={social.name}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                                style={{ backgroundColor: social.color }}
                                                title={social.name}
                                            >
                                                <IconComponent className="text-white text-xl" />
                                            </a>
                                        );
                                    })
                                ) : (
                                    <span className="text-xs text-gray-500">Connect with us soon!</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-950 py-4 border-t border-gray-800">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    Copyright © 2024 ClickOfferz. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
