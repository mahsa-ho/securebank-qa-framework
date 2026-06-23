from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import check_password_hash
from database import get_db_connection, init_db

app = Flask(__name__)
CORS(app)


def row_to_dict(row):
    return dict(row) if row else None


def get_user_by_id(user_id):
    connection = get_db_connection()
    user = connection.execute(
        "SELECT id, name, email, role, is_frozen FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()
    connection.close()
    return row_to_dict(user)


def is_admin(user_id):
    user = get_user_by_id(user_id)
    return user is not None and user["role"] == "admin"


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "SecureBank API is running"
    }), 200


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email:
        return jsonify({"error": "Email is required."}), 400

    if not password:
        return jsonify({"error": "Password is required."}), 400

    connection = get_db_connection()
    user = connection.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()
    connection.close()

    if user is None or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password."}), 401

    return jsonify({
        "message": "Login successful.",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "is_frozen": bool(user["is_frozen"])
        }
    }), 200


@app.route("/api/accounts/<int:user_id>", methods=["GET"])
def get_account(user_id):
    connection = get_db_connection()

    account = connection.execute("""
        SELECT accounts.id, accounts.user_id, accounts.account_number, accounts.balance,
               users.name, users.email, users.role, users.is_frozen
        FROM accounts
        JOIN users ON accounts.user_id = users.id
        WHERE users.id = ?
    """, (user_id,)).fetchone()

    if account is None:
        connection.close()
        return jsonify({"error": "Account not found."}), 404

    recent_transactions = connection.execute("""
        SELECT id, type, amount, description, created_at
        FROM transactions
        WHERE account_id = ?
        ORDER BY created_at DESC
        LIMIT 5
    """, (account["id"],)).fetchall()

    connection.close()

    return jsonify({
        "account": {
            "id": account["id"],
            "user_id": account["user_id"],
            "name": account["name"],
            "email": account["email"],
            "role": account["role"],
            "is_frozen": bool(account["is_frozen"]),
            "account_number": account["account_number"],
            "balance": account["balance"],
            "recent_transactions": [row_to_dict(t) for t in recent_transactions]
        }
    }), 200


@app.route("/api/transactions/<int:account_id>", methods=["GET"])
def get_transactions(account_id):
    search = request.args.get("search", "").strip()
    transaction_type = request.args.get("type", "").strip()

    query = """
        SELECT id, account_id, type, amount, description, created_at
        FROM transactions
        WHERE account_id = ?
    """
    params = [account_id]

    if search:
        query += " AND description LIKE ?"
        params.append(f"%{search}%")

    if transaction_type and transaction_type.lower() != "all":
        query += " AND LOWER(type) = LOWER(?)"
        params.append(transaction_type)

    query += " ORDER BY created_at DESC"

    connection = get_db_connection()
    transactions = connection.execute(query, params).fetchall()
    connection.close()

    return jsonify({
        "transactions": [row_to_dict(transaction) for transaction in transactions]
    }), 200


