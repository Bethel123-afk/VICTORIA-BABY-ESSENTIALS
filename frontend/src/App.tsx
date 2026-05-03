import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { useCart } from './context/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import OrderDetails from './pages/OrderDetails';
import OrderSuccess from './pages/OrderSuccess';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import DashboardOrders from './pages/DashboardOrders';
import DashboardWishlist from './pages/DashboardWishlist';
import DashboardProfile from './pages/DashboardProfile';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isDrawerOpen, closeDrawer } = useCart();
  const hideFooter = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  
  return (
    <>
      <Header />
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/checkout" element={<ProtectedRoute />}>
            <Route index element={<Checkout />} />
          </Route>
          <Route path="/order/:id" element={<ProtectedRoute />}>
            <Route index element={<OrderDetails />} />
          </Route>
          <Route path="/order/success/:id" element={<ProtectedRoute />}>
            <Route index element={<OrderSuccess />} />
          </Route>
          
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />
          
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="orders" element={<DashboardOrders />} />
              <Route path="wishlist" element={<DashboardWishlist />} />
              <Route path="profile" element={<DashboardProfile />} />
            </Route>
          </Route>
          
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
