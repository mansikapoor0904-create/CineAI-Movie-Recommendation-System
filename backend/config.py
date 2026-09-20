import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API Keys
    TMDB_API_KEY = os.getenv('TMDB_API_KEY')
    TMDB_BASE_URL = "https://api.themoviedb.org/3"
    TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"
    
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    OMDB_API_KEY = os.getenv('OMDB_API_KEY')
    
    # JWT Config
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    ALGORITHM = "HS256"
    TOKEN_EXPIRE_HOURS = 24
    
    # Storage
    DATA_DIR = "data"
    USERS_FILE = "data/users.json"
    CACHE_FILE = "data/movies_cache.json"
    
    # Streaming Platforms
    STREAMING_PLATFORMS = {
        8: "Netflix",
        9: "Amazon Prime",
        337: "Disney+",
        15: "Hulu",
        384: "HBO Max",
        386: "Peacock",
        387: "HBO",
        2: "Apple TV",
        531: "Paramount+"
    }