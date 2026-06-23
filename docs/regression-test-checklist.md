# SecureBank Lite - Regression Test Checklist

## Purpose

Regression testing verifies that existing features still work after code changes.

This checklist will be used before releases and before pushing major updates.

---

## Login Regression Tests

| ID | Scenario | Expected Result | Status |
|---|---|---|---|
| REG-LOGIN-001 | Valid customer login | Dashboard opens | Not Run |
| REG-LOGIN-002 | Valid admin login | Admin page opens | Not Run |
| REG-LOGIN-003 | Invalid password | Error message appears | Not Run |
| REG-LOGIN-004 | Empty email | Email required message appears | Not Run |
| REG-LOGIN-005 | Empty password | Password required message appears | Not Run |

---

## Dashboard Regression Tests

| ID | Scenario | Expected Result | Status |
|---|---|---|---|
| REG-DASH-001 | Customer dashboard loads | Account information appears | Not Run |
| REG-DASH-002 | Recent transactions load | Last transactions appear | Not Run |
| REG-DASH-003 | Frozen user warning appears | Warning message appears | Not Run |

---

## Transfer Regression Tests

| ID | Scenario | Expected Result | Status |
|---|---|---|---|
| REG-TRANSFER-001 | Valid transfer | Transfer succeeds | Not Run |
| REG-TRANSFER-002 | Insufficient balance | Error message appears | Not Run |
| REG-TRANSFER-003 | Zero amount | Error message appears | Not Run |
| REG-TRANSFER-004 | Negative amount | Error message appears | Not Run |
| REG-TRANSFER-005 | Invalid recipient | Error message appears | Not Run |
| REG-TRANSFER-006 | Transfer to own account | Error message appears | Not Run |
| REG-TRANSFER-007 | Frozen user transfer | Transfer is blocked | Not Run |

---

## Transactions Regression Tests

| ID | Scenario | Expected Result | Status |
|---|---|---|---|
| REG-TRANS-001 | View all transactions | Table displays transactions | Not Run |
| REG-TRANS-002 | Search transaction | Matching result appears | Not Run |
| REG-TRANS-003 | Search no result | No transactions found message appears | Not Run |
| REG-TRANS-004 | Filter deposits | Only deposits appear | Not Run |
| REG-TRANS-005 | Filter withdrawals | Only withdrawals appear | Not Run |
| REG-TRANS-006 | Filter transfers | Only transfers appear | Not Run |

---

## Admin Regression Tests

| ID | Scenario | Expected Result | Status |
|---|---|---|---|
| REG-ADMIN-001 | Admin views all users | User list appears | Not Run |
| REG-ADMIN-002 | Admin freezes user | User status becomes Frozen | Not Run |
| REG-ADMIN-003 | Admin unfreezes user | User status becomes Active | Not Run |
| REG-ADMIN-004 | Customer cannot access admin page | Customer is redirected | Not Run |

---

## Logout Regression Tests

| ID | Scenario | Expected Result | Status |
|---|---|---|---|
| REG-LOGOUT-001 | Customer logout | Login page appears | Not Run |
| REG-LOGOUT-002 | Admin logout | Login page appears | Not Run |
