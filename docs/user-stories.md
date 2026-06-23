cat > docs/user-stories.md <<'EOF'
# SecureBank Lite - User Stories

## Purpose

This document defines user stories for the SecureBank Lite mock banking application.

These user stories will be used later to create manual test cases, automated UI tests, API tests, and regression test scenarios.

---

## Login User Stories

### User Story 1: Customer Login

As a customer, I want to log in with my email and password so that I can access my banking dashboard.

### Acceptance Criteria

- Customer can log in with valid credentials.
- Customer cannot log in with invalid credentials.
- Customer sees an error message for invalid login.
- Customer sees required field messages when email or password is empty.

---

### User Story 2: Admin Login

As an admin, I want to log in with my admin account so that I can manage users and accounts.

### Acceptance Criteria

- Admin can log in with valid admin credentials.
- Admin is redirected to the admin dashboard.
- Admin can see user management options.

---

## Dashboard User Stories

### User Story 3: View Account Dashboard

As a customer, I want to view my account dashboard so that I can see my balance and recent transactions.

### Acceptance Criteria

- Customer can see their full name.
- Customer can see their account number.
- Customer can see their current balance.
- Customer can see recent transactions.
- Customer cannot see another customer's information.

---

## Transfer User Stories

### User Story 4: Transfer Money Successfully

As a customer, I want to transfer money to another account so that I can send funds.

### Acceptance Criteria

- Customer enters recipient account number.
- Customer enters a valid amount.
- Customer enters an optional description.
- Transfer is completed successfully.
- Sender balance decreases.
- Recipient balance increases.
- A transaction record is created.
- Success message is displayed.

---

### User Story 5: Prevent Transfer with Insufficient Balance

As a customer, I want the app to stop transfers that are greater than my balance so that I cannot overdraw my account.

### Acceptance Criteria

- Customer enters an amount greater than available balance.
- Transfer is not completed.
- Balance does not change.
- Error message "Insufficient balance." is displayed.

---

### User Story 6: Prevent Negative or Zero Transfer Amount

As a customer, I want the app to reject zero or negative transfer amounts so that invalid transactions are not created.

### Acceptance Criteria

- Customer enters 0 or a negative amount.
- Transfer is not completed.
- Balance does not change.
- Error message "Amount must be greater than 0." is displayed.

---

### User Story 7: Prevent Transfer to Invalid Account

As a customer, I want the app to reject transfers to accounts that do not exist so that money is not sent to an invalid destination.

### Acceptance Criteria

- Customer enters an invalid recipient account number.
- Transfer is not completed.
- Balance does not change.
- Error message "Recipient account not found." is displayed.

---

### User Story 8: Prevent Transfer to Same Account

As a customer, I want the app to stop me from transferring money to my own account so that duplicate or meaningless transactions are not created.

### Acceptance Criteria

- Customer enters their own account number as recipient.
- Transfer is not completed.
- Error message "You cannot transfer money to your own account." is displayed.

---

### User Story 9: Frozen User Cannot Transfer

As a frozen user, I want to be blocked from transferring money so that suspicious account activity can be controlled.

### Acceptance Criteria

- Frozen user can log in.
- Frozen user can view dashboard.
- Frozen user cannot complete a transfer.
- Error message "Account is frozen. Transfer not allowed." is displayed.

---

## Transaction User Stories

### User Story 10: View Transaction History

As a customer, I want to view my transaction history so that I can review my account activity.

### Acceptance Criteria

- Customer can see all their transactions.
- Transaction table shows date, type, description, and amount.
- Customer cannot see another user's transactions.

---

### User Story 11: Search Transactions

As a customer, I want to search my transactions by keyword so that I can quickly find specific activity.

### Acceptance Criteria

- Customer can enter a search keyword.
- Matching transactions are displayed.
- Non-matching transactions are hidden.
- If there are no matches, "No transactions found." is displayed.

---

### User Story 12: Filter Transactions

As a customer, I want to filter transactions by type so that I can view deposits, withdrawals, or transfers separately.

### Acceptance Criteria

- Customer can filter by all transactions.
- Customer can filter by deposit.
- Customer can filter by withdrawal.
- Customer can filter by transfer.

---

## Admin User Stories

### User Story 13: View All Users

As an admin, I want to view all users so that I can monitor customer accounts.

### Acceptance Criteria

- Admin can see a list of users.
- Admin can see each user's name, email, role, and frozen status.
- Customers cannot access this page.

---

### User Story 14: Freeze Customer Account

As an admin, I want to freeze a customer account so that the customer cannot transfer money.

### Acceptance Criteria

- Admin can click freeze for an active customer.
- User status changes to frozen.
- Frozen customer cannot transfer money.

---

### User Story 15: Unfreeze Customer Account

As an admin, I want to unfreeze a customer account so that the customer can transfer money again.

### Acceptance Criteria

- Admin can click unfreeze for a frozen customer.
- User status changes to active.
- Customer can transfer money again.

---

## Logout User Story

### User Story 16: Logout

As a user, I want to log out so that my account is protected after I finish using the app.

### Acceptance Criteria

- User can click logout.
- User is redirected to the login page.
- User cannot access dashboard after logout without logging in again.
EOF