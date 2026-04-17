import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CouponModal = ({ coupon, isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleCopyCode = () => {
        navigator.clipboard.writeText(coupon.code);
        toast.success('Code copied to clipboard!');
    };

    const handleGoToStore = () => {
        if (coupon.link) {
            window.open(coupon.link, '_blank');
        } else {
            toast.error('Store link not available');
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative scrollbar-hide">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800 transition-all font-bold"
                    >
                        ✕
                    </button>

                    {/* Content */}
                    <div className="p-5 md:p-8">
                        {/* Store Logo/Name */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-4 overflow-hidden border border-gray-100 shadow-sm">
                                {coupon.storeLogoType === 'upload' || coupon.storeLogoType === 'url' ? (
                                    <img
                                        src={coupon.storeLogo}
                                        alt={coupon.storeName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : coupon.storeLogoType === 'emoji' ? (
                                    <span className="text-4xl">{coupon.storeLogo}</span>
                                ) : coupon.storeLogoType === 'text' ? (
                                    <span className="text-sm font-bold text-gray-600">{coupon.storeLogo}</span>
                                ) : (
                                    <span className="text-2xl font-bold text-gray-500">
                                        {coupon.storeName.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">{coupon.title}</h2>
                        </div>

                        {/* Coupon Code Section */}
                        {coupon.type === 'Code' && coupon.code && (
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-wide text-gray-500 text-center mb-2 font-semibold">Copy this code and use at checkout</p>
                                <div className="flex items-stretch gap-2">
                                    <div className="flex-1 border-2 border-dashed border-orange-300 bg-orange-50 rounded-lg flex items-center justify-center py-3 px-2">
                                        <code className="text-lg md:text-xl font-bold text-orange-600 tracking-wider break-all text-center">
                                            {coupon.code}
                                        </code>
                                    </div>
                                    <button
                                        onClick={handleCopyCode}
                                        className="bg-orange-500 text-white px-4 md:px-6 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/30"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Related Coupon Codes */}
                        {coupon.relatedCoupons && coupon.relatedCoupons.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                                    {coupon.relatedCoupons.length} More Code{coupon.relatedCoupons.length > 1 ? 's' : ''} Available
                                </p>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                    {coupon.relatedCoupons.map((code, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="flex-1 border border-blue-200 bg-blue-50/50 rounded-lg px-4 py-2">
                                                <code className="text-base font-bold text-blue-600 tracking-wider">
                                                    {code}
                                                </code>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(code);
                                                    toast.success(`${code} copied!`);
                                                }}
                                                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors text-sm"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Deal Message */}
                        {coupon.type === 'Deal' && (
                            <div className="mb-6 text-center">
                                <p className="text-green-700 font-semibold bg-green-50 py-3 px-4 rounded-lg border border-green-100">
                                    ✅ Deal Activated. No Code Required!
                                </p>
                            </div>
                        )}

                        {/* Go To Store Button */}
                        <button
                            onClick={handleGoToStore}
                            disabled={!coupon.link}
                            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                        >
                            Go To {coupon.storeName}
                        </button>

                        {/* Coupon Details */}
                        <div className="border-t border-gray-100 pt-5">
                            <button
                                className="w-full flex items-center justify-center gap-2 text-gray-500 font-medium hover:text-primary transition-colors text-sm"
                                onClick={(e) => {
                                    const content = e.currentTarget.nextElementSibling;
                                    content.classList.toggle('hidden');
                                    e.currentTarget.querySelector('svg').classList.toggle('rotate-180');
                                }}
                            >
                                View Details & Exclusions
                                <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div className="hidden space-y-3 mt-4 text-sm bg-gray-50 p-4 rounded-xl">
                                {/* Details */}
                                <div className="space-y-2">
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">Status:</span>
                                        <span className="font-semibold text-green-600">Verified</span>
                                    </p>
                                    {coupon.expiry && (
                                        <p className="flex justify-between">
                                            <span className="text-gray-500">Expires:</span>
                                            <span className="font-medium">{coupon.expiry}</span>
                                        </p>
                                    )}
                                    {coupon.description && (
                                        <div className="pt-2 border-t border-gray-200 mt-2">
                                            <p className="text-gray-600 leading-relaxed">{coupon.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-5 mt-6 border border-primary/10">
                            <h3 className="font-bold text-sm mb-3 text-center text-gray-800">Gets the best coupons sent to your inbox!</h3>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full h-10 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary text-sm bg-white"
                                />
                                <button className="bg-gray-900 text-white h-10 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors w-full">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CouponModal;
