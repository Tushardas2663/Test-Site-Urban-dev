
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import sqlite3

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
app.config["JWT_SECRET_KEY"] = "supersecretkey"
jwt = JWTManager(app)

def get_db():
    conn = sqlite3.connect("mock_test.db")
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data["email"]
    password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "User already exists"}), 400
    finally:
        conn.close()


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()  
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Missing email or password"}), 400 

    email = data["email"]
    password = data["password"]

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user["password"], password):
        token = create_access_token(identity=email)
        return jsonify({"token": token}), 200

    return jsonify({"error": "Invalid credentials"}), 401 



@app.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    try:
        email = get_jwt_identity()  # ✅ Ensure correct extraction of identity
        if not email:
            return jsonify({"error": "Unauthorized"}), 401  # 🔴 Handle missing identity

         # ✅ Ensure email is retrieved correctly

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) AS taken FROM results WHERE user_email = ?", (email,))
        tests_taken = cursor.fetchone()["taken"]

        cursor.execute("SELECT COUNT(*) AS created FROM tests WHERE creator_email = ?", (email,))
        tests_created = cursor.fetchone()["created"]

        conn.close()

        return jsonify({
            "email": email,
            "tests_taken": tests_taken,
            "tests_created": tests_created
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # 🔴 Handle any server error


if __name__ == "__main__":
    app.run(debug=True)
