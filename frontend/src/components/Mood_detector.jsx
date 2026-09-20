// src/components/MoodDetector.jsx
import React, { useState } from 'react';
import { getMoviesByMood } from '../services/movieService';

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 'happy', color: '#FFD700' },
  { emoji: '😢', label: 'Sad', value: 'sad', color: '#6699CC' },
  { emoji: '😆', label: 'Excited', value: 'excited', color: '#FF6B6B' },
  { emoji: '😱', label: 'Scared', value: 'scared', color: '#9B59B6' },
  { emoji: '💕', label: 'Romantic', value: 'romantic', color: '#FF69B4' },
  { emoji: '😴', label: 'Bored', value: 'bored', color: '#95A5A6' },
  { emoji: '😤', label: 'Angry', value: 'angry', color: '#E74C3C' },
  { emoji: '😌', label: 'Relaxed', value: 'relaxed', color: '#2ECC71' },
  { emoji: '🌟', label: 'Adventurous', value: 'adventurous', color: '#F39C12' },
  { emoji: '🧐', label: 'Curious', value: 'curious', color: '#1ABC9C' }
];

const MoodDetector = ({ onMoodDetected }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [textMood, setTextMood] = useState('');
  const [mode, setMode] = useState('buttons');

  const handleMoodClick = async (mood) => {
    setSelectedMood(mood.value);
    setLoading(true);
    
    const result = await getMoviesByMood(mood.value);
    onMoodDetected(mood.value, result.movies, result.genreNames);
    
    setLoading(false);
  };

  const handleTextMood = async () => {
    if (!textMood.trim()) return;
    setLoading(true);
    
    // Simple keyword detection
    const text = textMood.toLowerCase();
    let detectedMood = 'happy';
    
    if (text.includes('sad') || text.includes('depress') || text.includes('cry')) 
      detectedMood = 'sad';
    else if (text.includes('scar') || text.includes('horror') || text.includes('afraid')) 
      detectedMood = 'scared';
    else if (text.includes('excit') || text.includes('thrill') || text.includes('action')) 
      detectedMood = 'excited';
    else if (text.includes('love') || text.includes('roman') || text.includes('cute')) 
      detectedMood = 'romantic';
    else if (text.includes('bor') || text.includes('nothing') || text.includes('lazy')) 
      detectedMood = 'bored';
    else if (text.includes('angry') || text.includes('mad') || text.includes('furious')) 
      detectedMood = 'angry';
    else if (text.includes('relax') || text.includes('calm') || text.includes('peace')) 
      detectedMood = 'relaxed';
    else if (text.includes('advent') || text.includes('explore')) 
      detectedMood = 'adventurous';
    else if (text.includes('curious') || text.includes('sci') || text.includes('space')) 
      detectedMood = 'curious';
    else if (text.includes('happy') || text.includes('joy') || text.includes('great')) 
      detectedMood = 'happy';
    
    setSelectedMood(detectedMood);
    const result = await getMoviesByMood(detectedMood);
    onMoodDetected(detectedMood, result.movies, result.genreNames);
    
    setLoading(false);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      borderRadius: '20px',
      padding: '25px',
      border: '1px solid #2a2a4a'
    }}>
      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setMode('buttons')}
          style={{
            padding: '8px 20px',
            borderRadius: '20px',
            border: 'none',
            background: mode === 'buttons' 
              ? 'linear-gradient(135deg, #e50914, #b20710)' 
              : '#333',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.3s'
          }}
        >
          🎭 Select Mood
        </button>
        <button
          onClick={() => setMode('text')}
          style={{
            padding: '8px 20px',
            borderRadius: '20px',
            border: 'none',
            background: mode === 'text' 
              ? 'linear-gradient(135deg, #e50914, #b20710)' 
              : '#333',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.3s'
          }}
        >
          ✍️ Describe Mood
        </button>
      </div>

      {mode === 'buttons' ? (
        /* Mood Buttons */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '12px'
        }}>
          {MOODS.map(mood => (
            <button
              key={mood.value}
              onClick={() => handleMoodClick(mood)}
              disabled={loading}
              style={{
                padding: '15px 8px',
                borderRadius: '15px',
                border: `2px solid ${selectedMood === mood.value 
                  ? mood.color 
                  : 'transparent'}`,
                background: selectedMood === mood.value 
                  ? `${mood.color}22` 
                  : '#2a2a2a',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                transform: selectedMood === mood.value ? 'scale(1.1)' : 'scale(1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                opacity: loading ? 0.7 : 1
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{mood.emoji}</span>
              <span style={{ fontSize: '0.78rem' }}>{mood.label}</span>
            </button>
          ))}
        </div>
      ) : (
        /* Text Mode */
        <div>
          <p style={{ 
            color: '#888', 
            marginBottom: '12px',
            fontSize: '0.9rem'
          }}>
            Tell us how you feel and we'll find the perfect movies:
          </p>
          <textarea
            value={textMood}
            onChange={(e) => setTextMood(e.target.value)}
            placeholder="e.g., I'm feeling really excited and want something thrilling..."
            rows={3}
            style={{
              width: '100%',
              padding: '14px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '12px',
              color: 'white',
              fontSize: '0.95rem',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={handleTextMood}
            disabled={loading || !textMood.trim()}
            style={{
              marginTop: '12px',
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #e50914, #b20710)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              opacity: (!textMood.trim() || loading) ? 0.6 : 1
            }}
          >
            {loading ? '🔄 Finding movies...' : '🎯 Find My Movies'}
          </button>
        </div>
      )}

      {loading && (
        <p style={{ 
          textAlign: 'center',
          color: '#e50914',
          marginTop: '15px',
          fontSize: '0.9rem'
        }}>
          🤖 Finding perfect movies for your mood...
        </p>
      )}
    </div>
  );
};

export default MoodDetector;