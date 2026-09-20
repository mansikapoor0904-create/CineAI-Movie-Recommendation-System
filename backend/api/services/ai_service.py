import openai
import google.generativeai as genai
from config import Config

class AIService:
    
    def __init__(self):
        openai.api_key = Config.OPENAI_API_KEY
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel('gemini-pro')
    
    def analyze_mood(self, user_text):
        """
        Analyze user mood from text input
        Returns: mood category and confidence
        """
        prompt = f"""
        Analyze the mood/emotion from this text and return ONE word:
        Text: "{user_text}"
        
        Choose from: happy, sad, excited, scared, romantic, 
        bored, angry, relaxed, adventurous, curious
        
        Return ONLY the mood word, nothing else.
        """
        
        try:
            response = self.gemini_model.generate_content(prompt)
            mood = response.text.strip().lower()
            
            valid_moods = [
                'happy', 'sad', 'excited', 'scared', 
                'romantic', 'bored', 'angry', 'relaxed',
                'adventurous', 'curious'
            ]
            
            return mood if mood in valid_moods else 'happy'
        except Exception as e:
            print(f"Mood analysis error: {e}")
            return 'happy'
    
    def get_movie_summary(self, movie_title, movie_overview):
        """
        Generate AI summary for a movie
        """
        prompt = f"""
        Create an engaging 3-sentence summary for the movie "{movie_title}".
        
        Original overview: {movie_overview}
        
        Make it exciting and spoiler-free. 
        Include the genre feel and target audience.
        Keep it under 150 words.
        """
        
        try:
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional movie critic and reviewer."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=200,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Summary error: {e}")
            return movie_overview
    
    def get_ai_recommendations(self, user_preferences, watch_history, mood=None):
        """
        Get AI-powered movie recommendations
        """
        prompt = f"""
        You are an expert movie recommendation AI.
        
        User Information:
        - Favorite Genres: {', '.join(user_preferences) if user_preferences else 'Not specified'}
        - Recently Watched: {', '.join(watch_history[:5]) if watch_history else 'Nothing yet'}
        - Current Mood: {mood if mood else 'Not specified'}
        
        Recommend 5 movies with reasons. Format as JSON:
        {{
            "recommendations": [
                {{
                    "title": "Movie Title",
                    "year": 2023,
                    "reason": "Why this movie matches",
                    "genre": "Genre",
                    "mood_match": "How it matches mood"
                }}
            ]
        }}
        """
        
        try:
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert movie recommendation system."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=500,
                temperature=0.8,
                response_format={"type": "json_object"}
            )
            
            import json
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Recommendation error: {e}")
            return {"recommendations": []}
    
    def chat_with_ai(self, user_message, chat_history):
        """
        Movie-focused chatbot conversation
        """
        system_prompt = """
        You are CineBot, an AI movie assistant. You help users:
        1. Find movies based on their mood or preferences
        2. Get movie recommendations
        3. Learn about upcoming movies
        4. Get movie summaries and reviews
        5. Find where to watch movies
        
        Always be helpful, friendly, and movie-focused.
        If asked about non-movie topics, gently redirect to movies.
        """
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add chat history
        for msg in chat_history[-5:]:  # Last 5 messages
            messages.append({
                "role": msg['role'],
                "content": msg['content']
            })
        
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        try:
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=messages,
                max_tokens=400,
                temperature=0.8
            )
            
            return {
                "success": True,
                "message": response.choices[0].message.content,
                "role": "assistant"
            }
        except Exception as e:
            print(f"Chatbot error: {e}")
            return {
                "success": False,
                "message": "Sorry, I'm having trouble. Please try again!",
                "role": "assistant"
            }
    
    def detect_sentiment_score(self, text):
        """
        Detect sentiment with score
        Returns detailed emotion analysis
        """
        prompt = f"""
        Analyze this text and return JSON with emotion scores:
        Text: "{text}"
        
        Return:
        {{
            "primary_mood": "main emotion",
            "emotions": {{
                "joy": 0.0 to 1.0,
                "sadness": 0.0 to 1.0,
                "anger": 0.0 to 1.0,
                "fear": 0.0 to 1.0,
                "surprise": 0.0 to 1.0,
                "disgust": 0.0 to 1.0
            }},
            "recommendation_tone": "what type of movies to recommend"
        }}
        """
        
        try:
            response = self.gemini_model.generate_content(prompt)
            import json
            return json.loads(response.text)
        except Exception as e:
            return {
                "primary_mood": "neutral",
                "emotions": {"joy": 0.5},
                "recommendation_tone": "general"
            }