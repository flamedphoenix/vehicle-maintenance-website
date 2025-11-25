from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_user():
    response = client.get("/api/v1/users/me")
    assert response.status_code == 200
    assert response.json()["name"] == "John Doe"
