import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PermissionGate from '../components/PermissionGate';
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../constants/roles';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ROLES.USER, status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ROLES.ADMIN, status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ROLES.GUEST, status: 'inactive' },
  ]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleAddUser = () => {
    showNotification('Add user feature coming soon!', 'info');
  };

  const handleEditUser = (userId) => {
    showNotification(`Edit user ${userId} feature coming soon!`, 'info');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      showNotification('User deleted successfully!');
    }
  };

  const mockAnalytics = {
    totalUsers: 150,
    activeUsers: 120,
    totalContent: 45,
    systemUptime: '99.9%'
  };

  const tabs = [
    { id: 'users', name: 'User Management', permission: 'read_user' },
    { id: 'analytics', name: 'Analytics', permission: 'view_analytics' },
    { id: 'settings', name: 'System Settings', permission: 'system_settings' },
    { id: 'roles', name: 'Role Management', permission: 'manage_roles' }
  ];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-red-100 text-red-800';
      case ROLES.USER:
        return 'bg-blue-100 text-blue-800';
      case ROLES.GUEST:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-gray-600">
            System administration and management tools
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <PermissionGate permission="view_analytics">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {mockAnalytics.totalUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>

          <PermissionGate permission="view_analytics">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {mockAnalytics.activeUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>

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
                        Total Content
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {mockAnalytics.totalContent}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>

          <PermissionGate permission="system_settings">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        System Uptime
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {mockAnalytics.systemUptime}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <PermissionGate key={tab.id} permission={tab.permission}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              </PermissionGate>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          {activeTab === 'users' && (
            <PermissionGate permission="read_user">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    User Management
                  </h3>
                  <PermissionGate permission="create_user">
                    <button 
                      onClick={handleAddUser}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <span className="mr-2">➕</span>
                      Add User
                    </button>
                  </PermissionGate>
                </div>
                
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((userItem) => (
                        <tr key={userItem.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {userItem.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {userItem.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(userItem.role)}`}>
                              {userItem.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(userItem.status)}`}>
                              {userItem.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <PermissionGate permission="update_user">
                                <button 
                                  onClick={() => handleEditUser(userItem.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Edit
                                </button>
                              </PermissionGate>
                              <PermissionGate permission="delete_user">
                                <button 
                                  onClick={() => handleDeleteUser(userItem.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </PermissionGate>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </PermissionGate>
          )}

          {activeTab === 'analytics' && (
            <PermissionGate permission="view_analytics">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  System Analytics
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">User Growth</h4>
                    <div className="h-32 bg-white rounded border flex items-center justify-center">
                      <span className="text-gray-500">Chart Placeholder</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Content Activity</h4>
                    <div className="h-32 bg-white rounded border flex items-center justify-center">
                      <span className="text-gray-500">Chart Placeholder</span>
                    </div>
                  </div>
                </div>
              </div>
            </PermissionGate>
          )}

          {activeTab === 'settings' && (
            <PermissionGate permission="system_settings">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  System Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                      <p className="text-sm text-gray-500">Enable maintenance mode for system updates</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Send email notifications to users</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                </div>
              </div>
            </PermissionGate>
          )}

          {activeTab === 'roles' && (
            <PermissionGate permission="manage_roles">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Role Management
                </h3>
                <div className="space-y-4">
                  {Object.values(ROLES).map((role) => (
                    <div key={role} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">{role} Role</h4>
                          <p className="text-sm text-gray-500">
                            {ROLE_PERMISSIONS[role]?.length || 0} permissions assigned
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                          Edit Permissions
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PermissionGate>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
