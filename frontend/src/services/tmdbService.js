const API_BASE = 'http://localhost:5000/api';

// Get auth token
const getToken = () => localStorage.getItem('movieai_token');

const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

export const movieService = {
    
    // Get trending movies
    getTrending: async () => {
        const res = await fetch(`${API_BASE}/movies/trending`);
        return res.json();
    },
    
    // Get upcoming movies
    getUpcoming: async () => {
        const res = await fetch(`${API_BASE}/movies/upcoming`);
        return res.json();
    },
    
    // Get movie details
    getMovieDetails: async (movieId) => {
        const res = await fetch(`${API_BASE}/movies/${movieId}`);
        return res.json();
    },
    
    // Search movies
    searchMovies: async (query) => {
        const res = await fetch(
            `${API_BASE}/movies/search?q=${encodeURIComponent(query)}`
        );
        return res.json();
    },
    
    // Analyze mood and get movies
    analyzeMood: async (text) => {
        const res = await fetch(`${API_BASE}/ai/mood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        return res.json();
    },
    
    // Get AI recommendations
    getRecommendations: async (preferences, watchHistory, mood) => {
        const res = await fetch(`${API_BASE}/ai/recommend`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ preferences, watch_history: watchHistory, mood })
        });
        return res.json();
    },
    
    // Send chatbot message
    sendChatMessage: async (message, history) => {
        const res = await fetch(`${API_BASE}/chatbot/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history })
        });
        return res.json();
    }
};

export const authService = {
    
    register: async (name, email, password) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return res.json();
    },
    
    login: async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },
    
    logout: () => {
        localStorage.removeItem('movieai_token');
        localStorage.removeItem('movieai_user');
    },
    
    isLoggedIn: () => !!localStorage.getItem('movieai_token'),
    
    getUser: () => {
        const user = localStorage.getItem('movieai_user');
        return user ? JSON.parse(user) : null;
    }
};