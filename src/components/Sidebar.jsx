import React from 'react';

const Sidebar = () => {
    const recentPosts = [
        'How to Stack Coupons Like a Pro',
        'Top 20 Stores with the Best Return Policies',
        'Black Friday 2024: Ultimate Guide'
    ];

    return (
        <aside className="space-y-6">
            {/* Search Widget */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-textMain mb-4">Search</h3>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-10 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Newsletter Widget */}
            <div className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-xl mb-2">Subscribe To Our Weekly Newsletter!</h3>
                <p className="text-blue-100 text-sm mb-4">Get the latest deals delivered to your inbox</p>
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full h-10 px-4 rounded-lg text-textMain focus:outline-none"
                    />
                    <button className="w-full bg-white text-primary font-bold py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
                        SUBSCRIBE
                    </button>
                </div>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-textMain mb-4">Recent Posts</h3>
                <ul className="space-y-3">
                    {recentPosts.map((post, index) => (
                        <li key={index}>
                            <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors line-clamp-2">
                                • {post}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
