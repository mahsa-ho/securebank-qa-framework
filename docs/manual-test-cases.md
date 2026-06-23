# SecureBank Lite - Manual Test Cases

## Purpose

This document contains manual test cases for the SecureBank Lite mock banking application.

The goal is to verify login, dashboard, transfer, transactions, admin, and logout functionality before automation testing.

---

## Test Case Format

Each test case includes:

- Test Case ID
- Feature
- Scenario
- Steps
- Expected Result
- Priority
- Test Type

---

## Login Test Cases

### TC-LOGIN-001: Valid Customer Login

**Feature:** Login  
**Scenario:** Customer logs in with valid credentials  
**Priority:** High  
**Test Type:** Positive  

**Steps:**

1. Open SecureBank Lite.
2. Enter email: `mahsa@test.com`.
3. Enter password: `Password123`.
4. Click Login.

**Expected Result:**

Customer should be redirected to the dashboard.

---

### TC-LOGIN-002: Valid Admin Login

**Feature:** Login  
**Scenario:** Admin logs in with valid credentials  
**Priority:** High  
**Test Type:** Positive  

**Steps:**

1. Open SecureBank Lite.
2. Enter email: `admin@test.com`.
3. Enter password: `Admin123`.
4. Click Login.

**Expected Result:**

Admin should be redirected to the admin dashboard.

---

### TC-LOGIN-003: Invalid Password

**Feature:** Login  
**Scenario:** User enters wrong password  
**Priority:** High  
**Test Type:** Negative  

**Steps:**

1. Open SecureBank Lite.
2. Enter email: `mahsa@test.com`.
3. Enter password: `wrong`.
4. Click Login.

**Expected Result:**

User should see error message: `Invalid email or password.`

---

### TC-LOGIN-004: Empty Email

**Feature:** Login  
**Scenario:** User submits login form without email  
**Priority:** Medium  
**Test Type:** Negative  

**Steps:**

1. Open SecureBank Lite.
2. Clear the email field.
3. Enter password: `Password123`.
4. Click Login.

**Expected Result:**

User should see error message: `Email is required.`

---

### TC-LOGIN-005: Empty Password

**Feature:** Login  
**Scenario:** User submits login form without password  
**Priority:** Medium  
**Test Type:** Negative  

**Steps:**

1. Open SecureBank Lite.
2. Enter email: `mahsa@test.com`.
3. Clear the password field.
4. Click Login.

**Expected Result:**

User should see error message: `Password is required.`

---

## Dashboard Test Cases

### TC-DASH-001: View Customer Dashboard

**Feature:** Dashboard  
**Scenario:** Customer views account information  
**Priority:** High  
**Test Type:** Positive  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Navigate to dashboard.

**Expected Result:**

Dashboard should display customer name, account number, balance, and recent transactions.

---

### TC-DASH-002: Frozen Account Warning

**Feature:** Dashboard  
**Scenario:** Frozen user views dashboard  
**Priority:** High  
**Test Type:** Positive  

**Steps:**

1. Log in as `frozen@test.com`.
2. Navigate to dashboard.

**Expected Result:**

Dashboard should show warning message that the account is frozen.

---

## Transfer Test Cases

### TC-TRANSFER-001: Successful Transfer

**Feature:** Transfer  
**Scenario:** Customer transfers money to another account  
**Priority:** High  
**Test Type:** Positive  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Go to Transfer page.
3. Enter recipient account number: `10010002`.
4. Enter amount: `100`.
5. Enter description: `Test transfer`.
6. Click Submit Transfer.

**Expected Result:**

User should see message: `Transfer completed successfully.`  
Sender balance should decrease.  
Recipient balance should increase.  
Transaction should appear in transaction history.

---

### TC-TRANSFER-002: Insufficient Balance

**Feature:** Transfer  
**Scenario:** Customer transfers more than available balance  
**Priority:** High  
**Test Type:** Negative  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Go to Transfer page.
3. Enter recipient account number: `10010002`.
4. Enter amount: `999999`.
5. Click Submit Transfer.

**Expected Result:**

User should see error message: `Insufficient balance.`  
Balance should not change.

---

### TC-TRANSFER-003: Zero Amount

**Feature:** Transfer  
**Scenario:** Customer enters zero transfer amount  
**Priority:** Medium  
**Test Type:** Negative  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Go to Transfer page.
3. Enter recipient account number: `10010002`.
4. Enter amount: `0`.
5. Click Submit Transfer.

**Expected Result:**

