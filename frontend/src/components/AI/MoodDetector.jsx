import React, { useState } from 'react';
import { movieService } from '../../services/tmdbService';

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
    const [textInput, setTextInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('buttons'); // 'buttons' or 'text'

    const handleMoodSelect = async (mood) => {
        setSelectedMood(mood.value);
        setLoading(true);
        
        try {
            const result = await movieService.analyzeMood(
                `I am feeling ${mood.label}`
            );
            onMoodDetected(result);
        } catch (error) {
            console.error('Mood analysis error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTextAnalysis = async () => {
        if (!textInput.trim()) return;
        setLoading(true);
        
        try {
            const result = await movieService.analyzeMood(textInput);
            setSelectedMood(result.mood);
            onMoodDetected(result);
        } catch (error) {
            console.error('Text analysis error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid #333'
        }}>
            {/* Mode Toggle */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '25px'
            }}>
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
                        transition: 'all 0.3s'
                    }}
                >
                    ✍️ Tell AI Your Mood
                </button>
            </div>

            {mode === 'buttons' ? (
                /* Mood Buttons */
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '15px'
                }}>
                    {MOODS.map(mood => (
                        <button
                            key={mood.value}
                            onClick={() => handleMoodSelect(mood)}
                            disabled={loading}
                            style={{
                                padding: '15px 10px',
                                borderRadius: '15px',
                                border: selectedMood === mood.value 
                                    ? `2px solid ${mood.color}` 
                                    : '2px solid transparent',
                                background: selectedMood === mood.value
                                    ? `${mood.color}22`
                                    : '#2a2a2a',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                transform: selectedMood === mood.value ? 'scale(1.1)' : 'scale(1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>{mood.emoji}</span>
                            <span style={{ fontSize: '0.8rem' }}>{mood.label}</span>
                        </button>
                    ))}
                </div>
            ) : (
                /* Text Input Mode */
                <div>
                    <p style={{ color: '#aaa', marginBottom: '15px' }}>
                        Tell us how you feel and our AI will detect your mood:
                    </p>
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="e.g., 'I had a terrible day at work and just want to watch something to cheer me up...'"
                        style={{
                            width: '100%',
                            height: '120px',
                            background: '#2a2a2a',
                            border: '1px solid #444',
                            borderRadius: '15px',
                            color: 'white',
                            padding: '15px',
                            fontSize: '1rem',
                            outline: 'none',
                            resize: 'none',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button
                        onClick={handleTextAnalysis}
                        disabled={loading || !textInput.trim()}
                        style={{
                            marginTop: '15px',
                            padding: '12px 30px',
                            background: 'linear-gradient(135deg, #e50914, #b20710)',
                            border: 'none',
                            borderRadius: '25px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? '🔄 Analyzing...' : '🧠 Analyze My Mood'}
                    </button>
                </div>
            )}

            {loading && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    color: '#e50914',
                    animation: 'pulse 1s infinite'
                }}>
                    🤖 AI is analyzing your mood and finding perfect movies...
                </div>
            )}
        </div>
    );
};

export default MoodDetector;