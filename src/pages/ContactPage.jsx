import React, { useState } from 'react';
import { API_URL } from '../config';
import { toast } from 'react-toastify';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Message sent successfully!');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error(data.error || 'Failed to send message');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Have a question, suggestion, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-700'
                                    }`}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            📧
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
                        <p className="text-gray-500">support@tripcoupon.com</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            🌍
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Global Support</h3>
                        <p className="text-gray-500">Available 24/7 Worldwide</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            💼
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Business</h3>
                        <p className="text-gray-500">partners@tripcoupon.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
