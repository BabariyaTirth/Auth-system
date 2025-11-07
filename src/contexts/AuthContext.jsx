import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ROLES, ROLE_PERMISSIONS } from '../constants/roles';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  permissions: []
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      const userPermissions = ROLE_PERMISSIONS[action.payload.role] || [];
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        permissions: userPermissions
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        permissions: []
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Simulate API call - replace with actual authentication
      const response = await mockLogin(credentials);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        return { success: true };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: false, error: 'Login failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user function
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData });
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return state.permissions.includes(permission);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock login function - replace with actual API call
const mockLogin = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock users for demonstration
  const mockUsers = [
    {
      id: 1,
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: ROLES.ADMIN
    },
    {
      id: 2,
      email: 'user@example.com',
      password: 'user123',
      name: 'Regular User',
      role: ROLES.USER
    },
    {
      id: 3,
      email: 'guest@example.com',
      password: 'guest123',
      name: 'Guest User',
      role: ROLES.GUEST
    }
  ];

  const user = mockUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );

  if (user) {
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: `mock-token-${user.id}-${Date.now()}`
      }
    };
  } else {
    return {
      success: false,
      error: 'Invalid credentials'
    };
  }
};
