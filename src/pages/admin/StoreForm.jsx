import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const StoreForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        logoType: 'emoji',
        category: '',
        website: '',
        description: '',
        offers: 0
    });

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchStore();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchStore = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/stores`);
            const store = response.data.find(s => s._id === id);
            if (store) {
                setFormData(store);
            }
        } catch (error) {
            toast.error('Failed to fetch store');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            // Validate file size (max 2MB before compression)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }

            // Compress and convert to base64
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas for compression
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Max dimensions for logo (200x200)
                    const MAX_WIDTH = 200;
                    const MAX_HEIGHT = 200;
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions maintaining aspect ratio
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

                    setFormData({
                        ...formData,
                        logo: compressedBase64,
                        logoType: 'upload'
                    });

                    toast.success('Image uploaded and optimized!');
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await axios.put(`${API_URL}/api/admin/stores/${id}`, formData);
                toast.success('Store updated successfully');
            } else {
                await axios.post(`${API_URL}/api/admin/stores`, formData);
                toast.success('Store created successfully');
            }
            navigate('/admin/stores');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save store');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {id ? 'Edit Store' : 'Add New Store'}
            </h1>

            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Store Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="e.g., Amazon"
                        />
                    </div>

                    {/* Logo Type Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Logo Type *
                        </label>
                        <select
                            name="logoType"
                            value={formData.logoType}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    logoType: e.target.value,
                                    logo: '' // Clear logo when changing type
                                });
                            }}
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="emoji">Emoji (🛍️)</option>
                            <option value="text">Text (Store Name)</option>
                            <option value="upload">Upload Image</option>
                            <option value="url">Image URL</option>
                        </select>
                    </div>

                    {/* Logo Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {formData.logoType === 'emoji' && 'Logo Emoji *'}
                            {formData.logoType === 'text' && 'Logo Text *'}
                            {formData.logoType === 'upload' && 'Upload Logo Image *'}
                            {formData.logoType === 'url' && 'Logo Image URL *'}
                        </label>

                        {formData.logoType === 'upload' ? (
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {formData.logo && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                        <img
                                            src={formData.logo}
                                            alt="Logo preview"
                                            className="w-24 h-24 object-contain border border-gray-200 rounded-lg p-2"
                                        />
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Max size: 2MB. Formats: JPG, PNG, GIF, SVG
                                </p>
                            </div>
                        ) : (
                            <input
                                type={formData.logoType === 'url' ? 'url' : 'text'}
                                name="logo"
                                value={formData.logo}
                                onChange={handleChange}
                                required
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder={
                                    formData.logoType === 'emoji' ? '🛍️' :
                                        formData.logoType === 'text' ? 'Store Name' :
                                            'https://example.com/logo.png'
                                }
                            />
                        )}

                        {formData.logoType === 'emoji' && (
                            <p className="text-xs text-gray-500 mt-1">
                                Paste an emoji like 🛍️ 📱 👟 🏠
                            </p>
                        )}
                        {formData.logoType === 'url' && (
                            <p className="text-xs text-gray-500 mt-1">
                                Enter full URL to logo image
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website URL
                        </label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Offers
                        </label>
                        <input
                            type="number"
                            name="offers"
                            value={formData.offers}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="Store description..."
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white h-12 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : id ? 'Update Store' : 'Create Store'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/stores')}
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

export default StoreForm;
