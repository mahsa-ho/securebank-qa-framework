# SecureBank QA Automation Framework

[![Playwright Tests](https://github.com/mahsa-ho/securebank-qa-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/mahsa-ho/securebank-qa-framework/actions/workflows/playwright.yml)

SecureBank Lite is a mock banking web application created for QA automation and software testing practice.

This project simulates a small banking system with customer login, account dashboard, money transfer, transaction history, and admin account management. It is designed to demonstrate manual QA, test planning, bug reporting, API testing, UI automation, and CI/CD testing skills.

---

## Project Purpose

The purpose of this project is to build a realistic QA portfolio project for software QA, automation testing, and software engineering co-op roles.

The project focuses on:

- Manual test case design
- Smoke testing
- Regression testing
- Bug reporting
- UI testing preparation
- API testing preparation
- Backend validation
- Frontend validation
- Future automation with Playwright
- Future CI/CD with GitHub Actions

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- CSS

### Backend

- Python
- Flask
- Flask-CORS
- SQLite

### QA / Testing

- Manual test cases
- Smoke test checklist
- Regression test checklist
- Sample bug reports
- Planned Playwright automation
- Planned GitHub Actions CI pipeline

---

## Automation Testing Coverage

Automated UI tests were created using Playwright.

Current automated test coverage includes:

| Test File | Coverage |
|---|---|
| login.spec.js | Customer login, admin login, invalid password, empty email, empty password |
| dashboard.spec.js | Dashboard loading, account balance, account number, recent transactions, navigation |
| transactions.spec.js | Transaction page loading, transaction table, search, no-results message, type filter |
| transfer.spec.js | Successful transfer, insufficient balance, zero amount, negative amount, invalid recipient, transfer to own account, frozen user restriction |
| admin.spec.js | Admin dashboard, user table, freeze user, unfreeze user, customer blocked from admin page |

Total automated tests:

```text
27 Playwright UI tests
---

## Main Features

### Customer Features

- Customer login
- View account dashboard
- View account balance
- View recent transactions
- Transfer money to another account
- Search transactions
- Filter transactions by type
- Logout

### Admin Features

- Admin login
- View all users
- View customer account status
- Freeze customer account
- Unfreeze customer account

### Validation Features

- Empty email validation
- Empty password validation
- Invalid login validation
- Empty transfer amount validation
- Negative amount validation
- Insufficient balance validation
- Invalid recipient validation
- Transfer to own account validation
- Frozen account transfer blocking

---

## Demo Users

| Role | Email | Password | Status |
|---|---|---|---|
| Customer | mahsa@test.com | Password123 | Active |
| Customer | amir@test.com | Password123 | Active |
| Customer | frozen@test.com | Password123 | Frozen |
| Admin | admin@test.com | Admin123 | Active |

---

## How to Run the Project Locally

### 1. Run Backend

Open Terminal 1:

```bash
cd backend
source venv/bin/activate
python seed.py
python app.py

---

## Final Project Status

Current project status:

- Full-stack mock banking app completed
- QA documentation completed
- Manual test cases completed
- Smoke and regression checklists completed
- Bug report examples completed
- Playwright automation tests completed
- GitHub Actions CI completed
- 27 automated UI tests created
- CI workflow passing successfully