
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import sqlite3
import fitz
import random
import os
import google.generativeai as genai
import re
from datetime import datetime
from werkzeug.utils import secure_filename
app = Flask(__name__)
STATIC_DIRECTORY = "static"
if not os.path.exists(STATIC_DIRECTORY):
    os.makedirs(STATIC_DIRECTORY)
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
app.config["JWT_SECRET_KEY"] = "supersecretkey"
jwt = JWTManager(app)
genai.configure(api_key='AIzaSyAXu4EJPl2-_G1K4x3KfLxQfLHdLspZdu4')
model = genai.GenerativeModel("gemini-1.5-flash")
@app.route("/chat", methods=["POST"])
def chatbot():
    data = request.json
    query = data.get("query")

    if not query:
        return jsonify({"response": "Please provide a question."})

    # Get response from Gemini AI
    response=model.generate_content("Answer the following question succinctly under 100 words: "+query)
    return jsonify({"response": response.text})
@app.route("/progress-comment", methods=["POST"])
def get_progress_comment():
    data = request.json  # Get progress data from frontend
    scores = data.get("progress", [])

    if not scores:
        return jsonify({"comment": "No progress data found."})

    # 🔹 Generate a prompt for Gemini
    prompt = f"""
    A student has taken multiple tests, and here are their scores:

    {', '.join([f'{test["testName"]}: {test["score"]}' for test in scores])}.

    Based on these scores, analyze their progress. Provide a friendly and motivational comment.
    """

    # 🔹 Call Gemini AI
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    ai_comment = response.text.strip()

    return jsonify({"comment": ai_comment})


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
@jwt_required() 
def create_test():
    data = request.json
    test_title = data.get("title")
    questions = data.get("questions")
    creator_email = get_jwt_identity()  

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
    total_score=0
    for question in questions:
        question_id = question["id"]
        correct_answer = question["correct_answer"]
        total_score+=1
        if user_answers.get(str(question_id)) == correct_answer:
            score += 1
    score=score*100/total_score
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

    
    cursor.execute("""
        SELECT tests.title, results.score 
        FROM results 
        JOIN tests ON results.test_id = tests.id 
        WHERE results.user_email = ?
    """, (user_email,))
    
    progress_data = cursor.fetchall()
    conn.close()

   
    progress_list = [{"test": row["title"], "score": row["score"]} for row in progress_data]

    return jsonify(progress_list), 200

@app.route("/upload_pdf", methods=["POST"])
@jwt_required()
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.endswith(".pdf"):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    extracted_text = extract_text_from_pdf(filepath)
    mcq_questions = parse_structured_mcqs(extracted_text)

    if not mcq_questions:
        return jsonify({"error": "No questions found in the PDF!"}), 400

    user_email = get_jwt_identity()
    test_id = save_test_to_db(user_email, filename[:-3], mcq_questions)

    return jsonify({"message": "Test created successfully", "test_id": test_id}), 201


def extract_text_from_pdf(filepath):
    """Extracts text from a structured PDF."""
    text = ""
    doc = fitz.open(filepath)

    for page in doc:
        text += page.get_text("text") + "\n"

    return text.strip()


def parse_structured_mcqs(text):
    """Parses structured MCQs from extracted text."""
    pattern = re.compile(
        r"Question:\s*(.*?)\nOptions:\s*a\)\s*(.*?)\n\s*b\)\s*(.*?)\n\s*c\)\s*(.*?)\n\s*d\)\s*(.*?)\nAnswer:\s*([a-d])",
        re.DOTALL | re.IGNORECASE
    )

    questions = []
    matches = pattern.findall(text)

    for match in matches:
        question, opt1, opt2, opt3, opt4, correct_option = match
        options = [opt1, opt2, opt3, opt4]
        correct_answer = options[ord(correct_option.lower()) - ord('a')]

        questions.append({
            "question": question.strip(),
            "options": options,
            "correctAnswer": correct_answer
        })

    return questions


def save_test_to_db(user_email, title, questions):
    """Saves the extracted MCQ test to the database."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO tests (creator_email, title) VALUES (?, ?)", (user_email, title))
    test_id = cursor.lastrowid

    for q in questions:
        cursor.execute("""
            INSERT INTO questions (test_id, question, option1, option2, option3, option4, correct_answer)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (test_id, q["question"], q["options"][0], q["options"][1], q["options"][2], q["options"][3], q["correctAnswer"]))

    conn.commit()
    conn.close()

    return test_id
@app.route("/comments", methods=["GET"])
def get_comments():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM comments ORDER BY timestamp DESC")
    comments = cursor.fetchall()
    conn.close()

    return jsonify([{"id": row["id"], "user": row["user"], "content": row["content"], "timestamp": row["timestamp"]} for row in comments])

def create_comments_table():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Call this function to ensure table exists when the server starts
create_comments_table()
@app.route("/comments", methods=["POST"])
@jwt_required()
def post_comment():
    data = request.json
    user_email = get_jwt_identity() 
    content = data.get("content", "").strip()

    if not content:
        return jsonify({"error": "Comment cannot be empty"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO comments (user, content, timestamp) VALUES (?, ?, ?)", 
                   (user_email, content, datetime.now()))
    conn.commit()
    conn.close()

    return jsonify({"message": "Comment posted successfully"}), 201

def get_leaderboard():
    conn = sqlite3.connect("mock_test.db")
    cursor = conn.cursor()

    # Aggregate total score per user and order by highest score
    cursor.execute("""
        SELECT user_email, SUM(score) AS total_score 
        FROM results 
        GROUP BY user_email 
        ORDER BY total_score DESC 
        LIMIT 10;
    """)
    
    leaderboard = cursor.fetchall()  # List of tuples (user_email, total_score)
    conn.close()

    # Convert to a list of dictionaries
    leaderboard_data = [{"email": user[0], "total_score": user[1]} for user in leaderboard]
    
    return leaderboard_data

@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    return jsonify(get_leaderboard())

if __name__ == "__main__":
    app.run(debug=True)
