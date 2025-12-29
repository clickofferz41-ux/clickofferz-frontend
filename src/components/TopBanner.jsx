import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const TopBanner = () => {
    const [socialLinks, setSocialLinks] = useState({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/settings`);
                if (res.data && res.data.socialLinks) {
                    setSocialLinks(res.data.socialLinks);
                }
            } catch (error) {
                console.error('Failed to fetch top banner settings');
            }
        };
        fetchSettings();
    }, []);

    const getActiveSocials = () => {
        const icons = {
            facebook: '📘',
            instagram: '📷',
            twitter: '𝕏',
            youtube: '📺',
            linkedin: '💼',
            tiktok: '🎵'
        };

        return Object.keys(socialLinks)
            .filter(key => socialLinks[key])
            .map(key => ({
                name: key,
                url: socialLinks[key],
                icon: icons[key] || '🔗'
            }));
    };

    const activeSocials = getActiveSocials();

    return (
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 text-sm">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="font-medium">💰 Earn Cash Back Online.</span>
                    <Link to="/how-it-works" className="underline hover:text-blue-100 font-semibold">
                        How It Works
                    </Link>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3">
                    {activeSocials.map((social) => (
                        <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition-transform"
                            title={social.name}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopBanner;
