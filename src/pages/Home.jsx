import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../constants/roles';
import PermissionGate from '../components/PermissionGate';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleCreateContent = () => {
    showNotification('Redirecting to dashboard to create content...', 'info');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  const handleViewAnalytics = () => {
    showNotification('Redirecting to admin panel for analytics...', 'info');
    setTimeout(() => {
      window.location.href = '/admin';
    }, 1000);
  };

  const handleManageRoles = () => {
    showNotification('Redirecting to admin panel for role management...', 'info');
    setTimeout(() => {
      window.location.href = '/admin';
    }, 1000);
  };

  const handleSystemSettings = () => {
    showNotification('Redirecting to admin panel for system settings...', 'info');
    setTimeout(() => {
      window.location.href = '/admin';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-md ${
            notification.type === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : notification.type === 'info'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Role-Based Authorization</span>
            <span className="block text-blue-600">System Demo</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A comprehensive React-based authorization system with role-based access control, 
            protected routes, and permission-based component rendering.
          </p>
        </div>

        {isAuthenticated ? (
          <div className="mt-12">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Welcome back, {user.name}!
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  You are logged in as a <strong>{user.role}</strong> user. 
                  Your permissions determine what you can see and do in this application.
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Admin Features */}
                  <PermissionGate roles={[ROLES.ADMIN]}>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">👑</span>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-red-800">Admin Features</h4>
                          <p className="text-sm text-red-600">
                            You have full access to all system features and user management.
                          </p>
                        </div>
                      </div>
                    </div>
                  </PermissionGate>

                  {/* User Features */}
                  <PermissionGate roles={[ROLES.USER, ROLES.ADMIN]}>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">👤</span>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-blue-800">User Features</h4>
                          <p className="text-sm text-blue-600">
                            You can create and manage content, view your profile, and access the dashboard.
                          </p>
                        </div>
                      </div>
                    </div>
                  </PermissionGate>

                  {/* Guest Features */}
                  <PermissionGate roles={[ROLES.GUEST, ROLES.USER, ROLES.ADMIN]}>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">👥</span>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-800">Basic Features</h4>
                          <p className="text-sm text-gray-600">
                            You can view content and access basic features of the application.
                          </p>
                        </div>
                      </div>
                    </div>
                  </PermissionGate>
                </div>

                {/* Permission-based Actions */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Available Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    <PermissionGate permission="create_content">
                      <button 
                        onClick={handleCreateContent}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Create Content
                      </button>
                    </PermissionGate>

                    <PermissionGate permission="view_analytics">
                      <button 
                        onClick={handleViewAnalytics}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        View Analytics
                      </button>
                    </PermissionGate>

                    <PermissionGate permission="manage_roles">
                      <button 
                        onClick={handleManageRoles}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        Manage Roles
                      </button>
                    </PermissionGate>

                    <PermissionGate permission="system_settings">
                      <button 
                        onClick={handleSystemSettings}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                      >
                        System Settings
                      </button>
                    </PermissionGate>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Get Started
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Please log in to access the features of this authorization system. 
                  You can try different user roles to see how permissions work.
                </p>
                <div className="flex justify-center">
                  <a
                    href="/login"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Login to Continue
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            System Features
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">🔐</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Role-Based Access</h3>
                    <p className="text-sm text-gray-500">
                      Three distinct user roles with different permission levels
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Protected Routes</h3>
                    <p className="text-sm text-gray-500">
                      Automatic route protection based on user roles and permissions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Permission Gates</h3>
                    <p className="text-sm text-gray-500">
                      Fine-grained control over component rendering and user actions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
