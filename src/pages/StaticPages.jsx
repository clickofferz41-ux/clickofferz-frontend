import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const DynamicPage = ({ slug, defaultTitle }) => {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/pages/${slug}`);
                setPage(response.data);
                setLoading(false);
            } catch (error) {
                console.error(`Failed to fetch page: ${slug}`, error);
                setLoading(false);
            }
        };
        fetchPage();
    }, [slug]);

    if (loading) return <div className="min-h-screen pt-20 text-center text-gray-400">Loading content...</div>;

    const title = page?.title || defaultTitle;
    const content = page?.content || '<p>Content not available.</p>';

    return (
        <div className="bg-gray-50 min-h-screen py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-6 border-gray-100">
                        {title}
                    </h1>

                    {/* Render HTML Content */}
                    <div
                        className="prose prose-lg prose-blue max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    {/* Contact Form Injection for Contact Us page */}
                    {slug === 'contact-us' && (
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h3>
                            <form className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" placeholder="Your Name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" placeholder="your@email.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea rows="5" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" placeholder="How can we help?"></textarea>
                                </div>
                                <button className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-opacity-90 shadow-lg shadow-primary/30">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DynamicPage;
