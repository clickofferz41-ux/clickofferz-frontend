import React from 'react';

const Newsletter = () => {
    return (
        <section className="container mx-auto px-4 py-20">
            <div className="bg-primary rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Never Miss a Deal Again!</h2>
                    <p className="text-blue-100 mb-10 text-lg">
                        Join 1,000,000+ shoppers and get the latest verified coupons and exclusive deals delivered straight to your inbox.
                    </p>

                    <div className="bg-white p-2 rounded-full flex flex-col md:flex-row gap-2 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-grow px-6 py-3 rounded-full focus:outline-none text-textMain placeholder-gray-400"
                        />
                        <button className="bg-accent text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>

                    <p className="mt-6 text-blue-200 text-sm">
                        By subscribing you agree to our Terms & Conditions and Privacy Policy.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
