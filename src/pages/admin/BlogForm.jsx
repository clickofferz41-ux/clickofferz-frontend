import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        image: '',
        tags: '',
        isActive: true
    });

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/blogs/admin/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } // Enhance security if needed, or rely on global interceptor if it exists. 
                // Assuming global interceptor or simple auth for now, but let's be safe and assume the protected route needs auth. 
                // Wait, if no interceptor, we need to pass token. The 'protect' middleware checks for Bearer token.
            });
            // Actually, in Admin pages we usually rely on a configured axios instance or pass token. 
            // Looking at other admin pages (e.g. `BlogList` line 17) it just does `axios.get`. 
            // If `BlogList` works, there must be a global interceptor setting the token? 
            // Let's check `context/AuthContext.js` or `main.jsx`. 
            // For now, I will use the same pattern as `BlogList` but pointing to the new correct endpoint.

            const blog = response.data;
            setFormData({
                title: blog.title,
                content: blog.content,
                excerpt: blog.excerpt,
                image: blog.image || '',
                tags: blog.tags.join(', '),
                isActive: blog.isActive
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch blog details');
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            };

            if (id) {
                await axios.put(`${API_URL}/api/blogs/${id}`, payload);
                toast.success('Blog updated successfully');
            } else {
                await axios.post(`${API_URL}/api/blogs`, payload);
                toast.success('Blog created successfully');
            }
            navigate('/admin/blogs');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save blog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>

            <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter blog title"
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (Short Summary)</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            required
                            maxLength={200}
                            rows={3}
                            className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            placeholder="Brief description for card view (max 200 chars)"
                        />
                        <p className="text-xs text-right text-gray-400 mt-1">{formData.excerpt.length}/200</p>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content (HTML Supported)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={15}
                            className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder="<p>Write your blog content here...</p>"
                        />
                        <p className="text-xs text-gray-500 mt-1">Basic HTML tags supported: &lt;p&gt;, &lt;h2&gt;, &lt;b&gt;, &lt;ul&gt;, etc.</p>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {formData.image && (
                            <img src={formData.image} alt="Preview" className="mt-4 h-40 object-cover rounded-lg border border-gray-200" />
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (Comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            placeholder="Savings, Tips, Black Friday"
                        />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="ml-3 text-sm font-medium text-gray-700">Publish immediately</label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white h-12 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Blog Post'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/blogs')}
                            className="px-8 bg-gray-200 text-gray-700 h-12 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogForm;
