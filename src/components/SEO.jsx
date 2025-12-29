import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url, image }) => {
    const siteTitle = 'ClickOfferz - Best Deals & Coupons';
    const siteUrl = window.location.origin;

    return (
        <Helmet>
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name="description" content={description || "Find the best deals, promo codes, and discounts for your favorite stores at ClickOfferz."} />
            <meta name="keywords" content={keywords || "coupons, deals, promo codes, discounts, saving money"} />
            <meta name="google-site-verification" content="oiBJai2fp5IyIjIxvh-YR0AgAhyfxaUrX-E5G_X3W6g" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || siteUrl} />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || "Find the best deals, promo codes, and discounts at ClickOfferz."} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url || siteUrl} />
            <meta property="twitter:title" content={title || siteTitle} />
            <meta property="twitter:description" content={description || "Find the best deals, promo codes, and discounts."} />
            {image && <meta property="twitter:image" content={image} />}

            <link rel="canonical" href={url || siteUrl} />
        </Helmet>
    );
};

export default SEO;
