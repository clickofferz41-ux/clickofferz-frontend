import React from 'react';

const StoreCard = ({ store }) => {
    const renderLogo = () => {
        // Auto-detect image if logoType is not explicitly set or set to 'emoji' but content looks like image
        const isImage =
            store.logoType === 'url' ||
            store.logoType === 'upload' ||
            (store.logo && (store.logo.startsWith('http') || store.logo.startsWith('data:')));

        if (isImage) {
            return (
                <img
                    src={store.logo}
                    alt={store.name}
                    className="w-full h-full object-contain"
                />
            );
        } else if (store.logoType === 'text') {
            return (
                <span className="text-sm font-bold text-gray-700">
                    {store.logo}
                </span>
            );
        } else {
            // Default: emoji
            return store.logo;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] p-6 border border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 transition-all duration-300 h-44 group">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold mb-4 group-hover:bg-blue-50 group-hover:text-primary transition-colors overflow-hidden">
                {renderLogo()}
            </div>
            <h3 className="font-semibold text-textMain group-hover:text-primary transition-colors">{store.name}</h3>
            <span className="text-xs text-gray-400 mt-1">{store.offers} Offers Available</span>
        </div>
    );
};

export default StoreCard;
