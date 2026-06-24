# SecureBank QA Automation Framework

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