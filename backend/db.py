import mysql.connector

DB_NAME = "todo_app"

def get_db_connection(db_required=True):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",         
        password="Sandy@123"
    )
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    cursor.close()
    conn.commit()
    conn.close()

    if db_required:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="Sandy@123",
            database=DB_NAME
        )
    return None


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS todos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT FALSE
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()
