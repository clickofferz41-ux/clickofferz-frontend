import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import TopBanner from './components/TopBanner'
import Header from './components/Header'
import Footer from './components/Footer'
const HomePage = lazy(() => import('./pages/HomePage'));
const StoresPage = lazy(() => import('./pages/StoresPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const StorePage = lazy(() => import('./pages/StorePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const CouponsPage = lazy(() => import('./pages/CouponsPage'));
const DealsPage = lazy(() => import('./pages/DealsPage'));
const TrendingPage = lazy(() => import('./pages/TrendingPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const DynamicPage = lazy(() => import('./pages/StaticPages'));

// Admin Pages
const Login = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Stores = lazy(() => import('./pages/admin/Stores'));
const StoreForm = lazy(() => import('./pages/admin/StoreForm'));
const Coupons = lazy(() => import('./pages/admin/Coupons'));
const CouponForm = lazy(() => import('./pages/admin/CouponForm'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const CategoryForm = lazy(() => import('./pages/admin/CategoryForm'));
const BlogList = lazy(() => import('./pages/admin/BlogList'));
const BlogForm = lazy(() => import('./pages/admin/BlogForm'));
const PageList = lazy(() => import('./pages/admin/PageList'));
const PageEditor = lazy(() => import('./pages/admin/PageEditor'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const Messages = lazy(() => import('./pages/admin/Messages'));

import { HelmetProvider } from 'react-helmet-async';

function App() {
  const loadingFallback = (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />

        <Suspense fallback={loadingFallback}>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="stores" element={<Stores />} />
              <Route path="stores/new" element={<StoreForm />} />
              <Route path="stores/edit/:id" element={<StoreForm />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="coupons/new" element={<CouponForm />} />
              <Route path="coupons/edit/:id" element={<CouponForm />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/new" element={<CategoryForm />} />
              <Route path="categories/edit/:id" element={<CategoryForm />} />
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/new" element={<BlogForm />} />
              <Route path="blogs/edit/:id" element={<BlogForm />} />
              <Route path="pages" element={<PageList />} />
              <Route path="pages/edit/:slug" element={<PageEditor />} />
              <Route path="settings" element={<Settings />} />
              <Route path="messages" element={<Messages />} />
            </Route>

            {/* Public Routes */}
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col font-sans text-textMain bg-background">
                <TopBanner />
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/stores" element={<StoresPage />} />
                    <Route path="/store" element={<StoresPage />} />
                    <Route path="/store/:slug" element={<StorePage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/coupons" element={<CouponsPage />} />
                    <Route path="/deals" element={<DealsPage />} />
                    <Route path="/trending" element={<TrendingPage />} />
                    <Route path="/contact-us" element={<ContactPage />} />

                    {/* Static Pages (Dynamic) */}
                    <Route path="/about-us" element={<DynamicPage slug="about-us" defaultTitle="About Us" />} />
                    <Route path="/privacy-policy" element={<DynamicPage slug="privacy-policy" defaultTitle="Privacy Policy" />} />
                    <Route path="/terms-conditions" element={<DynamicPage slug="terms-conditions" defaultTitle="Terms & Conditions" />} />
                    <Route path="/cookie-policy" element={<DynamicPage slug="cookie-policy" defaultTitle="Cookie Policy" />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Suspense>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
