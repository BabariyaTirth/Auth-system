import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../constants/roles';

const UserProfile = () => {
  const { user, logout, hasPermission, hasRole, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  if (!user) {
    return null;
  }

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

  const getRoleIcon = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return '👑';
      case ROLES.USER:
        return '👤';
      case ROLES.GUEST:
        return '👥';
      default:
        return '👤';
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Validate form
    if (!formData.name.trim()) {
      showNotification('Name is required', 'error');
      return;
    }

    if (!formData.email.trim()) {
      showNotification('Email is required', 'error');
      return;
    }

    // Update user data
    updateUser(formData);
    setIsEditing(false);
    showNotification('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      phone: user.phone || '',
      location: user.location || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-md ${
            notification.type === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              {hasPermission('edit_profile') && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Profile Info */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-medium text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        <span className="mr-1">{getRoleIcon(user.role)}</span>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-sm text-gray-900">{user.bio || 'No bio provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Your phone number"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{user.phone || 'No phone provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Your location"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{user.location || 'No location provided'}</p>
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Permissions Display */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Your Permissions</h4>
            <div className="grid grid-cols-2 gap-2">
              {hasPermission('create_user') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  Create Users
                </span>
              )}
              {hasPermission('read_user') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  Read Users
                </span>
              )}
              {hasPermission('update_user') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  Update Users
                </span>
              )}
              {hasPermission('delete_user') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  Delete Users
                </span>
              )}
              {hasPermission('create_content') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  Create Content
                </span>
              )}
              {hasPermission('read_content') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  Read Content
                </span>
              )}
              {hasPermission('update_content') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  Update Content
                </span>
              )}
              {hasPermission('delete_content') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  Delete Content
                </span>
              )}
              {hasPermission('manage_roles') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                  Manage Roles
                </span>
              )}
              {hasPermission('view_analytics') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                  View Analytics
                </span>
              )}
              {hasPermission('system_settings') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                  System Settings
                </span>
              )}
              {hasPermission('view_profile') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                  View Profile
                </span>
              )}
              {hasPermission('edit_profile') && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                  Edit Profile
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
