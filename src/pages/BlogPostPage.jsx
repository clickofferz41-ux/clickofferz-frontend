import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const BlogPostPage = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/blogs/${slug}`);
                setBlog(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch blog post", error);
                setError("Article not found");
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-white"></div>;
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link to="/blog" className="bg-primary text-white px-6 py-2 rounded-full font-bold">Back to Blog</Link>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Hero Image */}
            <div className="h-[40vh] md:h-[50vh] relative w-full overflow-hidden bg-gray-900">
                {blog.image && (
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="flex gap-2 mb-4">
                            {blog.tags.map((tag, idx) => (
                                <span key={idx} className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            {blog.title}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-300 text-sm">
                            <span>By {blog.author || 'ClickOfferz Team'}</span>
                            <span>•</span>
                            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <article className="container mx-auto px-4 max-w-3xl -mt-10 relative z-10">
                <div className="bg-white rounded-t-3xl p-6 md:p-12 shadow-sm min-h-[500px]">
                    <div
                        className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Share this article</h3>
                        <div className="flex gap-4">
                            {/* Simple share buttons placeholders */}
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Facebook</button>
                            <button className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-600">Twitter</button>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">WhatsApp</button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Back Button */}
            <div className="fixed bottom-8 right-8 z-20">
                <Link to="/blog" className="bg-white text-gray-800 p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center border border-gray-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </Link>
            </div>
        </div>
    );
};

export default BlogPostPage;
