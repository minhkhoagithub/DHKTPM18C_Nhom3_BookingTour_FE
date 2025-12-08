# Staff Login System - Complete Implementation

## 📑 Documentation Index

| Document                    | Purpose                        | Best For                                |
| --------------------------- | ------------------------------ | --------------------------------------- |
| **STAFF_LOGIN_QUICKREF.md** | Quick reference guide          | Getting started quickly                 |
| **STAFF_LOGIN_GUIDE.md**    | Complete feature documentation | Understanding all features              |
| **STAFF_LOGIN_SUMMARY.md**  | Implementation overview        | Project summary                         |
| **STAFF_LOGIN_SECURITY.md** | Security deep-dive             | Security review & understanding attacks |
| **STAFF_LOGIN_VISUAL.md**   | Visual diagrams & flows        | Understanding the architecture          |
| **README.md** (this file)   | Implementation overview        | Quick overview & navigation             |

## 🎯 Quick Start

### For Users (Testing)

1. Go to `/staff/login`
2. Use STAFF account credentials
3. Dashboard opens with chat sessions
4. Can't access if you're CUSTOMER or ADMIN (gets error: "Sai email hoặc mật khẩu")

### For Developers (Implementation)

1. Read **STAFF_LOGIN_QUICKREF.md** (5 min)
2. Check **STAFF_LOGIN_SECURITY.md** for security patterns (10 min)
3. Review source code in:
   - `src/pages/authen/StaffLogin.jsx` (login logic)
   - `src/router/PrivateRoute.jsx` (protection logic)
   - `src/layouts/StaffLayout.jsx` (layout)

### For DevOps/Backend (Integration)

1. Ensure JWT tokens include `role` field: "STAFF"
2. Backend must validate role on API calls
3. Return 403 Forbidden for wrong role
4. See **STAFF_LOGIN_SECURITY.md** for backend examples

## ✅ What's Implemented

### Core Features

- [x] Dedicated staff login page
- [x] JWT token decoding with role extraction
- [x] Role verification (STAFF only)
- [x] Generic error messages (no role leakage)
- [x] localStorage cleanup on failure
- [x] Protected routes with PrivateStaffRoute
- [x] Staff layout with sidebar
- [x] Enhanced dashboard with two-tab interface
- [x] Logout functionality

### Security Features

- [x] Role-based access control
- [x] Account enumeration prevention
- [x] Private route guards
- [x] localStorage data cleanup
- [x] Generic error messages
- [x] Defense-in-depth approach

### UI/UX Features

- [x] Professional login page
- [x] Red gradient background (brand colors)
- [x] Loading spinner
- [x] Error alerts with icons
- [x] Staff sidebar with user info
- [x] Online status indicator
- [x] Enhanced dashboard with session list
- [x] Two-tab system (My Chats / Waiting)
- [x] Session status badges
- [x] Empty state messages

## 📁 Key Files

### Created

```
src/pages/authen/StaffLogin.jsx
src/router/PrivateRoute.jsx
src/layouts/StaffLayout.jsx
```

### Modified

```
src/router/AppRouter.jsx
src/pages/staff/StaffDashBoard.jsx
```

### Documentation

```
STAFF_LOGIN_GUIDE.md (Comprehensive)
STAFF_LOGIN_SUMMARY.md (Overview)
STAFF_LOGIN_SECURITY.md (Security details)
STAFF_LOGIN_VISUAL.md (Diagrams & flows)
STAFF_LOGIN_QUICKREF.md (Quick reference)
```

## 🔄 Login Flow

```
1. User visits /staff/login
2. Enters email & password
3. Frontend calls login() API
4. Backend returns JWT token
5. Frontend decodes token
6. Check: role === 'STAFF'?
   ✅ YES → Save & redirect to /staff/dashboard
   ❌ NO → Clear storage, show error, stay on login
7. PrivateRoute validates on every page access
8. If valid → Render protected component
9. If invalid → Redirect to /staff/login
```

## 🔒 Security Highlights

### Generic Error Messages

All login failures show: **"Sai email hoặc mật khẩu"** (Wrong email or password)

- Non-existent account: Same error
- Wrong password: Same error
- Wrong role (not STAFF): Same error
- Network error: Same error

→ **Prevents account enumeration attacks**

### Multi-Layer Protection

1. **Frontend**: Role check in StaffLogin component
2. **Routes**: PrivateStaffRoute guards all staff pages
3. **Storage**: Automatic cleanup on failure
4. **Backend**: (Not implemented here) Must also validate

### What We Don't Reveal

- ❌ Whether account exists
- ❌ Whether password is correct
- ❌ What role the account has
- ❌ Any system information

## 🧪 Testing Checklist

### Scenario 1: Valid Staff Login ✅

- [x] Go to /staff/login
- [x] Use STAFF credentials
- [x] Should navigate to /staff/dashboard
- [x] StaffLayout sidebar visible
- [x] Session list loads
- [x] Console shows "✓ User info đã lưu (STAFF)"

### Scenario 2: Customer Account ❌

- [x] Go to /staff/login
- [x] Use CUSTOMER credentials
- [x] Should show: "Sai email hoặc mật khẩu"
- [x] Stay on /staff/login
- [x] localStorage should be empty
- [x] Console shows "❌ Rejected: Not a staff account"

### Scenario 3: Admin Account ❌

- [x] Go to /staff/login
- [x] Use ADMIN credentials
- [x] Should show: "Sai email hoặc mật khẩu"
- [x] Stay on /staff/login
- [x] localStorage should be empty

### Scenario 4: Direct URL Access (No Auth) ❌

