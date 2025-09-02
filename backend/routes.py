from flask import Blueprint, request, jsonify
from db import get_db_connection, init_db

routes = Blueprint("routes", __name__)


init_db()


@routes.route("/")
def home():
    return jsonify({"message": "Hello, world!"})


@routes.route("/todos", methods=["GET"])
def get_todos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM todos")
    todos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(todos)


@routes.route("/add", methods=["POST"])
def add_todo():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("INSERT INTO todos (title, completed) VALUES (%s, %s)",
                   (data.get("title"), False))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM todos WHERE id=%s", (new_id,))
    new_todo = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(new_todo)


@routes.route("/update/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if "title" in data:
        cursor.execute("UPDATE todos SET title=%s WHERE id=%s", (data["title"], todo_id))
    if "completed" in data:
        cursor.execute("UPDATE todos SET completed=%s WHERE id=%s", (data["completed"], todo_id))

    conn.commit()
    cursor.execute("SELECT * FROM todos WHERE id=%s", (todo_id,))
    updated_todo = cursor.fetchone()
    cursor.close()
    conn.close()

    if updated_todo:
        return jsonify(updated_todo)
    return jsonify({"error": "Todo not found"}), 404


@routes.route("/delete/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM todos WHERE id=%s", (todo_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Todo deleted successfully"})
