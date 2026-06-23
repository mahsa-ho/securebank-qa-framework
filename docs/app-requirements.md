cat > docs/app-requirements.md <<'EOF'
# SecureBank Lite - App Requirements

## Project Overview

SecureBank Lite is a mock banking web application created for QA automation and testing practice.

The app will simulate common banking features such as login, account dashboard, money transfer, transaction history, and admin account management.

This application will be used later to build UI automation tests, API tests, database validation tests, regression tests, security checks, and CI/CD test pipelines.

---

## User Roles

### 1. Customer

A customer can:

- Log in to the banking app
- View account balance
- View account number
- View recent transactions
- Transfer money to another account
- Search transaction history
- Filter transactions by type
- Log out

### 2. Admin

An admin can:

- Log in to the admin dashboard
- View all users
- View all customer accounts
- Freeze a customer account
- Unfreeze a customer account

### 3. Frozen User

A frozen user can:

- Log in
- View dashboard
- View transactions

A frozen user cannot:

- Transfer money

---

## Demo Users

| Role | Name | Email | Password | Status |
|---|---|---|---|---|
| Customer | Mahsa Customer | mahsa@test.com | Password123 | Active |
| Customer | Amir Customer | amir@test.com | Password123 | Active |
| Customer | Frozen User | frozen@test.com | Password123 | Frozen |
| Admin | Admin User | admin@test.com | Admin123 | Active |

---

## Main Features

## 1. Login

Users must enter their email and password to access the app.

### Acceptance Criteria

- User should be able to log in with valid email and password.
- User should not be able to log in with invalid email or password.
- User should see an error message for wrong credentials.
- User should see validation messages if email or password is empty.
- Admin users should be redirected to the admin dashboard.
- Customer users should be redirected to the customer dashboard.

### Error Messages

| Scenario | Message |
|---|---|
| Empty email | Email is required. |
| Empty password | Password is required. |
| Wrong email or password | Invalid email or password. |

---

## 2. Customer Dashboard

After login, customers should see their account information.

### Dashboard should display:

- Customer full name
- Account number
- Current balance
- Last 5 transactions
- Navigation buttons for transfer and transactions

### Acceptance Criteria

- Customer should see their correct name.
- Customer should see their own account number.
- Customer should see their current balance.
- Customer should see recent transactions.
- Customer should not see another user's account information.

---

## 3. Money Transfer

Customers should be able to transfer money to another valid account.

### Transfer Form Fields

- Recipient account number
- Amount
- Description

### Transfer Rules

- Amount must be greater than 0.
- Amount cannot be empty.
- Amount cannot be more than the current balance.
- Recipient account must exist.
- User cannot transfer money to their own account.
- Frozen users cannot transfer money.
- Successful transfer should update both account balances.
- Successful transfer should create a transaction record.

### Success Message

| Scenario | Message |
|---|---|
| Successful transfer | Transfer completed successfully. |

### Error Messages

| Scenario | Message |
|---|---|
| Empty amount | Amount is required. |
| Negative amount | Amount must be greater than 0. |
| Amount is 0 | Amount must be greater than 0. |
| Amount greater than balance | Insufficient balance. |
| Invalid recipient account | Recipient account not found. |
| Transfer to own account | You cannot transfer money to your own account. |
| Frozen account transfer | Account is frozen. Transfer not allowed. |

---

## 4. Transaction History

Customers should be able to view, search, and filter their transactions.

### Transaction Table Columns

- Date
- Type
- Description
- Amount

### Transaction Types

- Deposit
- Withdrawal
- Transfer

### Acceptance Criteria

- Customer should see only their own transactions.
- Customer should be able to search transactions by keyword.
- Customer should be able to filter by transaction type.
- If no transaction matches the search, the app should show a no-results message.

### Error / Empty State Message

| Scenario | Message |
|---|---|
| No matching transactions | No transactions found. |

---

## 5. Admin Dashboard

Admin users should be able to manage customer accounts.

### Admin Dashboard should display:

- User name
- Email
- Role
- Frozen status
- Freeze button
- Unfreeze button

### Acceptance Criteria

- Admin can view all users.
- Admin can freeze an active customer account.
- Admin can unfreeze a frozen customer account.
- Customer users cannot access the admin dashboard.
- Frozen users cannot access admin features.

### Error Messages

| Scenario | Message |
|---|---|
| Customer tries to access admin page | Access denied. |
| Invalid admin action | Action could not be completed. |

---

## 6. Logout

Users should be able to log out of the app.

### Acceptance Criteria

- User can click logout.
- User should be redirected to the login page.
- User should not access dashboard pages after logout.

---

## Future QA Testing Scope

This app will be tested using:

- Manual test cases
- UI automation tests with Playwright
- API tests
- Database validation tests
- Smoke testing
- Regression testing
- Negative testing
- Role-based access testing
- GitHub Actions CI pipeline
- Security testing
- Performance testing
EOF