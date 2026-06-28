from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from datetime import datetime, timedelta
import sqlite3

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "securebank-dev-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

jwt = JWTManager(app)

DATABASE = "securebank.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def row_to_dict(row):
    if row is None:
        return None
    return dict(row)


def require_admin():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"message": "Admin access required."}), 403
    return None


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
        return jsonify({"message": "Email is required."}), 400

    if not password:
        return jsonify({"message": "Password is required."}), 400

    conn = get_db_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        (email, password),
    ).fetchone()
    conn.close()

    if not user:
        return jsonify({"message": "Invalid email or password."}), 401

    user_dict = row_to_dict(user)

    access_token = create_access_token(
        identity=str(user_dict["id"]),
        additional_claims={
            "role": user_dict["role"],
            "email": user_dict["email"],
        },
    )

    safe_user = {
        "id": user_dict["id"],
        "name": user_dict["name"],
        "email": user_dict["email"],
        "role": user_dict["role"],
        "status": user_dict["status"],
    }

    return jsonify({
        "user": safe_user,
        "access_token": access_token
    }), 200


@app.route("/api/accounts/<int:user_id>", methods=["GET"])
@jwt_required()
def get_account(user_id):
    current_user_id = int(get_jwt_identity())
    claims = get_jwt()

    if current_user_id != user_id and claims.get("role") != "admin":
        return jsonify({"message": "Unauthorized access."}), 403

    conn = get_db_connection()

    account = conn.execute(
        "SELECT * FROM accounts WHERE user_id = ?",
        (user_id,),
    ).fetchone()

    user = conn.execute(
        "SELECT id, name, email, role, status FROM users WHERE id = ?",
        (user_id,),
    ).fetchone()

    conn.close()

    if not account:
        return jsonify({"message": "Account not found."}), 404

    account_dict = row_to_dict(account)

    return jsonify({
        "account": account_dict,
        "user": row_to_dict(user),
        "id": account_dict.get("id"),
        "user_id": account_dict.get("user_id"),
        "account_number": account_dict.get("account_number"),
        "balance": account_dict.get("balance"),
    }), 200


@app.route("/api/transactions/<int:account_id>", methods=["GET"])
@jwt_required()
def get_transactions(account_id):
    current_user_id = int(get_jwt_identity())
    claims = get_jwt()

    conn = get_db_connection()

    account = conn.execute(
        "SELECT * FROM accounts WHERE id = ?",
        (account_id,),
    ).fetchone()

    if not account:
        conn.close()
        return jsonify({"message": "Account not found."}), 404

    account_dict = row_to_dict(account)

    if account_dict["user_id"] != current_user_id and claims.get("role") != "admin":
        conn.close()
        return jsonify({"message": "Unauthorized access."}), 403

    transactions = conn.execute(
        """
        SELECT *
        FROM transactions
        WHERE account_id = ?
        ORDER BY id DESC
        """,
        (account_id,),
    ).fetchall()

    conn.close()

    return jsonify({
        "transactions": [row_to_dict(transaction) for transaction in transactions]
    }), 200


@app.route("/api/transfer", methods=["POST"])
@jwt_required()
def transfer_money():
    current_user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    recipient_account_number = str(data.get("recipient_account_number", "")).strip()
    description = data.get("description", "Transfer").strip()

    try:
        amount = float(data.get("amount", 0))
    except (TypeError, ValueError):
        return jsonify({"message": "Amount must be greater than 0."}), 400

    if amount <= 0:
        return jsonify({"message": "Amount must be greater than 0."}), 400

    if not recipient_account_number:
        return jsonify({"message": "Recipient account not found."}), 404

    conn = get_db_connection()

    user = conn.execute(
        "SELECT * FROM users WHERE id = ?",
        (current_user_id,),
    ).fetchone()

    if not user:
        conn.close()
        return jsonify({"message": "User not found."}), 404

    user_dict = row_to_dict(user)

    if user_dict["status"] == "Frozen":
        conn.close()
        return jsonify({"message": "Account is frozen. Transfer not allowed."}), 403

    sender_account = conn.execute(
        "SELECT * FROM accounts WHERE user_id = ?",
        (current_user_id,),
    ).fetchone()

    recipient_account = conn.execute(
        "SELECT * FROM accounts WHERE account_number = ?",
        (recipient_account_number,),
    ).fetchone()

    if not sender_account:
        conn.close()
        return jsonify({"message": "Sender account not found."}), 404

    if not recipient_account:
        conn.close()
        return jsonify({"message": "Recipient account not found."}), 404

    sender = row_to_dict(sender_account)
    recipient = row_to_dict(recipient_account)

    if sender["id"] == recipient["id"]:
        conn.close()
        return jsonify({"message": "You cannot transfer money to your own account."}), 400

    if float(sender["balance"]) < amount:
        conn.close()
        return jsonify({"message": "Insufficient balance."}), 400

    new_sender_balance = float(sender["balance"]) - amount
    new_recipient_balance = float(recipient["balance"]) + amount

    today = datetime.now().strftime("%Y-%m-%d")

    conn.execute(
        "UPDATE accounts SET balance = ? WHERE id = ?",
        (new_sender_balance, sender["id"]),
    )

    conn.execute(
        "UPDATE accounts SET balance = ? WHERE id = ?",
        (new_recipient_balance, recipient["id"]),
    )

    conn.execute(
        """
        INSERT INTO transactions (account_id, type, amount, description, date)
        VALUES (?, ?, ?, ?, ?)
        """,
        (sender["id"], "Transfer", -amount, description or "Transfer sent", today),
    )

    conn.execute(
        """
        INSERT INTO transactions (account_id, type, amount, description, date)
        VALUES (?, ?, ?, ?, ?)
        """,
        (recipient["id"], "Transfer", amount, "Transfer received", today),
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Transfer completed successfully.",
        "current_balance": new_sender_balance,
    }), 200


@app.route("/api/admin/users", methods=["GET"])
@jwt_required()
def get_admin_users():
    admin_error = require_admin()
    if admin_error:
        return admin_error

    conn = get_db_connection()

    users = conn.execute(
        """
        SELECT 
            users.id,
            users.name,
            users.email,
            users.role,
            users.status,
            accounts.account_number,
            accounts.balance
        FROM users
        LEFT JOIN accounts ON users.id = accounts.user_id
        WHERE users.role != 'admin'
        ORDER BY users.id
        """
    ).fetchall()

    conn.close()

    return jsonify({
        "users": [row_to_dict(user) for user in users]
    }), 200


@app.route("/api/admin/freeze-user", methods=["POST"])
@jwt_required()
def freeze_user():
    admin_error = require_admin()
    if admin_error:
        return admin_error

    data = request.get_json() or {}
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"message": "User ID is required."}), 400

    conn = get_db_connection()

    conn.execute(
        "UPDATE users SET status = 'Frozen' WHERE id = ? AND role != 'admin'",
        (user_id,),
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "User account frozen successfully."}), 200


@app.route("/api/admin/unfreeze-user", methods=["POST"])
@jwt_required()
def unfreeze_user():
    admin_error = require_admin()
    if admin_error:
        return admin_error

    data = request.get_json() or {}
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"message": "User ID is required."}), 400

    conn = get_db_connection()

    conn.execute(
        "UPDATE users SET status = 'Active' WHERE id = ? AND role != 'admin'",
        (user_id,),
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "User account unfrozen successfully."}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5001)
