import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { token, user } = useAuth();

    // --- Profile & Social Media State ---
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPasswordProfile: ''
    });

    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        tiktok: '',
        linkedin: ''
    });

    // --- Password Change State ---
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingLinks, setLoadingLinks] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    // Fetch initial settings
    useEffect(() => {
        if (user) {
            setProfileData(prev => ({ ...prev, name: user.name, email: user.email }));
        }
        fetchSettings();
    }, [user]);

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/settings`);
            if (res.data && res.data.socialLinks) {
                setSocialLinks(prev => ({ ...prev, ...res.data.socialLinks }));
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
        }
    };

    // --- Handlers ---
    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handleSocialChange = (e) => setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    // Update Profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            await axios.put(
                `${API_URL}/api/auth/update-profile`,
                {
                    name: profileData.name,
                    email: profileData.email,
                    currentPassword: profileData.currentPasswordProfile
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Profile updated! Re-login if email changed.');
            setProfileData(prev => ({ ...prev, currentPasswordProfile: '' }));
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    // Update Social Links
    const handleUpdateLinks = async (e) => {
        e.preventDefault();
        setLoadingLinks(true);
        try {
            await axios.put(
                `${API_URL}/api/settings`,
                { socialLinks },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Social media links updated!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update links');
        } finally {
            setLoadingLinks(false);
        }
    };

    // Update Password
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("New passwords don't match");
        }
        if (passwordData.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoadingPassword(true);
        try {
            await axios.put(
                `${API_URL}/api/auth/update-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update password');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Settings</h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* 1. Profile Settings */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">👤 Profile Settings</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-red-600">Current Password (Required)</label>
                            <input type="password" name="currentPasswordProfile" value={profileData.currentPasswordProfile} onChange={handleProfileChange} required className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="Confirm with password" />
                        </div>
                        <button type="submit" disabled={loadingProfile} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
                            {loadingProfile ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* 2. Change Password */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">🔒 Change Password</h2>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <button type="submit" disabled={loadingPassword} className="w-full bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-900 transition">
                            {loadingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* 3. Social Media Links */}
                <div className="bg-white rounded-xl shadow-md p-8 xl:col-span-2">
                    <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">🌐 Social Media Links</h2>
                    <form onSubmit={handleUpdateLinks}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.keys(socialLinks).map((key) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                                    <div className="flex mt-1">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            http://
                                        </span>
                                        <input
                                            type="text"
                                            name={key}
                                            value={socialLinks[key]}
                                            onChange={handleSocialChange}
                                            className="flex-1 block w-full px-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder={`Enter ${key} URL`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="submit" disabled={loadingLinks} className="mt-6 w-full md:w-auto px-8 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition float-right">
                            {loadingLinks ? 'Saving...' : 'Save Social Links'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Settings;
