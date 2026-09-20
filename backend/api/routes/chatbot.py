from flask import Blueprint, request, jsonify
from services.ai_service import AIService


chatbot_bp = Blueprint("chatbot", __name__)

ai_service = AIService()


# =========================
# CHATBOT MESSAGE
# =========================
@chatbot_bp.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data provided"
        }), 400

    message = data.get("message")

    if not message:
        return jsonify({
            "success": False,
            "message": "Message is required"
        }), 400

    try:

        response = ai_service.chat(message)

        return jsonify({
            "success": True,
            "response": response
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500