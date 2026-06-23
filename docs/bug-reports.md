# SecureBank Lite - Sample Bug Reports

## Purpose

This document contains sample bug reports for the SecureBank Lite QA project.

These examples show how defects would be documented during manual or automated testing.

---

# Bug Report 1

## Bug ID

BUG-001

## Title

Transfer button remains enabled for frozen user

## Severity

High

## Priority

High

## Environment

- Browser: Chrome
- App: SecureBank Lite
- Backend: Flask API running locally
- Frontend: React app running locally

## Preconditions

- Frozen user account exists.
- User is logged in as `frozen@test.com`.

## Steps to Reproduce

1. Open SecureBank Lite.
2. Log in using:
   - Email: `frozen@test.com`
   - Password: `Password123`
3. Navigate to Transfer page.
4. Check the Submit Transfer button.

## Expected Result

Submit Transfer button should be disabled for frozen users.

## Actual Result

Submit Transfer button is enabled.

## Impact

Frozen users may attempt transactions even though their account should be blocked.

## Status

Sample / Fixed

---

# Bug Report 2

## Bug ID

BUG-002

## Title

Transaction search does not show no-results message

## Severity

Medium

## Priority

Medium

## Environment

- Browser: Chrome
- App: SecureBank Lite
- Frontend: React
- Backend: Flask

## Preconditions

- Customer is logged in.
- Customer has transaction history.

## Steps to Reproduce

1. Log in as `mahsa@test.com`.
2. Go to Transactions page.
3. Search for `randomtext123`.
4. Click Apply Filter.

## Expected Result

The message `No transactions found.` should be displayed.

## Actual Result

The table area becomes empty without a clear message.

## Impact

User may not understand whether the search worked or if the app failed.

## Status

Sample / Fixed

---

# Bug Report 3

## Bug ID

BUG-003

## Title

Wrong password error message is not displayed clearly

## Severity

Medium

## Priority

High

## Environment

- Browser: Chrome
- App: SecureBank Lite
- Frontend: React
- Backend: Flask

## Preconditions

- User is on the login page.

## Steps to Reproduce

1. Open SecureBank Lite.
2. Enter email: `mahsa@test.com`.
3. Enter password: `wrong`.
4. Click Login.

## Expected Result

User should see: `Invalid email or password.`

## Actual Result

No visible error message appears.

## Impact

User does not understand why login failed.

## Status

Sample / Fixed

---

# Bug Report 4

## Bug ID

BUG-004

## Title

Customer can access admin route directly

## Severity

Critical

## Priority

High

## Environment

- Browser: Chrome
- App: SecureBank Lite
- Frontend: React Router
- Backend: Flask API

## Preconditions

- Customer is logged in as `mahsa@test.com`.

## Steps to Reproduce

1. Log in as customer.
2. Manually enter `/admin` in the browser URL.
3. Press Enter.

## Expected Result

Customer should be redirected to the customer dashboard or shown access denied.

## Actual Result

Customer can view admin dashboard.

## Impact

Unauthorized users may access admin functionality.

## Status

Sample / Fixed
