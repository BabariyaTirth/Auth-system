// Example integration with your project (TypeScript version)
// Add this to your project/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../auth-system/src/contexts/AuthContext';
import ProtectedRoute from '../auth-system/src/components/ProtectedRoute';
import PermissionGate from '../auth-system/src/components/PermissionGate';
import { ROLES, PERMISSIONS } from '../auth-system/src/constants/roles';

// Your existing components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Enhanced Header with auth
const AuthHeader: React.FC = () => {
  return (
    <Header>
      <PermissionGate roles={[ROLES.USER, ROLES.ADMIN]}>
        <a href="#contact" className="nav-link">
          Contact
        </a>
      </PermissionGate>
      
      <PermissionGate roles={[ROLES.ADMIN]}>
        <a href="#admin" className="nav-link">
          Admin
        </a>
      </PermissionGate>
    </Header>
  );
};

// Admin section for portfolio
const PortfolioAdmin: React.FC = () => {
  return (
    <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
      <section id="admin" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Portfolio Admin</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PermissionGate permission={PERMISSIONS.CREATE_CONTENT}>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Add Project</h3>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Create New Project
                </button>
              </div>
            </PermissionGate>
            
            <PermissionGate permission={PERMISSIONS.UPDATE_CONTENT}>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Edit Projects</h3>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  Edit Existing
                </button>
              </div>
            </PermissionGate>
            
            <PermissionGate permission={PERMISSIONS.DELETE_CONTENT}>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Delete Projects</h3>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Remove Project
                </button>
              </div>
            </PermissionGate>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

// Enhanced Contact form with auth
const AuthContact: React.FC = () => {
  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto px-4">
        <Contact />
        
        <PermissionGate roles={[ROLES.USER, ROLES.ADMIN]}>
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Priority Support</h3>
            <p className="text-gray-600">
              As a registered user, you have access to priority support.
            </p>
          </div>
        </PermissionGate>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AuthHeader />
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <AuthContact />
          <PortfolioAdmin />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
