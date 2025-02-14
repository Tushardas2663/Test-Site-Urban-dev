import sqlite3

def initialize_db():
    conn = sqlite3.connect("mock_test.db")  # Connect to the database
    cursor = conn.cursor()

    # Create Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );
    """)

    # Create Tests Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creator_email TEXT NOT NULL,
        title TEXT NOT NULL,
        FOREIGN KEY (creator_email) REFERENCES users(email)
    );
    """)

    # Create Results Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        test_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        FOREIGN KEY (user_email) REFERENCES users(email),
        FOREIGN KEY (test_id) REFERENCES tests(id)
    );
    """)

    conn.commit()  # Save changes
    conn.close()   # Close connection
    print("Database initialized successfully!")

if __name__ == "__main__":
    initialize_db()
