import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        icon: '📁',
        image: '',
        imageType: 'emoji', // emoji, url, upload
        color: '#3B82F6',
        isActive: true
    });

    useEffect(() => {
        if (id) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/categories`);
            const category = response.data.find(c => c._id === id);
            if (category) {
                // Backward compatibility for old categories
                setFormData({
                    ...category,
                    imageType: category.imageType || 'emoji',
                    image: category.image || '',
                    icon: category.icon || '📁'
                });
            }
        } catch (error) {
            toast.error('Failed to fetch category');
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("File selected:", file.name, file.size, file.type);
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log("File read complete. Base64 length:", reader.result.length);
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Submitting formData:", formData);

        try {
            const payload = { ...formData };
            if (payload.imageType === 'emoji') {
                payload.icon = payload.icon || '📁'; // Ensure icon is set if emoji type
            }
            if (payload.imageType === 'upload' && !payload.image) {
                console.warn("Upload selected but no image content present");
            }

            console.log("Sending payload:", payload);

            if (id) {
                await axios.put(`${API_URL}/api/admin/categories/${id}`, payload);
                toast.success('Category updated successfully');
            } else {
                await axios.post(`${API_URL}/api/admin/categories`, payload);
                toast.success('Category created successfully');
            }
            navigate('/admin/categories');
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.response?.data?.error || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {id ? 'Edit Category' : 'Add New Category'}
            </h1>

            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="e.g., Fashion, Electronics"
                        />
                    </div>

                    {/* Image Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icon Type
                        </label>
                        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                            {['emoji', 'url', 'upload'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, imageType: type })}
                                    className={`px-4 py-2 rounded-md capitalization transition-all ${formData.imageType === type
                                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Image Input */}
                    {formData.imageType === 'emoji' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Icon (Emoji)
                            </label>
                            <input
                                type="text"
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="👗"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Use emoji: 👗 📱 ✈️ 🏠 🍔 etc.
                            </p>
                        </div>
                    )}

                    {formData.imageType === 'url' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image URL
                            </label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="https://example.com/icon.png"
                            />
                        </div>
                    )}

                    {formData.imageType === 'upload' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100"
                            />
                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="mt-4 h-20 w-20 object-cover rounded-lg border border-gray-200"
                                />
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color Theme
                        </label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="flex-1 h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="#3B82F6"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="ml-3 text-sm font-medium text-gray-700">
                            Active (Show on website)
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white h-12 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : id ? 'Update Category' : 'Create Category'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/categories')}
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

export default CategoryForm;
