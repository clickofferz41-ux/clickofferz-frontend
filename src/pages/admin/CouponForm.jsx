import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const CouponForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        storeName: '',
        title: '',
        description: '',
        code: '',
        type: 'Code',
        discount: '',
        category: '',
        expiry: '',
        link: '',
        relatedCoupons: [],
        usageCount: 0,
        isActive: true
    });

    useEffect(() => {
        fetchStores();
        fetchCategories();
        if (id) {
            fetchCoupon();
        }
    }, [id]);

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/stores`);
            setStores(response.data);
        } catch (error) {
            console.error('Failed to fetch stores');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchCoupon = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/coupons`);
            const coupon = response.data.find(c => c._id === id);
            if (coupon) {
                setFormData(coupon);
            }
        } catch (error) {
            toast.error('Failed to fetch coupon');
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        // If storeName is changed, update logo from the selected store
        if (e.target.name === 'storeName' && value) {
            const selectedStore = stores.find(s => s.name === value);
            if (selectedStore) {
                setFormData({
                    ...formData,
                    storeName: value,
                    storeId: selectedStore._id,
                    storeLogo: selectedStore.logo,
                    storeLogoType: selectedStore.logoType || 'emoji'
                });
                return;
            }
        }

        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await axios.put(`${API_URL}/api/admin/coupons/${id}`, formData);
                toast.success('Coupon updated successfully');
            } else {
                await axios.post(`${API_URL}/api/admin/coupons`, formData);
                toast.success('Coupon created successfully');
            }
            navigate('/admin/coupons');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save coupon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {id ? 'Edit Coupon' : 'Add New Coupon'}
            </h1>

            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Store *
                        </label>
                        <select
                            name="storeName"
                            value={formData.storeName}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">Select a store</option>
                            {stores.map(store => (
                                <option key={store._id} value={store.name}>{store.name}</option>
                            ))}
                        </select>
                    </div>



                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="e.g., 20% Off on All Products"
                            />
                        </div>
                        <div className="w-32">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Used Count
                            </label>
                            <input
                                type="number"
                                name="usageCount"
                                value={formData.usageCount || 0}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type *
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="Code">Code</option>
                            <option value="Deal">Deal</option>
                        </select>
                    </div>

                    {formData.type === 'Code' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Coupon Code
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="e.g., SAVE20"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount
                        </label>
                        <input
                            type="text"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="e.g., 20% OFF"
                        />
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
                            Expiry Date (Optional)
                        </label>
                        <input
                            type="date"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Leave empty if coupon doesn't expire
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Coupon/Deal Link
                        </label>
                        <input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="https://example.com/promo"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Website URL where this coupon can be used
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Related Coupon Codes (Optional)
                        </label>
                        <textarea
                            name="relatedCoupons"
                            value={formData.relatedCoupons?.join(', ') || ''}
                            onChange={(e) => {
                                const codes = e.target.value.split(',').map(code => code.trim()).filter(Boolean);
                                setFormData({ ...formData, relatedCoupons: codes });
                            }}
                            className="w-full h-24 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="SAVE20, MEGA20, SUMMER20"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Add multiple codes separated by commas. Great for deals with alternative codes!
                        </p>
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
                            placeholder="Coupon description..."
                        />
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

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isTrending"
                            checked={formData.isTrending || false}
                            onChange={handleChange}
                            className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-400"
                        />
                        <label className="ml-3 text-sm font-medium text-gray-700">
                            🔥 Set as Trending (Show on Homepage)
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white h-12 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : id ? 'Update Coupon' : 'Create Coupon'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/coupons')}
                            className="px-8 bg-gray-200 text-gray-700 h-12 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default CouponForm;
