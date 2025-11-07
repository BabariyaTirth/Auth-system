import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const PermissionGate = ({ 
  children, 
  permission, 
  permissions = [], 
  role, 
  roles = [],
  fallback = null,
  requireAll = false 
}) => {
  const { hasPermission, hasRole, hasAnyRole } = useAuth();

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return fallback;
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? permissions.every(p => hasPermission(p))
      : permissions.some(p => hasPermission(p));
    
    if (!hasRequiredPermissions) {
      return fallback;
    }
  }

  // Check single role
  if (role && !hasRole(role)) {
    return fallback;
  }

  // Check multiple roles
  if (roles.length > 0 && !hasAnyRole(roles)) {
    return fallback;
  }

  return children;
};

export default PermissionGate;
