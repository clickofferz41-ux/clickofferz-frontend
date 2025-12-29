import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import TopBanner from './components/TopBanner'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import StoresPage from './pages/StoresPage'
import CategoriesPage from './pages/CategoriesPage'
import StorePage from './pages/StorePage'
import BlogPage from './pages/BlogPage'
import CouponsPage from './pages/CouponsPage'
import DealsPage from './pages/DealsPage'
import TrendingPage from './pages/TrendingPage'
import BlogPostPage from './pages/BlogPostPage'
import ContactPage from './pages/ContactPage'

// Admin Pages
import Login from './pages/admin/Login'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Stores from './pages/admin/Stores'
import StoreForm from './pages/admin/StoreForm'
import Coupons from './pages/admin/Coupons'
import CouponForm from './pages/admin/CouponForm'
import Categories from './pages/admin/Categories'
import CategoryForm from './pages/admin/CategoryForm'
import BlogList from './pages/admin/BlogList'
import BlogForm from './pages/admin/BlogForm'
import PageList from './pages/admin/PageList'
import PageEditor from './pages/admin/PageEditor'
import Settings from './pages/admin/Settings'
import Messages from './pages/admin/Messages'

// Dynamic Page Component for Static Pages
import DynamicPage from './pages/StaticPages'

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />

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
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
