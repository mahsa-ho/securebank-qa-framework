from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from database import get_db_connection, init_db


def seed_database():
    init_db()
    connection = get_db_connection()
    cursor = connection.cursor()

    # Clear old data
    cursor.execute("DELETE FROM transactions")
    cursor.execute("DELETE FROM accounts")
    cursor.execute("DELETE FROM users")

    # Reset IDs
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='transactions'")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='accounts'")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='users'")

    users = [
        ("Mahsa Customer", "mahsa@test.com", generate_password_hash("Password123"), "customer", 0),
        ("Amir Customer", "amir@test.com", generate_password_hash("Password123"), "customer", 0),
        ("Frozen User", "frozen@test.com", generate_password_hash("Password123"), "customer", 1),
        ("Admin User", "admin@test.com", generate_password_hash("Admin123"), "admin", 0),
    ]

    cursor.executemany("""
        INSERT INTO users (name, email, password, role, is_frozen)
        VALUES (?, ?, ?, ?, ?)
    """, users)

    accounts = [
        (1, "10010001", 2500.00),
        (2, "10010002", 1200.00),
        (3, "10010003", 800.00),
        (4, "90090001", 0.00),
    ]

    cursor.executemany("""
        INSERT INTO accounts (user_id, account_number, balance)
        VALUES (?, ?, ?)
    """, accounts)

    now = datetime.now()

    transactions = [
        (1, "Deposit", 2500.00, "Initial account deposit", (now - timedelta(days=10)).isoformat()),
        (1, "Withdrawal", -120.00, "Grocery purchase", (now - timedelta(days=7)).isoformat()),
        (1, "Transfer", -50.00, "Transfer to Amir", (now - timedelta(days=3)).isoformat()),

        (2, "Deposit", 1200.00, "Initial account deposit", (now - timedelta(days=8)).isoformat()),
        (2, "Transfer", 50.00, "Transfer from Mahsa", (now - timedelta(days=3)).isoformat()),

        (3, "Deposit", 800.00, "Initial account deposit", (now - timedelta(days=5)).isoformat()),
    ]

    cursor.executemany("""
        INSERT INTO transactions (account_id, type, amount, description, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, transactions)

    connection.commit()
    connection.close()

    print("Database created and seeded successfully.")


if __name__ == "__main__":
    seed_database()
