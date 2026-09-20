import requests
import json
import os
from datetime import datetime
from config import Config

class TMDBService:
    
    def __init__(self):
        self.api_key = Config.TMDB_API_KEY
        self.base_url = Config.TMDB_BASE_URL
        self.image_base = Config.TMDB_IMAGE_BASE
        self.cache_file = Config.CACHE_FILE
    
    def _make_request(self, endpoint, params=None):
        """Make API request to TMDB"""
        if params is None:
            params = {}
        
        params['api_key'] = self.api_key
        
        try:
            response = requests.get(
                f"{self.base_url}{endpoint}",
                params=params,
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"TMDB API Error: {e}")
            return None
    
    def get_trending_movies(self):
        """Get trending movies"""
        data = self._make_request("/trending/movie/week")
        if data:
            return self._format_movies(data.get('results', []))
        return []
    
    def get_upcoming_movies(self):
        """Get upcoming movies with details"""
        data = self._make_request(
            "/movie/upcoming",
            {"region": "US", "language": "en-US"}
        )
        
        if not data:
            return []
        
        movies = []
        for movie in data.get('results', [])[:20]:
            detailed = self.get_movie_details(movie['id'])
            if detailed:
                movies.append(detailed)
        
        return movies
    
    def get_movie_details(self, movie_id):
        """Get complete movie details"""
        # Basic details
        movie = self._make_request(
            f"/movie/{movie_id}",
            {"append_to_response": "credits,videos,watch/providers,similar"}
        )
        
        if not movie:
            return None
        
        # Get streaming platforms
        providers = movie.get('watch/providers', {})
        us_providers = providers.get('results', {}).get('US', {})
        
        streaming = []
        for p in us_providers.get('flatrate', []):
            streaming.append({
                "platform": p.get('provider_name'),
                "logo": f"https://image.tmdb.org/t/p/w45{p.get('logo_path')}",
                "provider_id": p.get('provider_id')
            })
        
        # Get trailer
        trailer_url = None
        for video in movie.get('videos', {}).get('results', []):
            if video['type'] == 'Trailer' and video['site'] == 'YouTube':
                trailer_url = f"https://youtube.com/watch?v={video['key']}"
                break
        
        # Format cast
        cast = []
        for person in movie.get('credits', {}).get('cast', [])[:5]:
            cast.append({
                "name": person['name'],
                "character": person['character'],
                "photo": f"{self.image_base}{person['profile_path']}" if person.get('profile_path') else None
            })
        
        return {
            "id": movie['id'],
            "title": movie['title'],
            "overview": movie.get('overview', ''),
            "release_date": movie.get('release_date', ''),
            "rating": movie.get('vote_average', 0),
            "genres": [g['name'] for g in movie.get('genres', [])],
            "poster": f"{self.image_base}{movie['poster_path']}" if movie.get('poster_path') else None,
            "backdrop": f"https://image.tmdb.org/t/p/original{movie['backdrop_path']}" if movie.get('backdrop_path') else None,
            "runtime": movie.get('runtime', 0),
            "language": movie.get('original_language', ''),
            "streaming_platforms": streaming,
            "trailer_url": trailer_url,
            "cast": cast,
            "similar_movies": self._format_movies(
                movie.get('similar', {}).get('results', [])[:6]
            ),
            "download_info": self._get_download_info(movie['title'])
        }
    
    def search_movies(self, query):
        """Search movies by title"""
        data = self._make_request(
            "/search/movie",
            {"query": query, "language": "en-US"}
        )
        
        if data:
            return self._format_movies(data.get('results', []))
        return []
    
    def get_movies_by_genre(self, genre_id):
        """Get movies by genre"""
        data = self._make_request(
            "/discover/movie",
            {
                "with_genres": genre_id,
                "sort_by": "popularity.desc",
                "language": "en-US"
            }
        )
        
        if data:
            return self._format_movies(data.get('results', []))
        return []
    
    def get_movies_by_mood(self, mood):
        """Get movies based on mood"""
        mood_genre_map = {
            "happy": [35, 10751],      # Comedy, Family
            "sad": [18, 10749],         # Drama, Romance
            "excited": [28, 12],        # Action, Adventure
            "scared": [27, 53],         # Horror, Thriller
            "romantic": [10749, 35],    # Romance, Comedy
            "bored": [878, 14],         # Sci-Fi, Fantasy
            "angry": [28, 80],          # Action, Crime
            "relaxed": [99, 10751],     # Documentary, Family
            "adventurous": [12, 14],    # Adventure, Fantasy
            "curious": [878, 99]        # Sci-Fi, Documentary
        }
        
        genre_ids = mood_genre_map.get(mood.lower(), [35])
        movies = []
        
        for genre_id in genre_ids:
            genre_movies = self.get_movies_by_genre(genre_id)
            movies.extend(genre_movies[:5])
        
        return movies[:10]
    
    def _format_movies(self, movies):
        """Format movie list"""
        formatted = []
        for movie in movies:
            if movie.get('poster_path'):
                formatted.append({
                    "id": movie.get('id'),
                    "title": movie.get('title', 'Unknown'),
                    "overview": movie.get('overview', ''),
                    "release_date": movie.get('release_date', ''),
                    "rating": round(movie.get('vote_average', 0), 1),
                    "poster": f"{self.image_base}{movie['poster_path']}",
                    "backdrop": f"https://image.tmdb.org/t/p/original{movie.get('backdrop_path', '')}" if movie.get('backdrop_path') else None,
                    "genres": movie.get('genre_ids', [])
                })
        return formatted
    
    def _get_download_info(self, title):
        """
        IMPORTANT: Provide legal download information only
        """
        return {
            "message": "Available for download on official platforms",
            "platforms": [
                {
                    "name": "Amazon Prime Video",
                    "url": f"https://www.amazon.com/s?k={title.replace(' ', '+')}",
                    "type": "Rent/Buy"
                },
                {
                    "name": "Apple TV",
                    "url": f"https://tv.apple.com/search?term={title.replace(' ', '+')}",
                    "type": "Rent/Buy"
                },
                {
                    "name": "Google Play Movies",
                    "url": f"https://play.google.com/store/search?q={title.replace(' ', '+')}&c=movies",
                    "type": "Rent/Buy"
                },
                {
                    "name": "Vudu",
                    "url": f"https://www.vudu.com/content/movies/search?searchString={title.replace(' ', '+')}",
                    "type": "Rent/Buy"
                }
            ]
        }
    
    def get_genres_list(self):
        """Get all movie genres"""
        data = self._make_request("/genre/movie/list")
        if data:
            return data.get('genres', [])
        return []