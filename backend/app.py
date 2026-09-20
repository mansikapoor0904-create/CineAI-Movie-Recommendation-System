from flask import Flask, request, jsonify
from flask_cors import CORS
from api.services.auth_service import AuthService
from api.services.tmdb_service import TMDBService
from api.services.ai_service import AIService
from functools import wraps
import json

app = Flask(__name__)
CORS(app)

# Simple backend test route
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "success": True,
        "message": "CineAI backend is running"
    })

# Initialize services
auth_service = AuthService()
tmdb_service = TMDBService()
ai_service = AIService()

# ============================================
# AUTHENTICATION DECORATOR
# ============================================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({"error": "Token required"}), 401
        
        result = auth_service.verify_token(token)
        if not result['valid']:
            return jsonify({"error": "Invalid token"}), 401
        
        request.current_user = result['payload']
        return f(*args, **kwargs)
    return decorated

# ============================================
# AUTH ROUTES
# ============================================
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    result = auth_service.register_user(
        data.get('email'),
        data.get('password'),
        data.get('name')
    )
    return jsonify(result)

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    result = auth_service.login_user(
        data.get('email'),
        data.get('password')
    )
    return jsonify(result)

@app.route('/api/auth/verify', methods=['GET'])
@token_required
def verify_token():
    return jsonify({"valid": True, "user": request.current_user})

# ============================================
# MOVIE ROUTES
# ============================================
@app.route('/api/movies/trending', methods=['GET'])
def get_trending():
    movies = tmdb_service.get_trending_movies()
    return jsonify({"movies": movies})

@app.route('/api/movies/upcoming', methods=['GET'])
def get_upcoming():
    movies = tmdb_service.get_upcoming_movies()
    return jsonify({"movies": movies})

@app.route('/api/movies/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id):
    movie = tmdb_service.get_movie_details(movie_id)
    if not movie:
        return jsonify({"error": "Movie not found"}), 404
    
    # Add AI summary
    movie['ai_summary'] = ai_service.get_movie_summary(
        movie['title'],
        movie['overview']
    )
    
    return jsonify(movie)

@app.route('/api/movies/search', methods=['GET'])
def search_movies():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "Query required"}), 400
    
    movies = tmdb_service.search_movies(query)
    return jsonify({"movies": movies})

@app.route('/api/movies/genres', methods=['GET'])
def get_genres():
    genres = tmdb_service.get_genres_list()
    return jsonify({"genres": genres})

# ============================================
# AI ROUTES
# ============================================
@app.route('/api/ai/mood', methods=['POST'])
def analyze_mood():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "Text required"}), 400
    
    mood = ai_service.analyze_mood(text)
    movies = tmdb_service.get_movies_by_mood(mood)
    
    return jsonify({
        "mood": mood,
        "movies": movies,
        "message": f"Based on your mood '{mood}', here are perfect movies for you!"
    })

@app.route('/api/ai/sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.json
    text = data.get('text', '')
    
    sentiment = ai_service.detect_sentiment_score(text)
    mood = sentiment.get('primary_mood', 'happy')
    movies = tmdb_service.get_movies_by_mood(mood)
    
    return jsonify({
        "sentiment": sentiment,
        "recommended_movies": movies
    })

@app.route('/api/ai/recommend', methods=['POST'])
@token_required
def get_recommendations():
    data = request.json
    user_email = request.current_user['email']
    
    movies = ai_service.get_ai_recommendations(
        data.get('preferences', []),
        data.get('watch_history', []),
        data.get('mood')
    )
    
    return jsonify(movies)

# ============================================
# CHATBOT ROUTES
# ============================================
@app.route('/api/chatbot/message', methods=['POST'])
def chatbot_message():
    data = request.json
    user_message = data.get('message', '')
    chat_history = data.get('history', [])
    
    if not user_message:
        return jsonify({"error": "Message required"}), 400
    
    response = ai_service.chat_with_ai(user_message, chat_history)
    
    # Check if user asked about specific movie
    if any(word in user_message.lower() for word in ['recommend', 'suggest', 'find']):
        # Also search TMDB
        search_results = tmdb_service.search_movies(user_message)
        response['movie_suggestions'] = search_results[:3]
    
    return jsonify(response)

# ============================================
# USER PREFERENCES
# ============================================
@app.route('/api/user/preferences', methods=['POST'])
@token_required
def update_preferences():
    data = request.json
    email = request.current_user['email']
    
    result = auth_service.update_preferences(
        email,
        data.get('preferences', [])
    )
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)