import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/stores`);
            setStores(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch stores');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await axios.delete(`${API_URL}/api/admin/stores/${id}`);
            toast.success('Store deleted successfully');
            fetchStores();
        } catch (error) {
            toast.error('Failed to delete store');
        }
    };

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Stores Management</h1>
                <Link
                    to="/admin/stores/new"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                    + Add New Store
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search stores..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Logo</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Offers</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredStores.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No stores found
                                </td>
                            </tr>
                        ) : (
                            filteredStores.map((store) => (
                                <tr key={store._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                            {store.logoType === 'upload' || store.logoType === 'url' ? (
                                                <img
                                                    src={store.logo}
                                                    alt={store.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : store.logoType === 'emoji' ? (
                                                <span className="text-2xl">{store.logo}</span>
                                            ) : store.logoType === 'text' ? (
                                                <span className="text-xs font-bold">{store.logo}</span>
                                            ) : (
                                                <span className="text-xl">{store.logo}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{store.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{store.category || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-600">{store.offers}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/stores/edit/${store._id}`}
                                                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(store._id, store.name)}
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

export default Stores;
