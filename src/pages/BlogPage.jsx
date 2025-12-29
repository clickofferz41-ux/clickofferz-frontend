import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/blogs`);
                setBlogs(response.data.blogs || []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch blogs", error);
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-xl text-gray-400">Loading articles...</div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-primary text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">ClickOfferz Blog</h1>
                <p className="text-xl max-w-2xl mx-auto opacity-90">
                    Latest tips, tricks, and guides on how to save money and shop smarter.
                </p>
            </div>

            {/* Blog Grid */}
            <div className="container mx-auto px-4 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm">
                            <p className="text-gray-500 text-lg">No articles published yet. Check back soon!</p>
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <Link
                                key={blog._id}
                                to={`/blog/${blog.slug}`}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full"
                            >
                                <div className="h-48 overflow-hidden bg-gray-200">
                                    {blog.image ? (
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="text-4xl">📰</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex gap-2 mb-3">
                                        {blog.tags.slice(0, 2).map((tag, idx) => (
                                            <span key={idx} className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-primary transition-colors">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-1">
                                        {blog.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        <span>{blog.views} Reads</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
