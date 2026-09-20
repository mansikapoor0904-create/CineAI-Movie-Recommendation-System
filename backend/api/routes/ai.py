from flask import Blueprint, request, jsonify
from services.ai_service import AIService


ai_bp = Blueprint("ai", __name__)

ai_service = AIService()


# =========================
# AI MOVIE RECOMMENDATIONS
# =========================
@ai_bp.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data provided"
        }), 400

    mood = data.get("mood")
    preferences = data.get("preferences")

    if not mood and not preferences:
        return jsonify({
            "success": False,
            "message": "Mood or preferences are required"
        }), 400

    try:

        result = ai_service.generate_recommendations(
            mood=mood,
            preferences=preferences
        )

        return jsonify({
            "success": True,
            "recommendations": result
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================
# AI MOOD ANALYSIS
# =========================
@ai_bp.route("/mood", methods=["POST"])
def analyze_mood():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data provided"
        }), 400

    text = data.get("text")

    if not text:
        return jsonify({
            "success": False,
            "message": "Text is required"
        }), 400

    try:

        result = ai_service.analyze_mood(text)

        return jsonify({
            "success": True,
            "result": result
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500