import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../config';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    keepUnusedDataFor: 300, // 5 min default
    endpoints: (builder) => ({

        // ── Stores ──────────────────────────────────────────────────────────
        getStores: builder.query({
            query: () => '/api/stores',
        }),

        getStoreBySlug: builder.query({
            query: (slug) => `/api/stores/${slug}`,
        }),

        // ── Coupons ─────────────────────────────────────────────────────────
        // params: { page, limit, type, category, search, trending, store }
        getCoupons: builder.query({
            query: (params = {}) => {
                const { page, limit, type, category, search, trending, store } = params;
                const qs = new URLSearchParams();
                if (page)     qs.set('page', page);
                if (limit)    qs.set('limit', limit);
                if (type)     qs.set('type', type);
                if (category) qs.set('category', category);
                if (search)   qs.set('search', search);
                if (trending) qs.set('trending', trending);
                if (store)    qs.set('store', store);
                const query = qs.toString();
                return `/api/coupons${query ? `?${query}` : ''}`;
            },
            keepUnusedDataFor: 180, // 3 min — coupons change more often
        }),

        getCouponsByStore: builder.query({
            query: (slug) => `/api/coupons/store/${slug}`,
            keepUnusedDataFor: 180,
        }),

        // ── Categories ──────────────────────────────────────────────────────
        getCategories: builder.query({
            query: () => '/api/categories',
            keepUnusedDataFor: 600, // 10 min — categories rarely change
        }),

        // ── Blogs ────────────────────────────────────────────────────────────
        getBlogs: builder.query({
            query: (params = {}) => {
                const qs = new URLSearchParams(params).toString();
                return `/api/blogs${qs ? `?${qs}` : ''}`;
            },
        }),

        getBlogBySlug: builder.query({
            query: (slug) => `/api/blogs/${slug}`,
        }),

        // ── Settings ─────────────────────────────────────────────────────────
        getSettings: builder.query({
            query: () => '/api/settings',
            keepUnusedDataFor: 600,
        }),

        // ── Pages ─────────────────────────────────────────────────────────
        getPageBySlug: builder.query({
            query: (slug) => `/api/pages/${slug}`,
            keepUnusedDataFor: 600,
        }),
    }),
});

export const {
    useGetStoresQuery,
    useGetStoreBySlugQuery,
    useGetCouponsQuery,
    useGetCouponsByStoreQuery,
    useGetCategoriesQuery,
    useGetBlogsQuery,
    useGetBlogBySlugQuery,
    useGetSettingsQuery,
    useGetPageBySlugQuery,
} = api;
