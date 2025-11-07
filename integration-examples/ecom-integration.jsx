// Example integration with your ecom project
// Add this to your ecom/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../auth-system/src/contexts/AuthContext';
import ProtectedRoute from '../auth-system/src/components/ProtectedRoute';
import PermissionGate from '../auth-system/src/components/PermissionGate';
import { ROLES, PERMISSIONS } from '../auth-system/src/constants/roles';

// Your existing components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import About from './pages/About';
import Product from './pages/Product';

// Enhanced Navbar with auth
const AuthNavbar = () => {
  return (
    <Navbar>
      <PermissionGate roles={[ROLES.USER, ROLES.ADMIN]}>
        <Link to="/cart">Cart</Link>
      </PermissionGate>
      
      <PermissionGate roles={[ROLES.ADMIN]}>
        <Link to="/admin">Admin Panel</Link>
      </PermissionGate>
    </Navbar>
  );
};

// Enhanced Cart page with auth
const AuthCart = () => {
  return (
    <ProtectedRoute requiredRoles={[ROLES.USER, ROLES.ADMIN]}>
      <Cart />
    </ProtectedRoute>
  );
};

// Admin panel for ecom
const EcomAdmin = () => {
  return (
    <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">E-commerce Admin</h1>
        
        <PermissionGate permission={PERMISSIONS.CREATE_CONTENT}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Product
          </button>
        </PermissionGate>
        
        <PermissionGate permission={PERMISSIONS.DELETE_CONTENT}>
          <button className="bg-red-500 text-white px-4 py-2 rounded ml-2">
            Delete Product
          </button>
        </PermissionGate>
      </div>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AuthNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<AuthCart />} />
            <Route path="/admin" element={<EcomAdmin />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
