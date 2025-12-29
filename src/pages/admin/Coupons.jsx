import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/coupons`);
            setCoupons(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await axios.delete(`${API_URL}/api/admin/coupons/${id}`);
            toast.success('Coupon deleted successfully');
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to delete coupon');
        }
    };

    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.title.toLowerCase().includes(search.toLowerCase()) ||
            coupon.storeName.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || coupon.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Coupons Management</h1>
                <Link
                    to="/admin/coupons/new"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                    + Add New Coupon
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search coupons..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 max-w-md h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                    <option value="all">All Types</option>
                    <option value="Code">Code</option>
                    <option value="Deal">Deal</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Store</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Title</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Type</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Code</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Discount</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredCoupons.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No coupons found
                                </td>
                            </tr>
                        ) : (
                            filteredCoupons.map((coupon) => (
                                <tr key={coupon._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{coupon.storeName}</td>
                                    <td className="px-6 py-4 text-gray-600">{coupon.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${coupon.type === 'Code' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {coupon.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm">{coupon.code || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{coupon.discount || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/coupons/edit/${coupon._id}`}
                                                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(coupon._id, coupon.title)}
                                                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Coupons;