- [x] Try /staff/dashboard directly
- [x] Should redirect to /staff/login
- [x] Component doesn't render
- [x] PrivateStaffRoute blocks access

### Scenario 5: Logout ✅

- [x] Click "Đăng xuất" button
- [x] Should navigate to /staff/login
- [x] localStorage completely cleared
- [x] Token: null
- [x] UserInfo: null

## 🚀 How to Use

### For End Users

1. **Login**: Visit `/staff/login` with staff credentials
2. **View Chats**: See "Chat của tôi" (My Chats) tab
3. **Accept Chat**: See "Chờ xử lý" (Waiting) tab and accept
4. **Logout**: Click "Đăng xuất" in sidebar

### For Developers

1. **Add Staff**: Backend creates user with role="STAFF"
2. **Login**: User logs in via `/staff/login`
3. **Protect Routes**: Automatically protected by PrivateStaffRoute
4. **API Calls**: Backend validates role on each request

## 📊 Architecture

```
┌─────────────────────────────────────┐
│      StaffLogin.jsx (Public)         │
├─────────────────────────────────────┤
│ - Email input                        │
│ - Password input                     │
│ - JWT decoding                       │
│ - Role verification                 │
│ - Generic error handling             │
└────────────┬────────────────────────┘
             │
             ├─ If role="STAFF"
             │  ↓
             │  Save token & userInfo
             │  Navigate to /staff
             │
             └─ If role≠"STAFF"
                ↓
                Clear localStorage
                Show error (generic)

┌─────────────────────────────────────┐
│      StaffLayout.jsx (Protected)     │
├─────────────────────────────────────┤
│ - Sidebar with user info             │
│ - Navigation menu                    │
│ - Logout button                      │
│ - PrivateStaffRoute checks           │
└────────────┬────────────────────────┘
             │
             ├─ /staff/dashboard
             │  └─ StaffDashboard.jsx
             │     - Two tabs (My/Waiting)
             │     - Session list
             │     - Chat selection
             │
             └─ /staff/chat/:sessionId
                └─ StaffChatDetail.jsx
                   - Chat thread
                   - Message input
                   - Session controls
```

## 🔐 Security Best Practices

| Practice         | Implementation                             |
| ---------------- | ------------------------------------------ |
| Generic errors   | "Sai email hoặc mật khẩu" for all failures |
| Role isolation   | Only STAFF role accesses staff features    |
| Route protection | PrivateRoute validates on every access     |
| Data cleanup     | localStorage cleared on login failure      |
| Defense in depth | Multiple validation layers                 |
| No token reuse   | Cleanup prevents cached auth               |
| Role hiding      | Never reveal actual role to user           |

## 📚 Learning Path

1. **Start**: Read STAFF_LOGIN_QUICKREF.md (5 min)
2. **Understand**: Review STAFF_LOGIN_SUMMARY.md (10 min)
3. **Deep dive**: Study STAFF_LOGIN_SECURITY.md (15 min)
4. **Visualize**: Check STAFF_LOGIN_VISUAL.md (5 min)
5. **Full guide**: Read STAFF_LOGIN_GUIDE.md (20 min)
6. **Code review**: Look at source code (30 min)

**Total time**: ~1 hour to understand completely

## 🐛 Common Issues

| Issue                           | Solution                              |
| ------------------------------- | ------------------------------------- |
| "Sai email hoặc mật khẩu" error | Check user role is "STAFF" on backend |
| Can't access /staff/dashboard   | Token missing, login again            |
| Redirect to login on refresh    | Token expired, login again            |
| localStorage not clearing       | Check error handling in StaffLogin    |
| No sidebar showing              | Check StaffLayout is rendering        |

## 🎓 Code Examples

### Checking if User is Staff

```javascript
import { getUserInfo } from "../services/authService";

const userInfo = getUserInfo();
if (userInfo?.role === "STAFF") {
  // User is staff
} else {
  // Not staff or not logged in
}
```

### Protecting a Route

```javascript
import { PrivateStaffRoute } from "../router/PrivateRoute";

<Route
  path="/staff/feature"
  element={
    <PrivateStaffRoute>
      <YourComponent />
    </PrivateStaffRoute>
  }
/>;
```

### Logout

```javascript
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate("/staff/login");
};
```

## 🔗 Related Documentation

- **Backend Integration**: See STAFF_LOGIN_SECURITY.md section "Backend Validation Example"
- **Error Handling**: See STAFF_LOGIN_GUIDE.md section "Failed Login (Non-Staff User)"
- **Routes Reference**: See STAFF_LOGIN_GUIDE.md "Routes Reference" table
- **Testing Guide**: See STAFF_LOGIN_GUIDE.md "Testing" section

## 📞 Support

### Quick Questions

→ Check STAFF_LOGIN_QUICKREF.md

### Feature Questions

→ Check STAFF_LOGIN_GUIDE.md

### Security Questions

→ Check STAFF_LOGIN_SECURITY.md

### Architecture Questions

→ Check STAFF_LOGIN_VISUAL.md

### Any Other Questions

→ Check STAFF_LOGIN_SUMMARY.md

## ✨ Summary

Staff Login System is a complete, security-focused implementation that:

1. **Protects**: Only STAFF can access staff features
2. **Secures**: Generic errors prevent account enumeration
3. **Validates**: Multiple layers of role checking
4. **Cleans up**: localStorage cleared on failure
5. **Documents**: Comprehensive guides for all audiences

**Status**: ✅ Ready for production (after backend validation)

---

Last Updated: December 8, 2025
Version: 1.0
