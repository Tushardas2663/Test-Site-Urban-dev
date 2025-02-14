
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import sqlite3

app = Flask(__name__)

CORS(app, supports_credentials=True)
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
        email = get_jwt_identity() 
        if not email:
            return jsonify({"error": "Unauthorized"}), 401  

         

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
        return jsonify({"error": str(e)}), 500  
@app.route("/create-test", methods=["POST"])
@jwt_required()  # Ensure the user is logged in
def create_test():
    data = request.json
    test_title = data.get("title")
    questions = data.get("questions")
    creator_email = get_jwt_identity()  # Get the logged-in user's email

    if not test_title or not questions:
        return jsonify({"error": "Missing test title or questions"}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Insert test into 'tests' table
    cursor.execute("INSERT INTO tests (creator_email, title) VALUES (?, ?)", (creator_email, test_title))
    test_id = cursor.lastrowid  # Get the ID of the newly created test

    # Insert questions into a new 'questions' table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            test_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            option1 TEXT,
            option2 TEXT,
            option3 TEXT,
            option4 TEXT,
            correct_answer TEXT,
            FOREIGN KEY (test_id) REFERENCES tests(id)
        );
    """)

    for q in questions:
        cursor.execute("""
            INSERT INTO questions (test_id, question, option1, option2, option3, option4, correct_answer)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (test_id, q["question"], q["options"][0], q["options"][1], q["options"][2], q["options"][3], q["correctAnswer"]))

    conn.commit()
    conn.close()

    return jsonify({"message": "Test created successfully!"}), 201
@app.route("/tests", methods=["GET"])
@jwt_required()
def get_tests():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title FROM tests")
    tests = cursor.fetchall()
    conn.close()

    return jsonify([{"id": test["id"], "title": test["title"]} for test in tests]), 200

# Fetch questions for a selected test
@app.route("/test/<int:test_id>", methods=["GET"])
@jwt_required()
def get_test_questions(test_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM questions WHERE test_id = ?", (test_id,))
    questions = cursor.fetchall()
    conn.close()

    if not questions:
        return jsonify({"error": "Test not found"}), 404

    return jsonify([
        {
            "id": q["id"],
            "question": q["question"],
            "options": [q["option1"], q["option2"], q["option3"], q["option4"]],
        } for q in questions
    ]), 200

# Submit answers and store results
@app.route("/submit-test", methods=["POST"])
@jwt_required()
def submit_test():
    data = request.json
    user_email = get_jwt_identity()
    test_id = data.get("test_id")
    user_answers = data.get("answers", {})

    conn = get_db()
    cursor = conn.cursor()

    # Fetch correct answers
    cursor.execute("SELECT id, correct_answer FROM questions WHERE test_id = ?", (test_id,))
    questions = cursor.fetchall()

    # Calculate score
    score = 0
    for question in questions:
        question_id = question["id"]
        correct_answer = question["correct_answer"]
        if user_answers.get(str(question_id)) == correct_answer:
            score += 1

    # Store result
    cursor.execute("INSERT INTO results (user_email, test_id, score) VALUES (?, ?, ?)", 
                   (user_email, test_id, score))
    conn.commit()
    conn.close()

    return jsonify({"message": "Test submitted successfully!", "score": score}), 200

    @app.route("/progress", methods=["GET"])
@jwt_required()
def show_progress():
    user_email = get_jwt_identity()

    conn = get_db()
    cursor = conn.cursor()

    # Fetch test attempts and scores
    cursor.execute("""
        SELECT tests.title, results.score 
        FROM results 
        JOIN tests ON results.test_id = tests.id 
        WHERE results.user_email = ?
    """, (user_email,))
    
    progress_data = cursor.fetchall()
    conn.close()

    # Format response
    progress_list = [{"test": row["title"], "score": row["score"]} for row in progress_data]

    return jsonify(progress_list), 200



if __name__ == "__main__":
    app.run(debug=True)
