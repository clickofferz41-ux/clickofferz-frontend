import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CouponModal from './CouponModal';

const CouponCard = ({ coupon }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300 relative">
                {/* Discount Badge */}
                {coupon.discount && (
                    <div className="absolute -top-3 -right-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {coupon.discount}
                    </div>
                )}

                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/store/${coupon.storeName.trim().toLowerCase().replace(/\s+/g, '-')}`}
                            className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden hover:bg-blue-50 transition-colors"
                        >
                            {coupon.storeLogoType === 'upload' || coupon.storeLogoType === 'url' ? (
                                <img
                                    src={coupon.storeLogo}
                                    alt={coupon.storeName}
                                    className="w-full h-full object-cover"
                                />
                            ) : coupon.storeLogoType === 'emoji' ? (
                                <span className="text-2xl">{coupon.storeLogo}</span>
                            ) : coupon.storeLogoType === 'text' ? (
                                <span className="text-xs font-bold text-gray-600">{coupon.storeLogo}</span>
                            ) : (
                                <span className="text-sm font-bold text-gray-500">
                                    {coupon.storeName.substring(0, 2).toUpperCase()}
                                </span>
                            )}
                        </Link>
                        <div>
                            <Link
                                to={`/store/${coupon.storeName.trim().toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm font-semibold text-textMain hover:text-primary transition-colors"
                            >
                                {coupon.storeName}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${coupon.type === 'Code'
                                    ? 'bg-blue-50 text-primary'
                                    : 'bg-orange-50 text-accent'
                                    }`}>
                                    {coupon.type}
                                </span>
                                <span className="text-xs text-gray-400">Expires: {coupon.expiry}</span>
                            </div>
                        </div>
                    </div>

                    {/* Used Count Badge */}
                    <div className="text-right">
                        <div className="text-xs font-semibold text-green-600 flex items-center justify-end gap-1 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                            <span>🔥</span>
                            {coupon.usageCount !== undefined && coupon.usageCount !== null && coupon.usageCount !== 0 ? coupon.usageCount : Math.floor(Math.random() * 500) + 50} Used
                        </div>
                    </div>
                </div>

                <h3 className="font-bold text-lg text-textMain mb-2">
                    {coupon.title}
                </h3>

                {/* See Details Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-primary text-sm font-medium hover:underline mb-3 flex items-center gap-1"
                >
                    {isExpanded ? '▼' : '▶'} See Details
                </button>

                {/* Expanded Details */}
                {isExpanded && coupon.description && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                        <p className="text-sm text-gray-700">{coupon.description}</p>
                    </div>
                )}

                <div className="mt-auto">
                    {coupon.type === 'Code' ? (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full border-2 border-dashed border-primary bg-blue-50 text-primary py-3 rounded-lg font-bold tracking-wider hover:bg-primary hover:text-white hover:border-solid transition-all"
                        >
                            GET CODE
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-accent text-white py-3 rounded-lg font-bold hover:bg-opacity-90 hover:shadow-lg transition-all shadow-md shadow-accent/20"
                        >
                            GET DEAL
                        </button>
                    )}
                </div>
            </div>

            {/* Modal */}
            <CouponModal
                coupon={coupon}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default CouponCard;

