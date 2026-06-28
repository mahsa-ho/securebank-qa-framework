import sqlite3

DATABASE = "securebank.db"

conn = sqlite3.connect(DATABASE)
cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS transactions")
cursor.execute("DROP TABLE IF EXISTS accounts")
cursor.execute("DROP TABLE IF EXISTS users")

cursor.execute("""
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL
)
""")

cursor.execute("""
CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_number TEXT UNIQUE NOT NULL,
    balance REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
""")

cursor.execute("""
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
)
""")

users = [
    ("Mahsa Customer", "mahsa@test.com", "Password123", "customer", "Active"),
    ("Amir Customer", "amir@test.com", "Password123", "customer", "Active"),
    ("Frozen User", "frozen@test.com", "Password123", "customer", "Frozen"),
    ("Admin User", "admin@test.com", "Admin123", "admin", "Active"),
]

cursor.executemany("""
INSERT INTO users (name, email, password, role, status)
VALUES (?, ?, ?, ?, ?)
""", users)

accounts = [
    (1, "10010001", 2500.00),
    (2, "10010002", 1800.00),
    (3, "10010003", 900.00),
]

cursor.executemany("""
INSERT INTO accounts (user_id, account_number, balance)
VALUES (?, ?, ?)
""", accounts)

transactions = [
    (1, "Deposit", 2500.00, "Initial account deposit", "2026-06-01"),
    (1, "Debit", -75.50, "Grocery purchase", "2026-06-05"),
    (1, "Transfer", -100.00, "Transfer to Amir", "2026-06-10"),
    (2, "Deposit", 1800.00, "Initial account deposit", "2026-06-01"),
    (2, "Transfer", 100.00, "Transfer received", "2026-06-10"),
    (3, "Deposit", 900.00, "Initial account deposit", "2026-06-01"),
]

cursor.executemany("""
INSERT INTO transactions (account_id, type, amount, description, date)
VALUES (?, ?, ?, ?, ?)
""", transactions)

conn.commit()
conn.close()

print("Database created and seeded successfully.")