User should see error message: `Amount must be greater than 0.`

---

### TC-TRANSFER-004: Negative Amount

**Feature:** Transfer  
**Scenario:** Customer enters negative transfer amount  
**Priority:** Medium  
**Test Type:** Negative  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Go to Transfer page.
3. Enter recipient account number: `10010002`.
4. Enter amount: `-5`.
5. Click Submit Transfer.

**Expected Result:**

User should see error message: `Amount must be greater than 0.`

---

### TC-TRANSFER-005: Invalid Recipient Account

**Feature:** Transfer  
**Scenario:** Customer enters account number that does not exist  
**Priority:** High  
**Test Type:** Negative  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Go to Transfer page.
3. Enter recipient account number: `99999999`.
4. Enter amount: `50`.
5. Click Submit Transfer.

**Expected Result:**

User should see error message: `Recipient account not found.`

---

### TC-TRANSFER-006: Transfer to Own Account

**Feature:** Transfer  
**Scenario:** Customer tries to transfer to their own account  
**Priority:** High  
**Test Type:** Negative  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Go to Transfer page.
3. Enter recipient account number: `10010001`.
4. Enter amount: `50`.
5. Click Submit Transfer.

**Expected Result:**

User should see error message: `You cannot transfer money to your own account.`

---

### TC-TRANSFER-007: Frozen User Transfer Blocked

**Feature:** Transfer  
**Scenario:** Frozen user tries to transfer money  
**Priority:** High  
**Test Type:** Negative  

**Steps:**

1. Log in as `frozen@test.com`.
2. Go to Transfer page.
3. Try to submit a transfer.

**Expected Result:**

User should see message: `Account is frozen. Transfer not allowed.`  
Transfer button should be disabled.

---

## Transactions Test Cases

### TC-TRANS-001: View Transaction History

**Feature:** Transactions  
**Scenario:** Customer views transaction history  
**Priority:** High  
**Test Type:** Positive  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Go to Transactions page.

**Expected Result:**

Transaction table should display date, type, description, and amount.

---

### TC-TRANS-002: Search Existing Transaction

**Feature:** Transactions  
**Scenario:** Customer searches for existing transaction  
**Priority:** Medium  
**Test Type:** Positive  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Go to Transactions page.
3. Search for `Grocery`.
4. Click Apply Filter.

**Expected Result:**

Matching transaction should be displayed.

---

### TC-TRANS-003: Search No Results

**Feature:** Transactions  
**Scenario:** Customer searches for transaction that does not exist  
**Priority:** Medium  
**Test Type:** Negative  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Go to Transactions page.
3. Search for `randomtext123`.
4. Click Apply Filter.

**Expected Result:**

User should see message: `No transactions found.`

---

### TC-TRANS-004: Filter by Transfer

**Feature:** Transactions  
**Scenario:** Customer filters transaction history by transfer type  
**Priority:** Medium  
**Test Type:** Positive  

**Steps:**

1. Log in as `mahsa@test.com`.
2. Go to Transactions page.
3. Select type: `Transfer`.
4. Click Apply Filter.

**Expected Result:**

Only transfer transactions should be displayed.

---

## Admin Test Cases

### TC-ADMIN-001: View All Users

**Feature:** Admin  
**Scenario:** Admin views all users  
**Priority:** High  
**Test Type:** Positive  

**Steps:**

1. Log in as `admin@test.com`.
2. Go to Admin page.

**Expected Result:**

Admin should see all users with name, email, role, account number, balance, status, and action.

---

### TC-ADMIN-002: Freeze User

**Feature:** Admin  
**Scenario:** Admin freezes active customer  
**Priority:** High  
**Test Type:** Positive  

**Steps:**

1. Log in as `admin@test.com`.
2. Find an active customer.
3. Click Freeze.

**Expected Result:**

User status should change to Frozen.

---

### TC-ADMIN-003: Unfreeze User

**Feature:** Admin  
**Scenario:** Admin unfreezes frozen customer  
**Priority:** High  
**Test Type:** Positive  

**Steps:**

1. Log in as `admin@test.com`.
2. Find a frozen customer.
3. Click Unfreeze.

**Expected Result:**

User status should change to Active.

---

## Logout Test Cases

### TC-LOGOUT-001: Logout User

**Feature:** Logout  
**Scenario:** User logs out  
**Priority:** High  
**Test Type:** Positive  

**Steps:**

1. Log in as a customer.
2. Click Logout.

**Expected Result:**

User should be redirected to the login page.
