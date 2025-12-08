# Staff Login & Dashboard Documentation

## Overview

This document explains how the staff login system works and how it ensures role-based access control.

## Features Implemented

### 1. **Staff Login Page** (`src/pages/authen/StaffLogin.jsx`)

- Dedicated login page for staff members
- Email and password input fields
- **Role Verification**: Checks if the logged-in user has the `STAFF` role
- **Security**: If the role is not `STAFF`, it:
  - Removes the token from localStorage
  - Removes user info from localStorage
  - Shows generic error: "Sai email hoặc mật khẩu" (wrong email or password)
  - **Does NOT reveal the actual role** to prevent account enumeration attacks

### 2. **Private Route Protection** (`src/router/PrivateRoute.jsx`)

Three protective route wrappers:

#### PrivateStaffRoute

- Checks if token exists
- Checks if user info exists
- Verifies role is exactly `STAFF`
- Redirects to `/staff/login` if any check fails
- Used to protect staff dashboard and chat pages

#### PrivateCustomerRoute

- Protects customer-only routes
- Checks for `CUSTOMER` role
- Redirects to `/login` if not customer

#### PrivateAdminRoute

- Protects admin-only routes
- Checks for `ADMIN` role
- Redirects to `/login` if not admin

### 3. **Router Setup** (`src/router/AppRouter.jsx`)

```jsx
// Staff routes with protection
<Route path="/staff/login" element={<StaffLogin />} />
<Route path="/staff" element={<StaffLayout />}>
    <Route path="dashboard" element={
        <PrivateStaffRoute>
            <StaffDashboard />
        </PrivateStaffRoute>
    } />
    <Route path="chat/:sessionId" element={
        <PrivateStaffRoute>
            <StaffChatDetail />
        </PrivateStaffRoute>
    } />
</Route>
```

### 4. **Staff Layout** (`src/layouts/StaffLayout.jsx`)

- Professional sidebar with staff branding
- User info display (email)
- Online status indicator
- Navigation menu
- Logout functionality
- Fixed logout button at bottom

### 5. **Staff Dashboard** (`src/pages/staff/StaffDashBoard.jsx`)

Improved with:

- Better UI/UX with red color scheme (matching brand)
- Two tab system:
  - **"Chat của tôi"** - Chats assigned to the staff member
  - **"Chờ xử lý"** - Waiting chats without assignment
- Real-time session list with:
  - Customer/Guest name
  - Email
  - Chat status (Open/Closed)
  - Last message preview
  - Notification badges

## Login Flow

### Successful Login (Staff)

```
1. User enters email & password on /staff/login
2. Frontend calls login(email, password) API
3. Backend returns JWT token
4. Frontend decodes token to extract:
   - email (from 'sub' claim)
   - role (should be 'STAFF')
   - customerId
5. Role check: if role !== 'STAFF' → Error (see below)
6. Save userInfo to localStorage
7. Navigate to /staff/dashboard
8. PrivateStaffRoute verifies access
9. StaffLayout renders with staff sidebar
10. StaffDashboard loads chat sessions
```

### Failed Login (Non-Staff User)

```
1. User enters email & password for CUSTOMER or ADMIN account
2. Frontend calls login API
3. Backend returns JWT token with role: 'CUSTOMER' or 'ADMIN'
4. Frontend decodes token
5. Role check: if role !== 'STAFF'
   ✓ Remove token from localStorage
   ✓ Remove userInfo from localStorage
   ✓ Show error: "Sai email hoặc mật khẩu"
   ✓ Stay on /staff/login (DO NOT redirect to customer/admin dashboard)
6. No indication of what the actual role was
```

## Code Example: Role Check in StaffLogin

```javascript
// After successful API login
const decodedToken = jwtDecode(token);
const userInfo = {
  email: decodedToken.sub,
  role: decodedToken.role,
  customerId: decodedToken.customerId,
};

// ROLE VERIFICATION - ONLY ALLOW STAFF
if (userInfo.role !== "STAFF") {
  // Clear token and userInfo
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");

  // Show generic error (doesn't reveal role)
  setError("Sai email hoặc mật khẩu");
  console.warn("❌ Rejected: Not a staff account (Role:", userInfo.role, ")");
  return;
}

// Only STAFF can proceed
setUserInfo(userInfo);
navigate("/staff/dashboard");
```

## Security Considerations

### ✅ What's Protected

1. **Role-Based Access**: Only STAFF can access staff dashboard
2. **Generic Error Messages**: Doesn't reveal if email exists or if it's wrong role
3. **Token Validation**: Checks JWT token before allowing access
4. **Private Routes**: Protected routes redirect to login if not authenticated
5. **localStorage Cleanup**: Removes invalid tokens/userinfo immediately

### ✅ What's Hidden

- Actual user roles are never exposed in UI errors
- Login endpoint doesn't differentiate between:
  - Non-existent account
  - Wrong password
  - Wrong role (not staff)
- All show same generic error: "Sai email hoặc mật khẩu"

### ⚠️ Important Notes

1. **Frontend-side role check** is for UX only - always validate on backend
2. **Backend should verify** JWT token role matches the API endpoint being accessed
3. **Never trust localStorage** - always verify token and role on each sensitive operation
4. **Log failed attempts** on backend for security monitoring

## Routes Reference

| Route                    | Access     | Component        |
| ------------------------ | ---------- | ---------------- |
| `/staff/login`           | Public     | StaffLogin       |
| `/staff/dashboard`       | STAFF only | StaffDashboard   |
| `/staff/chat/:sessionId` | STAFF only | StaffChatDetail  |
| `/login`                 | Public     | Login (Customer) |
| `/register`              | Public     | Register         |
| `/admin`                 | ADMIN only | AdminDashboard   |

## Testing

### Test Case 1: Valid Staff Login

```
Email: staff@example.com
Password: password123
Expected: Navigate to /staff/dashboard
Verify: StaffLayout sidebar shows, ChatDashboard loads
```

### Test Case 2: Customer Tries Staff Login

```
Email: customer@example.com
Password: customerpass
Expected: Error "Sai email hoặc mật khẩu" (no role info)
Verify: Stay on /staff/login, localStorage cleared
```

### Test Case 3: Admin Tries Staff Login

```
Email: admin@example.com
Password: adminpass
Expected: Error "Sai email hoặc mật khẩu" (no role info)
Verify: Stay on /staff/login, localStorage cleared
```

### Test Case 4: Direct Access Without Auth

```
URL: /staff/dashboard
Expected: Redirect to /staff/login
Verify: PrivateStaffRoute catches missing token
```

### Test Case 5: Logout

```
Click "Đăng xuất" button in sidebar
Expected: Navigate to /staff/login, localStorage cleared
Verify: Token and userInfo removed from localStorage
```

## File Locations

```
src/
├── pages/
│   └── authen/
│       └── StaffLogin.jsx              # Staff login page
├── router/
│   ├── AppRouter.jsx                   # Routes with staff login
│   └── PrivateRoute.jsx                # Protected route components
└── layouts/
    └── StaffLayout.jsx                 # Staff layout with sidebar
```

## Dependencies

- `react-router-dom`: Routing and navigation
- `jwt-decode`: Token decoding
- `lucide-react`: Icons
- `tailwindcss`: Styling

## Future Enhancements

1. Add "Remember Me" functionality
2. Add password reset flow
3. Add two-factor authentication (2FA)
4. Add login attempt rate limiting
5. Add session timeout (auto logout after inactivity)
6. Add staff activity logging
7. Add role-based permissions (e.g., some staff can't close chats)
