# Staff Login System - Complete Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      STAFF LOGIN SYSTEM                      │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │   /staff/login       │  ← Public route
    │   StaffLogin.jsx     │
    └──────────┬───────────┘
               │
               │ User enters credentials
               ▼
    ┌──────────────────────┐
    │  Backend API Login   │  POST /api/auth/login
    │  Returns JWT token   │
    └──────────┬───────────┘
               │
               │ Token returned
               ▼
    ┌──────────────────────┐
    │ Decode JWT Token     │  Using jwt-decode
    │ Extract role field   │
    └──────────┬───────────┘
               │
        ┌──────┴────────┐
        │               │
    role==STAFF?    No (CUSTOMER/ADMIN/Invalid)
        │               │
       YES              ▼
        │      ┌──────────────────────┐
        │      │ Clear localStorage   │
        │      │ Show error message   │
        │      │ "Sai email hoặc      │
        │      │  mật khẩu"           │  ← Generic message
        │      │ Stay on login page   │
        │      └──────────────────────┘
        │
        ▼
    ┌──────────────────────┐
    │ Save to localStorage │
    │ - token              │
    │ - userInfo {email,   │
    │   role, customerId}  │
    └──────────┬───────────┘
               │
               │ Navigate to
               ▼
    ┌──────────────────────┐
    │ /staff/dashboard     │
    │ PrivateStaffRoute    │  ← Protected route
    │ Checks token & role  │
    └──────────┬───────────┘
               │
               │ Validation passed
               ▼
    ┌──────────────────────┐
    │ StaffLayout Renders  │
    │ - Sidebar            │
    │ - Logout button      │
    │ - Staff email        │
    └──────────┬───────────┘
               │
               │ Layout wraps
               ▼
    ┌──────────────────────┐
    │ StaffDashboard       │
    │ - Chat list          │
    │ - Waiting chats      │
    │ - Message threads    │
    └──────────────────────┘
```

## Component Tree

```
App.jsx
 ↓
AppRouter.jsx
 ├── /staff/login
 │    └── StaffLogin.jsx
 │         ├── Email input
 │         ├── Password input
 │         ├── Role verification logic
 │         └── Error handling
 │
 └── /staff (StaffLayout)
      ├── Sidebar
      │    ├── Logo/Branding
      │    ├── User info
      │    ├── Nav menu
      │    └── Logout button
      │
      └── <Outlet>
           ├── /staff/dashboard (Protected)
           │    └── StaffDashboard.jsx
           │         ├── Header
           │         ├── Tab selector
           │         ├── Session list
           │         └── Chat selector
           │
           └── /staff/chat/:sessionId (Protected)
                └── StaffChatDetail.jsx
```

## Data Flow

### Login Request

```
User Input
  ↓
email: "staff@example.com"
password: "password123"
  ↓
POST /api/auth/login
  ↓
{
  "data": "eyJhbGc..."  // JWT token
}
  ↓
Frontend:
  - jwtDecode(token)
  - Extract: { sub: email, role: "STAFF", customerId: "123" }
  - Check: role === "STAFF"?
    - YES: Save to localStorage, navigate to /staff/dashboard
    - NO: Clear localStorage, show generic error
```

### Session Restoration

```
User refreshes page while on /staff/dashboard
  ↓
PrivateStaffRoute checks:
  1. getToken() from localStorage?
     - If null → Redirect to /staff/login
  2. getUserInfo() from localStorage?
     - If null → Redirect to /staff/login
  3. userInfo.role === "STAFF"?
     - If false → Redirect to /staff/login
  ↓
If all pass → Render protected component
If any fail → Redirect to /staff/login
```

### Logout

```
User clicks "Đăng xuất" button
  ↓
handleLogout()
  ↓
logout() function:
  - localStorage.removeItem("token")
  - localStorage.removeItem("userInfo")
  ↓
Navigate to /staff/login
  ↓
Clean login page displayed
```

## State Management

### localStorage State

```
┌─────────────────────────────────────────┐
│          AUTHENTICATED STAFF             │
├─────────────────────────────────────────┤
│ token: "eyJhbGciOiJIUzI1NiIsInR5cCI..."│
│ userInfo: {                              │
│   email: "staff@example.com",           │
│   role: "STAFF",                        │
│   customerId: "emp-123"                 │
│ }                                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        NOT AUTHENTICATED / FAILED         │
├─────────────────────────────────────────┤
│ token: null                              │
│ userInfo: null                           │
│                                          │
│ (Both cleared on login failure)          │
└─────────────────────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────┐
│   POSSIBLE LOGIN FAILURES            │
├─────────────────────────────────────┤
│                                      │
│ 1. Email doesn't exist               │
│    API error → Frontend catches       │
│    → Show: "Sai email hoặc mật khẩu" │
│                                      │
│ 2. Wrong password                    │
│    API error → Frontend catches       │
│    → Show: "Sai email hoặc mật khẩu" │
│                                      │
│ 3. Role is CUSTOMER                  │
│    Token received but role check fails│
│    → Clear storage                   │
│    → Show: "Sai email hoặc mật khẩu" │
│                                      │
│ 4. Role is ADMIN                     │
│    Token received but role check fails│
│    → Clear storage                   │
│    → Show: "Sai email hoặc mật khẩu" │
│                                      │
│ 5. Network error                     │
│    → Show: "Sai email hoặc mật khẩu" │
│                                      │
└─────────────────────────────────────┘

All failures show SAME message
→ Prevents role/account enumeration
```

## Security Layers

```
┌────────────────────────────────────────┐
│        LAYER 1: FRONTEND LOGIC          │
├────────────────────────────────────────┤
│ File: StaffLogin.jsx                   │
│ - Decode JWT token                     │
│ - Check role field                     │
│ - Clear storage on failure             │
│ - Generic error message                │
└────────────────────────────────────────┘
                ↓
