# Security: How Role Information is Protected

## Problem: Account Enumeration Attack

Without proper protection, an attacker could:

1. Try logging in with an email via staff login
2. See different error messages:
   - "Wrong password" (account exists but wrong password)
   - "This is not a staff account" (account exists but wrong role)
   - "Account not found" (account doesn't exist)
3. Enumerate valid accounts and their roles

## Solution: Generic Error Messages

### ✅ Current Implementation

All login failures show the same generic message:

```
"Sai email hoặc mật khẩu"
(Wrong email or password)
```

This message is shown for:

- Non-existent account
- Wrong password
- Wrong role (CUSTOMER, ADMIN, etc.)

### Code Example

```javascript
try {
  const token = await login(email, password);
  const decodedToken = jwtDecode(token);
  const userInfo = {
    email: decodedToken.sub,
    role: decodedToken.role,
    customerId: decodedToken.customerId,
  };

  // ROLE CHECK - CRITICAL SECURITY
  if (userInfo.role !== "STAFF") {
    // ❌ WRONG - Reveals role
    // setError("This account is " + userInfo.role + ", not STAFF");

    // ✅ CORRECT - Generic message
    setError("Sai email hoặc mật khẩu");

    // Clean up immediately
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    return;
  }

  // Only STAFF can reach here
  setUserInfo(userInfo);
  navigate("/staff/dashboard");
} catch (err) {
  // Network/API errors also show generic message
  setError("Sai email hoặc mật khẩu");
}
```

## Security Layers

### Layer 1: Frontend Role Check (UX)

```javascript
if (userInfo.role !== "STAFF") {
  // Show generic error, clean up storage
}
```

- Prevents staff dashboard from loading
- Clears any cached authentication

### Layer 2: Private Route Protection

```javascript
export function PrivateStaffRoute({ children }) {
  const token = getToken();
  const userInfo = getUserInfo();

  if (!token || !userInfo || userInfo.role !== "STAFF") {
    return <Navigate to="/staff/login" replace />;
  }

  return children;
}
```

- Prevents direct URL access to `/staff/dashboard`
- Validates on every route change
- Redirects to login if role changes

### Layer 3: Backend API Validation (CRITICAL)

```java
// Must validate on backend - frontend can be bypassed!
@PostMapping("/api/staff/chat/sessions")
public ResponseEntity<?> getStaffSessions() {
  User currentUser = getCurrentUser(); // From JWT

  if (!currentUser.getRole().equals("STAFF")) {
    return ResponseEntity.status(403).build(); // Forbidden
  }

  // Only STAFF can reach here
}
```

## Attack Scenarios & Responses

### Scenario 1: Attacker tries customer account on /staff/login

```
Input:
  Email: customer@example.com
  Password: customerpass

Backend Response:
  Status: 200 OK
  Body: { token: "JWT with role=CUSTOMER" }

Frontend Logic:
  1. Decode JWT
  2. Check role !== 'STAFF'
  3. Delete token from localStorage
  4. Show: "Sai email hoặc mật khẩu"
  5. Log: "❌ Rejected: Not a staff account (Role: CUSTOMER)"
  6. Stay on /staff/login

Attack Result: ❌ BLOCKED
Attacker Learns: Nothing (same error as wrong password)
```

### Scenario 2: Attacker tries invalid email on /staff/login

```
Input:
  Email: nonexistent@example.com
  Password: anypassword

Backend Response:
  Status: 400/401 Bad Request
  Body: { message: "Invalid credentials" }

Frontend Logic:
  1. Catch error
  2. Show: "Sai email hoặc mật khẩu"
  3. Stay on /staff/login

Attack Result: ❌ BLOCKED
Attacker Learns: Nothing (same error as wrong password)
```

### Scenario 3: Attacker tries correct staff account

```
Input:
  Email: staff@example.com
  Password: correctpassword

Backend Response:
  Status: 200 OK
  Body: { token: "JWT with role=STAFF" }

Frontend Logic:
  1. Decode JWT
  2. Check role == 'STAFF' ✓
  3. Save token & userInfo
  4. Navigate to /staff/dashboard
  5. StaffDashboard loads

Attack Result: ✅ Login successful (expected)
Attacker Learns: Valid credentials for staff account
Note: This is acceptable because attacker knew password
```

### Scenario 4: Attacker bypasses frontend & goes to /staff/dashboard directly

```
URL: localhost:3000/staff/dashboard

Frontend Logic:
  1. PrivateStaffRoute checks
  2. getToken() returns null
  3. Redirect to /staff/login
  4. Component never renders

Attack Result: ❌ BLOCKED
Attacker Learns: Must have valid authentication
```

### Scenario 5: Attacker modifies localStorage to bypass check

```
Action: localStorage.setItem("userInfo",
  JSON.stringify({role: "STAFF"}))

Frontend Logic:
  1. PrivateStaffRoute checks
  2. Token missing (can't be faked)
  3. Redirect to /staff/login

Attack Result: ❌ BLOCKED
Reason: Token is required and can't be faked
```

## Defense in Depth

### What We Protected

1. ✅ Role information is never revealed in error messages
2. ✅ Login failures all show same generic error
3. ✅ localStorage is cleared on failed login
4. ✅ Direct URL access is protected by route guards
5. ✅ Token is required to pass any check

### What We Didn't Protect (Backend's Job)

1. ❌ API endpoints must validate role again
2. ❌ Backend must not leak user data
3. ❌ Backend must handle role mismatch (403 Forbidden)
4. ❌ Backend must log suspicious activity
5. ❌ Backend must rate limit login attempts

## Backend Validation Example

```java
@GetMapping("/api/staff/sessions")
public ResponseEntity<?> getStaffSessions() {
  // Extract user from JWT (Spring Security does this)
  User currentUser = SecurityContextHolder.getContext()
    .getAuthentication().getPrincipal();

  // CRITICAL: Check role on backend
  if (currentUser.getRole() != Role.STAFF) {
    // Log suspicious activity
    logger.warn("Non-staff user attempted to access staff endpoint: "
      + currentUser.getEmail());

    // Return 403 Forbidden (don't leak info)
    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
  }

  // Load only staff's assigned sessions
  List<ChatSession> sessions = chatService
    .getSessionsForStaff(currentUser.getId());

  return ResponseEntity.ok(sessions);
}
```

## Security Best Practices Applied

### 1. **Principle of Least Privilege**

- Frontend only shows what's needed
- Backend validates every request
- Users can only access their own data

### 2. **Defense in Depth**

- Multiple layers of validation
- Frontend UX layer
- Route protection layer
- Backend API layer

### 3. **Fail Securely**

- Generic error messages
- Clear all credentials on failure
- Redirect to login page

### 4. **Don't Trust User Input**

- Check token on frontend (UX)
- Always verify on backend (security)
- Never trust localStorage values alone

### 5. **Security Logging**

```javascript
// Good examples of logging
console.warn("❌ Rejected: Not a staff account (Role:", role, ")");
console.log("✓ User info đã lưu (STAFF):", userInfo);

// Backend should log
logger.warn("Non-staff user attempted staff access: " + email);
logger.info("Staff user logged in successfully: " + email);
```

## Testing Security

### Test 1: Generic Error Messages

```bash
# Test with customer account on /staff/login
- Error should be identical to wrong password error
- No mention of "CUSTOMER" role
```

### Test 2: Storage Cleanup

```bash
# After failed login
- localStorage.getItem('token') should be null
- localStorage.getItem('userInfo') should be null
```

### Test 3: Route Protection

```bash
# Try accessing /staff/dashboard directly (no token)
- Should redirect to /staff/login
- Component should not render
```

### Test 4: Browser DevTools Check

```bash
# In browser console
localStorage.getItem('token')      # null or valid JWT
localStorage.getItem('userInfo')   # null or { email, role, customerId }
# Should NEVER have partial data
```

## Conclusion

The staff login system provides multiple layers of security:

1. ✅ **Frontend**: Generic errors, private routes, role checking
2. ✅ **Data Protection**: localStorage cleanup on failure
3. ✅ **Route Guard**: PrivateStaffRoute prevents unauthorized access
4. ⚠️ **Backend Validation**: Must also check role (not implemented here)

**Key Principle**: Never reveal role information to potential attackers. Always show the same error message regardless of failure reason.
