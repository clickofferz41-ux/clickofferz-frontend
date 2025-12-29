import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/categories`);
            setCategories(response.data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await axios.delete(`${API_URL}/api/admin/categories/${id}`);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                <Link
                    to="/admin/categories/new"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                    + Add New Category
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Icon</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Color</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <span className="text-3xl">{category.icon}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900">{category.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded border border-gray-300"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        <span className="text-sm text-gray-600">{category.color}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${category.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        to={`/admin/categories/edit/${category._id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {categories.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No categories found. Add your first category!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
