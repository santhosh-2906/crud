import requests

BASE_URL = "http://127.0.0.1:5001"

res = requests.get(f"{BASE_URL}/todos")
print("GET /todos:", res.json())


res = requests.post(f"{BASE_URL}/add", json={"title": "First Task"})
print("POST /add:", res.json())


res = requests.get(f"{BASE_URL}/todos")
print("GET /todos after adding:", res.json())


res = requests.put(f"{BASE_URL}/update/1", json={"completed": True})
print("PUT /update/1:", res.json())


res = requests.delete(f"{BASE_URL}/delete/1")
print("DELETE /delete/1:", res.json())
