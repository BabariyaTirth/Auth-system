// Role-based authorization constants
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

export const PERMISSIONS = {
  // User management
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
  
  // Content management
  CREATE_CONTENT: 'create_content',
  READ_CONTENT: 'read_content',
  UPDATE_CONTENT: 'update_content',
  DELETE_CONTENT: 'delete_content',
  
  // Admin functions
  MANAGE_ROLES: 'manage_roles',
  VIEW_ANALYTICS: 'view_analytics',
  SYSTEM_SETTINGS: 'system_settings',
  
  // Basic permissions
  VIEW_PROFILE: 'view_profile',
  EDIT_PROFILE: 'edit_profile'
};

// Role-permission mapping
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.READ_CONTENT,
    PERMISSIONS.UPDATE_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE
  ],
  [ROLES.USER]: [
    PERMISSIONS.READ_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.UPDATE_CONTENT,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE
  ],
  [ROLES.GUEST]: [
    PERMISSIONS.READ_CONTENT,
    PERMISSIONS.VIEW_PROFILE
  ]
};

// Route permissions mapping
export const ROUTE_PERMISSIONS = {
  '/admin': [ROLES.ADMIN],
  '/admin/users': [ROLES.ADMIN],
  '/admin/settings': [ROLES.ADMIN],
  '/profile': [ROLES.USER, ROLES.ADMIN],
  '/dashboard': [ROLES.USER, ROLES.ADMIN],
  '/create': [ROLES.USER, ROLES.ADMIN],
  '/edit': [ROLES.USER, ROLES.ADMIN]
};