┌────────────────────────────────────────┐
│        LAYER 2: ROUTE PROTECTION        │
├────────────────────────────────────────┤
│ File: PrivateRoute.jsx                 │
│ - Check token exists                   │
│ - Check userInfo exists                │
│ - Check role === STAFF                 │
│ - Redirect to login if fail            │
└────────────────────────────────────────┘
                ↓
┌────────────────────────────────────────┐
│        LAYER 3: BACKEND API             │
├────────────────────────────────────────┤
│ (Not implemented in frontend)          │
│ Server-side must:                      │
│ - Validate JWT token                   │
│ - Check role in token                  │
│ - Return 403 if wrong role             │
│ - Log suspicious activity              │
└────────────────────────────────────────┘
```

## Feature Comparison: Before vs After

```
┌──────────────────┬──────────────┬──────────────────────┐
│    FEATURE       │   BEFORE     │   AFTER              │
├──────────────────┼──────────────┼──────────────────────┤
│ Staff Login      │ None         │ ✅ StaffLogin.jsx    │
│ Role Check       │ None         │ ✅ Frontend + Private│
│ Route Protection │ None         │ ✅ PrivateRoute.jsx  │
│ Generic Errors   │ None         │ ✅ No role leakage   │
│ Staff Sidebar    │ None         │ ✅ StaffLayout.jsx   │
│ Staff Dashboard  │ Basic        │ ✅ Enhanced UI/UX    │
│ Session mgmt     │ Basic list   │ ✅ Two-tab system    │
│ Logout           │ None         │ ✅ Full cleanup      │
└──────────────────┴──────────────┴──────────────────────┘
```

## Browser DevTools Inspection

### What to Check in Browser Console

```javascript
// After successful staff login
localStorage.getItem('token')
  → "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

localStorage.getItem('userInfo')
  → '{"email":"staff@example.com","role":"STAFF","customerId":"emp-123"}'

// Console logs should show
✓ Token đã lưu
✓ User info đã lưu (STAFF)
✓ Chat session started

// After failed login (non-staff)
localStorage.getItem('token')
  → null

localStorage.getItem('userInfo')
  → null

// Console logs should show
❌ Rejected: Not a staff account (Role: CUSTOMER)
```

### Network Tab Inspection

```
Request:  POST http://localhost:8080/api/auth/login
Headers:  Content-Type: application/json
Payload:  { email: "...", password: "..." }

Response:
Status:   200 OK
Body:     { data: "JWT token..." }

Successful login:
↓ Frontend processes token
↓ Role check passes
↓ Save to localStorage
↓ Navigate to /staff/dashboard
↓ Start loading chat sessions
```

## Time Sequence Diagram

```
User                Frontend           Backend
  │                    │                  │
  ├── visits login ────→│                  │
  │                    │                  │
  ├── fills form ──────→│                  │
  │                    │                  │
  │                    ├─ POST /api/auth/login ──→│
  │                    │                  │
  │                    │                  ├─ Verify credentials
  │                    │                  ├─ Generate JWT
  │                    │                  │
  │                    │←─ 200 {token} ───┤
  │                    │                  │
  │                    ├─ Decode token   │
  │                    ├─ Check role     │
  │                    ├─ Save to storage │
  │                    │                  │
  │←─ Redirect /staff/dashboard ─────────│
  │                    │                  │
  ├─ Access protected route ──→│          │
  │                    │                  │
  │                    ├─ PrivateRoute checks
  │                    ├─ Validates token & role
  │                    │                  │
  │←─ Render dashboard ────────│          │
  │                    │                  │
  │                    ├─ GET /api/staff/sessions ──→│
  │                    │                  │
  │                    │                  ├─ Validate role
  │                    │                  ├─ Return sessions
  │                    │                  │
  │                    │←─ 200 {sessions}─┤
  │                    │                  │
  │←─ Show chat list ──────────│          │
  │                    │                  │
```

## File Organization

```
src/
│
├── pages/
│   ├── authen/
│   │   ├── Login.jsx              (Customer login)
│   │   ├── Register.jsx
│   │   └── StaffLogin.jsx         ✨ NEW
│   │
│   └── staff/
│       ├── StaffDashBoard.jsx     (Enhanced)
│       └── StaffChatDetail.jsx
│
├── router/
│   ├── AppRouter.jsx              (Updated with staff routes)
│   └── PrivateRoute.jsx           ✨ NEW
│
├── layouts/
│   ├── MainLayout.jsx
│   ├── AdminLayout.jsx
│   └── StaffLayout.jsx            ✨ NEW
│
└── services/
    └── authService.js             (Existing)

Documentation files:
├── STAFF_LOGIN_GUIDE.md           (Detailed guide)
├── STAFF_LOGIN_SUMMARY.md         (Feature summary)
├── STAFF_LOGIN_SECURITY.md        (Security deep-dive)
└── STAFF_LOGIN_QUICKREF.md        (Quick reference)
```

## Summary

**Staff Login System provides:**

1. ✅ Secure role-based access control
2. ✅ Generic error messages (no role leakage)
3. ✅ Protected staff routes
4. ✅ Professional staff sidebar
5. ✅ Enhanced dashboard UI
6. ✅ Complete logout functionality
7. ✅ Browser localStorage cleanup
8. ✅ Defense-in-depth approach

**Security guarantees:**

- Only STAFF role can access /staff/dashboard
- Role information is never revealed
- Failed logins clear all stored credentials
- Direct URL access is blocked by PrivateRoute
- Generic error messages prevent account enumeration
