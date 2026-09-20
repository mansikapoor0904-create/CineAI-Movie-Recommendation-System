from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from datetime import datetime, timedelta


auth_bp = Blueprint("auth", __name__)


# =========================
# REGISTER
# =========================
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data provided"
        }), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Name, email and password are required"
        }), 400

    # Temporary response.
    # Database connection can be added later.
    return jsonify({
        "success": True,
        "message": "Registration successful",
        "user": {
            "name": name,
            "email": email
        }
    }), 201


# =========================
# LOGIN
# =========================
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data provided"
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    # Temporary demo authentication.
    # Replace with database verification later.
    token = jwt.encode(
        {
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=24)
        },
        os.getenv("SECRET_KEY", "edunexus-secret-key"),
        algorithm="HS256"
    )

    return jsonify({
        "success": True,
        "message": "Login successful",
        "token": token,
        "user": {
            "email": email
        }
    }), 200


# =========================
# LOGOUT
# =========================
@auth_bp.route("/logout", methods=["POST"])
def logout():

    return jsonify({
        "success": True,
        "message": "Logout successful"
    }), 200