import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PermissionGate from '../components/PermissionGate';
import ContentCreator from '../components/ContentCreator';
import { PERMISSIONS } from '../constants/roles';

const Dashboard = () => {
  const { user } = useAuth();
  const [showContentCreator, setShowContentCreator] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [userContent, setUserContent] = useState(() => {
    return JSON.parse(localStorage.getItem('userContent') || '[]');
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleCreateContent = () => {
    setShowContentCreator(true);
  };

  const handleContentCreated = (newContent) => {
    setUserContent(prev => [...prev, newContent]);
    showNotification('Content created successfully!');
  };

  const handleViewAnalytics = () => {
    showNotification('Analytics feature coming soon!', 'info');
  };

  const handleManageRoles = () => {
    showNotification('Role management feature coming soon!', 'info');
  };

  const handleSystemSettings = () => {
    showNotification('System settings feature coming soon!', 'info');
  };

  const handleAddUser = () => {
    showNotification('User management feature coming soon!', 'info');
  };

  const handleViewReports = () => {
    showNotification('Reports feature coming soon!', 'info');
  };

  const handleFormBuilder = () => {
    window.location.href = '/form-builder';
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your personalized dashboard, {user?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Content Management Card */}
          <PermissionGate permission="read_content">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Content Management
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        <PermissionGate permission="create_content">
                          <span className="text-green-600">✓ Create</span>
                        </PermissionGate>
                        <PermissionGate permission="update_content">
                          <span className="text-blue-600 ml-2">✓ Edit</span>
                        </PermissionGate>
                        <PermissionGate permission="delete_content">
                          <span className="text-red-600 ml-2">✓ Delete</span>
                        </PermissionGate>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>

          {/* User Management Card */}
          <PermissionGate permission="read_user">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        User Management
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        <PermissionGate permission="create_user">
                          <span className="text-green-600">✓ Create</span>
                        </PermissionGate>
                        <PermissionGate permission="update_user">
                          <span className="text-blue-600 ml-2">✓ Edit</span>
                        </PermissionGate>
                        <PermissionGate permission="delete_user">
                          <span className="text-red-600 ml-2">✓ Delete</span>
                        </PermissionGate>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>

          {/* Analytics Card */}
          <PermissionGate permission="view_analytics">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Analytics
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        View detailed analytics and reports
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>

          {/* System Settings Card */}
          <PermissionGate permission="system_settings">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        System Settings
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Configure system-wide settings
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>

          {/* Role Management Card */}
          <PermissionGate permission="manage_roles">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🔑</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Role Management
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Manage user roles and permissions
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>

          {/* Profile Management Card */}
          <PermissionGate permission="view_profile">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Profile Management
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        <PermissionGate permission="edit_profile">
                          <span className="text-blue-600">✓ Editable</span>
                        </PermissionGate>
                        <PermissionGate permission="edit_profile" fallback={<span className="text-gray-600">View Only</span>}>
                        </PermissionGate>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <PermissionGate permission="create_content">
              <button 
                onClick={handleCreateContent}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <span className="mr-2">➕</span>
                Create New Content
              </button>
            </PermissionGate>

            <PermissionGate permission="create_user">
              <button 
                onClick={handleAddUser}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <span className="mr-2">👤</span>
                Add New User
              </button>
            </PermissionGate>

            <PermissionGate permission="view_analytics">
              <button 
                onClick={handleViewReports}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <span className="mr-2">📊</span>
                View Reports
              </button>
            </PermissionGate>

            <PermissionGate permission="system_settings">
              <button 
                onClick={handleSystemSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
              >
                <span className="mr-2">⚙️</span>
                System Settings
              </button>
            </PermissionGate>

            <PermissionGate permission="create_content">
              <button 
                onClick={handleFormBuilder}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <span className="mr-2">📝</span>
                Form Builder
              </button>
            </PermissionGate>
          </div>
        </div>

        {/* Recent Activity */}
        <PermissionGate permission="read_content">
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {userContent.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {userContent.slice(0, 5).map((content) => (
                    <li key={content.id} className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-lg">📝</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Content created: {content.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(content.createdAt).toLocaleDateString()} at {new Date(content.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-4 text-center text-gray-500">
                  No content created yet. Create your first content using the button above!
                </div>
              )}
            </div>
          </div>
        </PermissionGate>

        {/* Content Creator Modal */}
        {showContentCreator && (
          <ContentCreator
            onClose={() => setShowContentCreator(false)}
            onContentCreated={handleContentCreated}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
