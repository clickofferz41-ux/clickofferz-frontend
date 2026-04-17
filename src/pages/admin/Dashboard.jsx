import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStores: 0,
        totalCoupons: 0,
        activeCoupons: 0,
        expiredCoupons: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/stats`);
            setStats(response.data.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Total Stores', value: stats.totalStores, icon: '🏪', color: 'bg-blue-500' },
        { title: 'Total Coupons', value: stats.totalCoupons, icon: '🎫', color: 'bg-purple-500' },
        { title: 'Active Coupons', value: stats.activeCoupons, icon: '✅', color: 'bg-green-500' },
        { title: 'Expired Coupons', value: stats.expiredCoupons, icon: '⏰', color: 'bg-orange-500' },
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-4xl">{card.icon}</span>
                            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}>
                                {loading ? '...' : card.value}
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/stores/new"
                        className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <span className="text-2xl">➕</span>
                        <span className="font-medium text-gray-700">Add New Store</span>
                    </Link>
                    <Link
                        to="/admin/coupons/new"
                        className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                    >
                        <span className="text-2xl">🎁</span>
                        <span className="font-medium text-gray-700">Add New Coupon</span>
                    </Link>
                    <Link
                        to="/admin/coupons"
                        className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                        <span className="text-2xl">📋</span>
                        <span className="font-medium text-gray-700">View All Coupons</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
