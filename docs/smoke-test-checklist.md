# SecureBank Lite - Smoke Test Checklist

## Purpose

Smoke testing verifies that the most important features of the application are working after a new build or code change.

If any smoke test fails, the build should not be considered stable.

---

## Smoke Test Checklist

| ID | Feature | Test Scenario | Expected Result | Status |
|---|---|---|---|---|
| SMOKE-001 | App Launch | Open SecureBank Lite in browser | Login page loads successfully | Not Run |
| SMOKE-002 | Backend Health | Open `/api/health` | API returns status ok | Not Run |
| SMOKE-003 | Customer Login | Login with `mahsa@test.com` | Customer dashboard opens | Not Run |
| SMOKE-004 | Admin Login | Login with `admin@test.com` | Admin dashboard opens | Not Run |
| SMOKE-005 | Dashboard | View customer dashboard | Balance and recent transactions display | Not Run |
| SMOKE-006 | Transfer | Transfer $100 to account `10010002` | Success message appears | Not Run |
| SMOKE-007 | Transactions | Open transaction history | Transaction table displays | Not Run |
| SMOKE-008 | Admin Users | Admin views all users | User table displays | Not Run |
| SMOKE-009 | Freeze User | Admin freezes a customer | Status changes to Frozen | Not Run |
| SMOKE-010 | Logout | User logs out | Login page displays | Not Run |

---

## Smoke Test Result Summary

| Date | Tester | Build | Passed | Failed | Notes |
|---|---|---|---|---|---|
| TBD | Mahsa Hosseini | Local Build | TBD | TBD | Initial smoke test |
