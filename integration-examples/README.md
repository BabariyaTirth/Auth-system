# Integration Examples

This folder contains examples of how to integrate the role-based authorization system with your existing projects.

## Available Integrations

### 1. E-commerce Integration (`ecom-integration.jsx`)
Shows how to integrate the auth system with your React e-commerce project:

**Features Added:**
- Protected cart access (users only)
- Admin panel for product management
- Role-based navigation menu
- Permission-based product operations

**Key Changes:**
- Wrap app with `AuthProvider`
- Add `ProtectedRoute` for cart and admin pages
- Use `PermissionGate` for conditional rendering
- Enhanced navigation with auth-aware links

### 2. Portfolio Integration (`project-integration.jsx`)
Shows how to integrate with your TypeScript portfolio project:

**Features Added:**
- Admin section for portfolio management
- Protected contact form for registered users
- Role-based project editing capabilities
- Priority support for authenticated users

**Key Changes:**
- TypeScript-compatible integration
- Admin panel for portfolio management
- Enhanced contact section with user benefits
- Permission-based project operations

### 3. Tasky Integration (`tasky-integration.jsx`)
Shows how to integrate with your vanilla JavaScript task manager:

**Features Added:**
- User authentication system
- Role-based task permissions
- Admin panel for user management
- Session persistence

**Key Changes:**
- Vanilla JavaScript implementation
- Local storage for session management
- Permission-based task operations
- Dynamic UI updates based on auth state

## How to Use These Examples

### For React Projects (ecom, project)

1. **Copy the auth system files** to your project:
   ```bash
   cp -r auth-system/src/contexts your-project/src/
   cp -r auth-system/src/components your-project/src/
   cp -r auth-system/src/constants your-project/src/
   ```

2. **Install required dependencies**:
   ```bash
   npm install react-router-dom
   ```

3. **Update your App.jsx/tsx** following the integration examples

4. **Wrap your app** with `AuthProvider`

5. **Add protected routes** using `ProtectedRoute` component

6. **Use permission gates** for conditional rendering

### For Vanilla JavaScript Projects (Tasky)

1. **Copy the auth functions** from `tasky-integration.jsx`

2. **Add the HTML structure** provided in the comments

3. **Initialize the auth system** on page load

4. **Update your existing functions** to check permissions

5. **Add login/logout functionality**

## Customization Tips

### Adding New Permissions
```javascript
// In your constants/roles.js
export const PERMISSIONS = {
  // ... existing permissions
  MANAGE_PRODUCTS: 'manage_products',
  VIEW_ORDERS: 'view_orders',
  PROCESS_PAYMENTS: 'process_payments'
};

// Assign to roles
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // ... existing permissions
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.PROCESS_PAYMENTS
  ],
  [ROLES.USER]: [
    // ... existing permissions
    PERMISSIONS.VIEW_ORDERS
  ]
};
```

### Custom Route Protection
```jsx
// Protect routes with custom logic
<ProtectedRoute 
  requiredRoles={[ROLES.ADMIN]}
  requiredPermissions={[PERMISSIONS.MANAGE_PRODUCTS]}
  fallbackPath="/unauthorized"
>
  <ProductManagement />
</ProtectedRoute>
```

### Conditional Component Rendering
```jsx
// Show different content based on permissions
<PermissionGate permission={PERMISSIONS.VIEW_ORDERS}>
  <OrderHistory />
</PermissionGate>

<PermissionGate 
  permission={PERMISSIONS.PROCESS_PAYMENTS}
  fallback={<div>Payment processing not available</div>}
>
  <PaymentProcessor />
</PermissionGate>
```

## Security Best Practices

1. **Server-side Validation**: Always validate permissions on the server
2. **Token Management**: Implement proper token expiration and refresh
3. **HTTPS**: Use HTTPS in production environments
4. **Input Validation**: Validate all user inputs
5. **Error Handling**: Don't expose sensitive information in error messages

## Testing Different Roles

Use the demo accounts to test different permission levels:

| Project | Admin Email | User Email | Guest Email |
|---------|-------------|------------|-------------|
| Auth System | admin@example.com | user@example.com | guest@example.com |
| E-commerce | admin@ecom.com | user@ecom.com | - |
| Portfolio | admin@portfolio.com | user@portfolio.com | - |
| Tasky | admin@tasky.com | user@tasky.com | - |

All demo accounts use the password pattern: `{role}123`

## Troubleshooting

### Common Issues

1. **Routes not protecting**: Make sure `AuthProvider` wraps your entire app
2. **Components not showing**: Check if permissions are correctly assigned to roles
3. **Login not working**: Verify the mock login function matches your user data
4. **TypeScript errors**: Ensure proper type definitions for auth context

### Debug Tips

1. **Check auth state**: Use browser dev tools to inspect localStorage
2. **Verify permissions**: Log user permissions in console
3. **Test routes**: Try accessing protected routes directly
4. **Check role assignments**: Verify role-permission mappings

## Next Steps

1. **Replace mock authentication** with real API calls
2. **Add user registration** functionality
3. **Implement password reset** feature
4. **Add email verification** for new users
5. **Create user management** interface
6. **Add audit logging** for security events

## Support

For questions about integration, please refer to the main README.md or open an issue in the repository.

