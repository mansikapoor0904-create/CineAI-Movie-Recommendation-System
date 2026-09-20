from flask import Blueprint, request, jsonify
from services.tmdb_service import TMDBService


movies_bp = Blueprint("movies", __name__)

tmdb_service = TMDBService()


# =========================
# GET POPULAR MOVIES
# =========================
@movies_bp.route("/popular", methods=["GET"])
def popular_movies():

    try:
        movies = tmdb_service.get_popular_movies()

        return jsonify({
            "success": True,
            "movies": movies
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================
# SEARCH MOVIES
# =========================
@movies_bp.route("/search", methods=["GET"])
def search_movies():

    query = request.args.get("query")

    if not query:
        return jsonify({
            "success": False,
            "message": "Movie search query is required"
        }), 400

    try:

        movies = tmdb_service.search_movies(query)

        return jsonify({
            "success": True,
            "movies": movies
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================
# MOVIE DETAILS
# =========================
@movies_bp.route("/<int:movie_id>", methods=["GET"])
def movie_details(movie_id):

    try:

        movie = tmdb_service.get_movie_details(movie_id)

        return jsonify({
            "success": True,
            "movie": movie
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500