@app.route("/api/transfer", methods=["POST"])
def transfer_money():
    data = request.get_json() or {}

    user_id = data.get("user_id")
    recipient_account_number = str(data.get("recipient_account_number", "")).strip()
    amount = data.get("amount")
    description = data.get("description", "Money transfer").strip()

    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    if not recipient_account_number:
        return jsonify({"error": "Recipient account number is required."}), 400

    if amount in [None, ""]:
        return jsonify({"error": "Amount is required."}), 400

    try:
        amount = float(amount)
    except ValueError:
        return jsonify({"error": "Amount must be a valid number."}), 400

    if amount <= 0:
        return jsonify({"error": "Amount must be greater than 0."}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    sender = cursor.execute("""
        SELECT accounts.id AS account_id, accounts.account_number, accounts.balance,
               users.id AS user_id, users.is_frozen
        FROM accounts
        JOIN users ON accounts.user_id = users.id
        WHERE users.id = ?
    """, (user_id,)).fetchone()

    if sender is None:
        connection.close()
        return jsonify({"error": "Sender account not found."}), 404

    if sender["is_frozen"]:
        connection.close()
        return jsonify({"error": "Account is frozen. Transfer not allowed."}), 403

    if sender["account_number"] == recipient_account_number:
        connection.close()
        return jsonify({"error": "You cannot transfer money to your own account."}), 400

    recipient = cursor.execute("""
        SELECT id, account_number, balance
        FROM accounts
        WHERE account_number = ?
    """, (recipient_account_number,)).fetchone()

    if recipient is None:
        connection.close()
        return jsonify({"error": "Recipient account not found."}), 404

    if sender["balance"] < amount:
        connection.close()
        return jsonify({"error": "Insufficient balance."}), 400

    new_sender_balance = sender["balance"] - amount
    new_recipient_balance = recipient["balance"] + amount
    created_at = datetime.now().isoformat()

    cursor.execute(
        "UPDATE accounts SET balance = ? WHERE id = ?",
        (new_sender_balance, sender["account_id"])
    )

    cursor.execute(
        "UPDATE accounts SET balance = ? WHERE id = ?",
        (new_recipient_balance, recipient["id"])
    )

    cursor.execute("""
        INSERT INTO transactions (account_id, type, amount, description, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (sender["account_id"], "Transfer", -amount, description, created_at))

    cursor.execute("""
        INSERT INTO transactions (account_id, type, amount, description, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (recipient["id"], "Transfer", amount, f"Received transfer: {description}", created_at))

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Transfer completed successfully.",
        "sender_new_balance": new_sender_balance,
        "recipient_new_balance": new_recipient_balance
    }), 200


@app.route("/api/admin/users", methods=["GET"])
def admin_get_users():
    admin_user_id = request.args.get("admin_user_id")

    if not admin_user_id or not is_admin(admin_user_id):
        return jsonify({"error": "Access denied."}), 403

    connection = get_db_connection()

    users = connection.execute("""
        SELECT users.id, users.name, users.email, users.role, users.is_frozen,
               accounts.account_number, accounts.balance
        FROM users
        LEFT JOIN accounts ON users.id = accounts.user_id
        ORDER BY users.id
    """).fetchall()

    connection.close()

    return jsonify({
        "users": [
            {
                **row_to_dict(user),
                "is_frozen": bool(user["is_frozen"])
            }
            for user in users
        ]
    }), 200


@app.route("/api/admin/freeze-user", methods=["POST"])
def freeze_user():
    data = request.get_json() or {}

    admin_user_id = data.get("admin_user_id")
    user_id = data.get("user_id")

    if not admin_user_id or not is_admin(admin_user_id):
        return jsonify({"error": "Access denied."}), 403

    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    user = cursor.execute(
        "SELECT id, role FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()

    if user is None:
        connection.close()
        return jsonify({"error": "User not found."}), 404

    if user["role"] == "admin":
        connection.close()
        return jsonify({"error": "Admin accounts cannot be frozen."}), 400

    cursor.execute(
        "UPDATE users SET is_frozen = 1 WHERE id = ?",
        (user_id,)
    )

    connection.commit()
    connection.close()

    return jsonify({"message": "User account frozen successfully."}), 200


@app.route("/api/admin/unfreeze-user", methods=["POST"])
def unfreeze_user():
    data = request.get_json() or {}

    admin_user_id = data.get("admin_user_id")
    user_id = data.get("user_id")

    if not admin_user_id or not is_admin(admin_user_id):
        return jsonify({"error": "Access denied."}), 403

    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    user = cursor.execute(
        "SELECT id FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()

    if user is None:
        connection.close()
        return jsonify({"error": "User not found."}), 404

    cursor.execute(
        "UPDATE users SET is_frozen = 0 WHERE id = ?",
        (user_id,)
    )

    connection.commit()
    connection.close()

    return jsonify({"message": "User account unfrozen successfully."}), 200


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5001)
