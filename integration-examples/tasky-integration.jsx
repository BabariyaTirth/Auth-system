// Example integration with your Tasky project
// Add this to your Tasky/client/index.html or create a React version

// For the existing HTML/JS version, add these functions to your script.js:

// Auth functions for Tasky
const AuthSystem = {
  // Mock auth state (replace with real implementation)
  currentUser: null,
  isAuthenticated: false,

  // Login function
  login: async function(credentials) {
    // Mock login - replace with actual API call
    const mockUsers = [
      { id: 1, email: 'admin@tasky.com', password: 'admin123', role: 'admin', name: 'Admin User' },
      { id: 2, email: 'user@tasky.com', password: 'user123', role: 'user', name: 'Regular User' }
    ];

    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      this.currentUser = user;
      this.isAuthenticated = true;
      localStorage.setItem('taskyUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  // Logout function
  logout: function() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('taskyUser');
  },

  // Check if user has permission
  hasPermission: function(permission) {
    if (!this.isAuthenticated) return false;
    
    const permissions = {
      admin: ['create_task', 'read_task', 'update_task', 'delete_task', 'manage_users'],
      user: ['create_task', 'read_task', 'update_task']
    };
    
    return permissions[this.currentUser.role]?.includes(permission) || false;
  },

  // Check if user has role
  hasRole: function(role) {
    return this.isAuthenticated && this.currentUser.role === role;
  },

  // Initialize auth on page load
  init: function() {
    const savedUser = localStorage.getItem('taskyUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.isAuthenticated = true;
    }
  }
};

// Enhanced Tasky with auth
const TaskyWithAuth = {
  // Show/hide elements based on auth
  updateUI: function() {
    const loginSection = document.getElementById('login-section');
    const taskSection = document.getElementById('task-section');
    const adminSection = document.getElementById('admin-section');
    const userInfo = document.getElementById('user-info');

    if (AuthSystem.isAuthenticated) {
      // Show authenticated UI
      if (loginSection) loginSection.style.display = 'none';
      if (taskSection) taskSection.style.display = 'block';
      if (userInfo) {
        userInfo.innerHTML = `
          <div class="user-profile">
            <span>Welcome, ${AuthSystem.currentUser.name} (${AuthSystem.currentUser.role})</span>
            <button onclick="AuthSystem.logout(); TaskyWithAuth.updateUI();" class="logout-btn">Logout</button>
          </div>
        `;
      }

      // Show admin features if user is admin
      if (AuthSystem.hasRole('admin') && adminSection) {
        adminSection.style.display = 'block';
      } else if (adminSection) {
        adminSection.style.display = 'none';
      }
    } else {
      // Show login UI
      if (loginSection) loginSection.style.display = 'block';
      if (taskSection) taskSection.style.display = 'none';
      if (adminSection) adminSection.style.display = 'none';
      if (userInfo) userInfo.innerHTML = '';
    }
  },

  // Enhanced task creation with permission check
  createTask: function(taskData) {
    if (!AuthSystem.hasPermission('create_task')) {
      alert('You do not have permission to create tasks');
      return;
    }
    
    // Your existing task creation logic here
    console.log('Creating task:', taskData);
  },

  // Enhanced task deletion with permission check
  deleteTask: function(taskId) {
    if (!AuthSystem.hasPermission('delete_task')) {
      alert('You do not have permission to delete tasks');
      return;
    }
    
    // Your existing task deletion logic here
    console.log('Deleting task:', taskId);
  },

  // Enhanced task update with permission check
  updateTask: function(taskId, taskData) {
    if (!AuthSystem.hasPermission('update_task')) {
      alert('You do not have permission to update tasks');
      return;
    }
    
    // Your existing task update logic here
    console.log('Updating task:', taskId, taskData);
  }
};

// Login form handler
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const result = AuthSystem.login({ email, password });
  
  if (result.success) {
    TaskyWithAuth.updateUI();
    document.getElementById('login-form').reset();
  } else {
    alert(result.error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  AuthSystem.init();
  TaskyWithAuth.updateUI();
});

// Example HTML structure for Tasky with auth:
/*
<!DOCTYPE html>
<html>
<head>
    <title>Tasky - Task Manager with Auth</title>
    <style>
        .hidden { display: none; }
        .user-profile { display: flex; align-items: center; gap: 10px; }
        .logout-btn { background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
    </style>
</head>
<body>
    <div id="user-info"></div>
    
    <!-- Login Section -->
    <div id="login-section">
        <h2>Login to Tasky</h2>
        <form id="login-form" onsubmit="handleLogin(event)">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <p>Demo accounts: admin@tasky.com / admin123, user@tasky.com / user123</p>
    </div>
    
    <!-- Task Section -->
    <div id="task-section" class="hidden">
        <h2>My Tasks</h2>
        <!-- Your existing task management UI -->
        <button onclick="TaskyWithAuth.createTask({title: 'New Task'})">Create Task</button>
    </div>
    
    <!-- Admin Section -->
    <div id="admin-section" class="hidden">
        <h2>Admin Panel</h2>
        <p>Admin-only features here</p>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
*/
