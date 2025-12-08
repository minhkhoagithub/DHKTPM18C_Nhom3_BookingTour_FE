# Staff Login - Quick Reference

## 🎯 What Was Done

Created a dedicated staff login system that:

1. Only allows users with `STAFF` role to access staff dashboard
2. Shows generic error messages (doesn't reveal roles)
3. Automatically clears credentials if wrong role
4. Protects all staff routes with role verification

## 📍 Key Files Created/Modified

| File                                 | Type     | Purpose                          |
| ------------------------------------ | -------- | -------------------------------- |
| `src/pages/authen/StaffLogin.jsx`    | New      | Staff login page with role check |
| `src/router/PrivateRoute.jsx`        | New      | Protected route components       |
| `src/layouts/StaffLayout.jsx`        | New      | Staff layout with sidebar        |
| `src/router/AppRouter.jsx`           | Modified | Added staff routes               |
| `src/pages/staff/StaffDashBoard.jsx` | Modified | Enhanced UI/UX                   |

## 🔐 Security Feature

### What Happens When Someone Logs In

**Valid Staff:**

```
✅ Token saved
✅ User info saved
✅ Redirect to /staff/dashboard
✅ Can access staff features
```

**Not STAFF (Customer/Admin/Invalid):**

```
❌ Token deleted
❌ User info deleted
❌ Error: "Sai email hoặc mật khẩu"
❌ Stay on /staff/login
❌ No indication of actual role
```

## 🚀 How to Test

### Test 1: Login as Staff

1. Go to `localhost:3000/staff/login`
2. Use STAFF account credentials
3. Should see dashboard with chat sessions

### Test 2: Login as Customer (via staff login)

1. Go to `localhost:3000/staff/login`
2. Use CUSTOMER account credentials
3. Should see error: "Sai email hoặc mật khẩu"
4. localStorage should be empty

### Test 3: Direct URL Access

1. Go to `localhost:3000/staff/dashboard`
2. Should redirect to `/staff/login`
3. PrivateStaffRoute blocks access

### Test 4: Logout

1. Click "Đăng xuất" button in sidebar
2. Should redirect to `/staff/login`
3. localStorage should be cleared

## 📋 Routes

```
Public Routes:
  /staff/login          → Staff login page

Protected Routes (STAFF only):
  /staff/dashboard      → Chat management dashboard
  /staff/chat/:id       → Individual chat detail
```

## 🔒 Role Check Logic

```javascript
// In StaffLogin.jsx
const decodedToken = jwtDecode(token);

if (decodedToken.role !== "STAFF") {
  // Clear everything
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");

  // Show generic error
  setError("Sai email hoặc mật khẩu");

  // Log for debugging
  console.warn("❌ Rejected: Not a staff account");
  return;
}

// Only STAFF reaches here
navigate("/staff/dashboard");
```

## 🎨 UI Features

### StaffLogin Page

- Email input
- Password input
- Error alert (red)
- Loading spinner
- Info panel on right (benefits)
- Mobile responsive

### StaffLayout Sidebar

- Logo + branding
- Staff email display
- Online status (green dot)
- Dashboard link
- Logout button (bottom)

### StaffDashboard

- Header: "Quản lý Chat"
- Two tabs: "Chat của tôi" | "Chờ xử lý"
- Session list with:
  - Customer name
  - Email
  - Status badge
  - Last message preview
- Empty states with helpful messages

## 💡 How It Prevents Role Leakage

**Without protection:**

```
❌ "This is not a staff account"
→ Attacker knows account exists but isn't staff
```

**With protection:**

```
✅ "Sai email hoặc mật khẩu"
→ Attacker doesn't know why login failed
→ Prevents account enumeration
```

## ⚙️ Implementation Details

### Frontend Validation

- Decodes JWT token
- Checks role field
- Validates before navigation

### Route Protection

```javascript
<PrivateStaffRoute>
  <StaffDashboard />
</PrivateStaffRoute>
```

### Automatic Cleanup

- Removes `token` from localStorage on failure
- Removes `userInfo` from localStorage on failure
- Prevents cached authentication

## 🔍 Debugging

Check browser console for logs:

```javascript
✓ Token đã lưu          // Token saved successfully
✓ User info đã lưu      // User info saved successfully
❌ Rejected: Not staff   // Wrong role detected
📋 User info từ token   // User data extracted
```

Check localStorage:

```javascript
// Valid staff
localStorage.getItem("token"); // "eyJhbGc..."
localStorage.getItem("userInfo"); // "{email, role, customerId}"

// Failed login
localStorage.getItem("token"); // null
localStorage.getItem("userInfo"); // null
```

## 🚨 Important Notes

1. **Frontend role check is for UX only**

   - Backend must ALWAYS validate role on API calls
   - Never trust token validation in frontend

2. **Generic error messages are intentional**

   - Prevents account enumeration attacks
   - Always shows same message regardless of failure reason

3. **localStorage cleanup is critical**

   - Prevents token reuse by other users
   - Especially important on shared computers

4. **PrivateStaffRoute is a second line of defense**
   - Prevents direct URL access
   - Validates on route change

## 📚 Full Documentation

For detailed information, see:

- `STAFF_LOGIN_GUIDE.md` - Complete feature guide
- `STAFF_LOGIN_SUMMARY.md` - Implementation summary
- `STAFF_LOGIN_SECURITY.md` - Security details & best practices

## ✅ Checklist for Production

- [ ] Test all three user types (STAFF, CUSTOMER, ADMIN)
- [ ] Verify error messages are generic
- [ ] Check localStorage is cleared on failed login
- [ ] Test /staff/dashboard direct access (should redirect)
- [ ] Verify logout clears data
- [ ] Check browser console for no errors
- [ ] Test on mobile (responsive design)
- [ ] Ensure backend also validates role on API calls

## 🐛 Troubleshooting

### Problem: Redirect to /staff/login on load

**Solution**: Token might have expired. Login again.

### Problem: "Sai email hoặc mật khẩu" error

**Solution**: Could be any of:

- Wrong email/password
- Account doesn't exist
- User is not STAFF role
  (Intentionally generic for security)

### Problem: localStorage not clearing

**Solution**: Check console for errors. Verify login failure is detected.

### Problem: Can access /staff/dashboard without login

**Solution**: This should not happen. Check:

- PrivateStaffRoute is imported
- Route is wrapped with PrivateStaffRoute
- No caching issues (hard refresh)

## 📞 Questions?

1. Check the comprehensive guides in markdown files
2. Review source code comments
3. Check browser console for debug logs
4. Verify backend is returning correct role in JWT token
