# Role-Based Authorization System

A comprehensive React-based authorization system with role-based access control, protected routes, and permission-based component rendering..

## Features

### 🔐 Role-Based Access Control
- **Admin Role**: Full system access with all permissions
- **User Role**: Standard user with content creation and profile management
- **Guest Role**: Limited access for viewing content only

### 🛡️ Protected Routes
- Automatic route protection based on user roles and permissions.
- Redirect to login page for unauthenticated users
- Unauthorized access handling with custom error pages

### ⚡ Permission Gates
- Fine-grained control over component rendering
- Support for single or multiple permission checks
- Role-based component visibility
- Fallback content for unauthorized users

### 🎨 Modern UI/UX
- Built with Tailwind CSS for responsive design
- Clean and intuitive user interface
- Loading states and error handling
- Demo accounts for easy testing

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the auth-system folder**
2. **Install dependencies:**
   ```bash
   cd auth-system
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to `http://localhost:3000`**

## Demo Accounts

The system includes three demo accounts for testing different permission levels:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@example.com | admin123 | Full system access |
| User | user@example.com | user123 | Content creation, profile management |
| Guest | guest@example.com | guest123 | View content only |

## System Architecture

### Core Components

#### 1. **AuthContext** (`src/contexts/AuthContext.jsx`)
- Manages authentication state
- Handles login/logout functionality
- Provides permission checking utilities
- Persistent session management

#### 2. **ProtectedRoute** (`src/components/ProtectedRoute.jsx`)
- Route-level access control
- Role and permission-based protection
- Automatic redirects and error handling

#### 3. **PermissionGate** (`src/components/PermissionGate.jsx`)
- Component-level access control
- Conditional rendering based on permissions
- Support for multiple permission types

#### 4. **Role Constants** (`src/constants/roles.js`)
- Defines user roles and permissions
- Maps roles to specific permissions
- Route permission configurations

### Permission System

The system uses a hierarchical permission structure:

```
Admin
├── User Management (create, read, update, delete)
├── Content Management (create, read, update, delete)
├── System Administration (manage roles, view analytics, system settings)
└── Profile Management (view, edit)

User
├── Content Management (create, read, update)
└── Profile Management (view, edit)

Guest
├── Content Management (read only)
└── Profile Management (view only)
```

## Usage Examples

### Protecting Routes

```jsx
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES, PERMISSIONS } from './constants/roles';

// Protect route by role
<ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
  <AdminPanel />
</ProtectedRoute>

// Protect route by permission
<ProtectedRoute requiredPermissions={[PERMISSIONS.CREATE_CONTENT]}>
  <CreateContent />
</ProtectedRoute>
```

### Conditional Component Rendering

```jsx
import PermissionGate from './components/PermissionGate';
import { PERMISSIONS } from './constants/roles';

// Show component only if user has permission
<PermissionGate permission={PERMISSIONS.DELETE_USER}>
  <DeleteButton />
</PermissionGate>

// Show component for multiple roles
<PermissionGate roles={[ROLES.USER, ROLES.ADMIN]}>
  <UserDashboard />
</PermissionGate>

// Show fallback content for unauthorized users
<PermissionGate 
  permission={PERMISSIONS.ADMIN_PANEL}
  fallback={<div>Access Denied</div>}
>
  <AdminPanel />
</PermissionGate>
```

### Using Auth Context

```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, hasPermission, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      {hasPermission('create_content') && (
        <button>Create Content</button>
      )}
    </div>
  );
}
```

## Integration with Existing Projects

To integrate this authorization system with your existing React projects:

### 1. Copy Core Files
Copy the following files to your project:
- `src/contexts/AuthContext.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/components/PermissionGate.jsx`
- `src/constants/roles.js`

### 2. Install Dependencies
```bash
npm install react-router-dom
```

### 3. Wrap Your App
```jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your existing app components */}
    </AuthProvider>
  );
}
```

### 4. Update Your Routes
```jsx
import ProtectedRoute from './components/ProtectedRoute';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<LoginForm />} />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute requiredRoles={['user', 'admin']}>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
</Routes>
```

## Customization

### Adding New Roles
1. Update `ROLES` constant in `src/constants/roles.js`
2. Add role permissions to `ROLE_PERMISSIONS`
3. Update route permissions in `ROUTE_PERMISSIONS`

### Adding New Permissions
1. Add permission to `PERMISSIONS` constant
2. Assign permissions to roles in `ROLE_PERMISSIONS`
3. Use permission in components with `PermissionGate`

### Custom Authentication
Replace the `mockLogin` function in `AuthContext.jsx` with your actual authentication API:

```jsx
const login = async (credentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Handle successful login
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: data.user });
    }
  } catch (error) {
    // Handle error
  }
};
```

## Security Considerations

- **Token Storage**: Currently uses localStorage. Consider using httpOnly cookies for production
- **Permission Validation**: Always validate permissions on the server side
- **Route Protection**: This is client-side protection. Implement server-side validation
- **Token Expiration**: Add token expiration and refresh logic
- **HTTPS**: Always use HTTPS in production environments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please open an issue in the repository or contact the development team.
