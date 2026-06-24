# SecureBank QA Automation Framework - Interview Notes

## Project Summary

SecureBank Lite is a full-stack QA automation portfolio project for a mock banking application.

The application includes customer login, account dashboard, transaction history, money transfer, and admin account management. I built the app using React, Flask, and SQLite, then created manual QA documentation and Playwright automation tests.

---

## Why I Built This Project

I wanted to create a realistic QA project that shows both software development and testing skills.

Instead of only writing simple test scripts, I built a testable application, wrote requirements, created manual test cases, documented bugs, automated test scenarios, and connected the tests to GitHub Actions CI.

---

## Tools Used

- React
- Vite
- Python
- Flask
- SQLite
- Playwright
- GitHub Actions
- Git
- GitHub

---

## QA Work Completed

- Requirements documentation
- User stories
- Manual test cases
- Smoke test checklist
- Regression test checklist
- Sample bug reports
- Playwright UI automation tests
- GitHub Actions CI workflow

---

## Automated Test Coverage

The Playwright test suite covers:

- Customer login
- Admin login
- Invalid login
- Empty email validation
- Empty password validation
- Dashboard loading
- Account balance visibility
- Recent transactions
- Transaction search
- Transaction filtering
- Successful transfer
- Insufficient balance validation
- Zero amount validation
- Negative amount validation
- Invalid recipient validation
- Transfer to own account validation
- Frozen user transfer restriction
- Admin dashboard
- Admin user table
- Freeze user
- Unfreeze user
- Customer blocked from admin page

Total automated tests: 27 Playwright UI tests.

---

## CI/CD Explanation

I added a GitHub Actions workflow that runs automatically when code is pushed to the main branch.

The workflow installs backend dependencies, seeds the database, starts the Flask backend, installs frontend dependencies, starts the React frontend, installs Playwright browsers, runs the automated tests, and uploads the Playwright report.

This shows that the tests can run successfully in a clean CI environment.

---

## Challenges I Solved

### 1. Playwright could not find input fields

The login form labels were not connected to the inputs. I fixed this by adding htmlFor on labels and id on inputs. This improved both accessibility and test reliability.

### 2. Tests depended on exact balance values

One dashboard test failed because the balance value could change after transfer tests. I improved the test by checking that the balance element exists instead of depending on one exact amount.

### 3. Admin tests changed database state

Freeze and unfreeze tests changed the user status. I fixed this by resetting test data before admin tests using API calls, so every test starts from a predictable state.

### 4. GitHub Actions failed on npm ci

The CI workflow failed because package.json and package-lock.json were not fully in sync. I changed the workflow to use npm install, then verified the workflow passed.

---

## Interview Explanation

I built SecureBank Lite as a QA automation portfolio project. It is a mock banking application with customer and admin workflows. I created the frontend with React, the backend with Flask, and used SQLite for the database.

From the QA side, I wrote requirements, user stories, manual test cases, smoke and regression checklists, and sample bug reports. Then I automated the main workflows using Playwright, including login, dashboard, transactions, transfers, and admin actions.

I also integrated GitHub Actions so the Playwright tests run automatically whenever I push code. This helped me practice both manual QA and automation testing in a realistic full-stack project.

---

## Resume Bullets

- Built a full-stack QA automation portfolio project for a mock banking application using React, Flask, SQLite, and Playwright.
- Created manual test cases, smoke test checklist, regression checklist, and sample bug reports for customer, transfer, transaction, and admin workflows.
- Developed 27 Playwright UI automation tests covering positive, negative, validation, and access-control scenarios.
- Integrated GitHub Actions CI to automatically run Playwright tests on push and pull request events.
- Improved frontend testability and accessibility by connecting form labels to input fields and using stable selectors.
