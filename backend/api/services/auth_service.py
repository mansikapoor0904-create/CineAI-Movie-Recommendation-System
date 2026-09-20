import json
import os
import bcrypt
from datetime import datetime, timedelta
from jose import jwt
from config import Config

class AuthService:
    
    def __init__(self):
        self.users_file = Config.USERS_FILE
        self._ensure_storage()
    
    def _ensure_storage(self):
        """Create storage files if not exist"""
        os.makedirs(Config.DATA_DIR, exist_ok=True)
        if not os.path.exists(self.users_file):
            with open(self.users_file, 'w') as f:
                json.dump({}, f)
    
    def _load_users(self):
        """Load users from JSON file"""
        try:
            with open(self.users_file, 'r') as f:
                return json.load(f)
        except:
            return {}
    
    def _save_users(self, users):
        """Save users to JSON file"""
        with open(self.users_file, 'w') as f:
            json.dump(users, f, indent=2)
    
    def register_user(self, email, password, name):
        """Register new user"""
        users = self._load_users()
        
        # Check if user exists
        if email in users:
            return {"success": False, "message": "User already exists"}
        
        # Hash password
        hashed = bcrypt.hashpw(
            password.encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Store user
        users[email] = {
            "name": name,
            "email": email,
            "password": hashed,
            "created_at": datetime.now().isoformat(),
            "preferences": [],
            "watch_history": [],
            "favorite_genres": []
        }
        
        self._save_users(users)
        
        # Generate token
        token = self._generate_token(email, name)
        
        return {
            "success": True,
            "token": token,
            "user": {"name": name, "email": email}
        }
    
    def login_user(self, email, password):
        """Login existing user"""
        users = self._load_users()
        
        if email not in users:
            return {"success": False, "message": "User not found"}
        
        user = users[email]
        
        # Verify password
        if not bcrypt.checkpw(
            password.encode('utf-8'),
            user['password'].encode('utf-8')
        ):
            return {"success": False, "message": "Invalid password"}
        
        token = self._generate_token(email, user['name'])
        
        return {
            "success": True,
            "token": token,
            "user": {
                "name": user['name'],
                "email": email,
                "preferences": user.get('preferences', [])
            }
        }
    
    def _generate_token(self, email, name):
        """Generate JWT token"""
        expire = datetime.utcnow() + timedelta(
            hours=Config.TOKEN_EXPIRE_HOURS
        )
        
        payload = {
            "email": email,
            "name": name,
            "exp": expire
        }
        
        return jwt.encode(
            payload,
            Config.SECRET_KEY,
            algorithm=Config.ALGORITHM
        )
    
    def verify_token(self, token):
        """Verify JWT token"""
        try:
            payload = jwt.decode(
                token,
                Config.SECRET_KEY,
                algorithms=[Config.ALGORITHM]
            )
            return {"valid": True, "payload": payload}
        except Exception as e:
            return {"valid": False, "error": str(e)}
    
    def update_preferences(self, email, preferences):
        """Update user preferences"""
        users = self._load_users()
        if email in users:
            users[email]['preferences'] = preferences
            self._save_users(users)
            return {"success": True}
        return {"success": False}