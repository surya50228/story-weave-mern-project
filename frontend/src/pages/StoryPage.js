import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const StoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [newContribution, setNewContribution] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [recentContribution, setRecentContribution] = useState(null);
    const socketRef = useRef();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const { data } = await axios.get(`/api/stories/${id}`);
                setStory(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch story", error);
                setLoading(false);
            }
        };
        fetchStory();

        // Setup socket connection with enhanced features
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('joinStory', id);

        socketRef.current.on('contributionAdded', (addedContribution) => {
            setStory((prevStory) => ({
                ...prevStory,
                contributions: [...prevStory.contributions, addedContribution],
            }));
            setRecentContribution(addedContribution);
            setTimeout(() => setRecentContribution(null), 3000);
        });

        socketRef.current.on('userCount', (count) => {
            setOnlineUsers(count);
        });
        
        return () => {
            socketRef.current.disconnect();
        };
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            navigate('/login');
            return;
        }
        
        setSubmitting(true);
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data: createdContribution } = await axios.post(`/api/stories/${id}/contribute`, { text: newContribution }, config);
            
            socketRef.current.emit('newContribution', {
                storyId: id,
                contribution: createdContribution,
            });

            setNewContribution('');
        } catch (error) {
            console.error('Failed to add contribution', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="text-center mt-16">
                    <div className="loading mx-auto mb-4 w-12 h-12"></div>
                    <p className="text-2xl text-gray-300">Loading story...</p>
                </div>
            </div>
        );
    }
    
    if (!story) {
        return (
            <div className="container">
                <div className="text-center mt-16">
                    <div className="text-6xl mb-4">😕</div>
                    <p className="text-2xl text-gray-300">Story not found.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="btn mt-6"
                    >
                        🏠 Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="story-page-header">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h1 className="page-title">{story.title}</h1>
                        <p className="page-subtitle">
                            ✍️ A collaborative story started by <span className="font-semibold text-blue-300">{story.author.username}</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <div className="bg-green-500/20 px-4 py-2 rounded-full border border-green-400/30">
                            <span className="text-green-300 font-semibold">
                                🟢 {onlineUsers} readers online
                            </span>
                        </div>
                        <div className="bg-purple-500/20 px-4 py-2 rounded-full border border-purple-400/30">
                            <span className="text-purple-300 font-semibold">
                                📚 {story.contributions.length} chapters
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {recentContribution && (
                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 mb-6 animate-pulse">
                    <p className="text-green-300 font-semibold">
                        ✨ New contribution added by {recentContribution.author.username}!
                    </p>
                </div>
            )}

            <div className="story-content">
                {story.contributions.map((contrib, index) => (
                    <div 
                        key={contrib._id} 
                        className="contribution-item" 
                        style={{animationDelay: `${index * 100}ms`}}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="contribution-text">{contrib.text}</p>
                                <div className="contribution-author">
                                    <strong>{contrib.author.username}</strong> • {new Date(contrib.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {userInfo ? (
                <div className="add-contribution-form form-container">
                    <h3 className="font-serif text-3xl mb-6 text-center">
                        ✨ Continue the Story
                    </h3>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label htmlFor="contribution">What happens next?</label>
                            <textarea
                                id="contribution"
                                rows="8"
                                value={newContribution}
                                onChange={(e) => setNewContribution(e.target.value)}
                                placeholder="Add your chapter to this collaborative story. Let your imagination flow and see where the narrative takes you..."
                                required
                            ></textarea>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <span className="loading"></span>
                                        <span className="ml-2">Adding Chapter...</span>
                                    </>
                                ) : (
                                    '📝 Add to Story'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="text-center mt-12">
                    <div className="glass-card p-8 max-w-md mx-auto">
                        <div className="text-4xl mb-4">🔐</div>
                        <p className="text-xl mb-6 text-gray-300">
                            Join the story! Login to add your chapter.
                        </p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="btn"
                        >
                            🚀 Login to Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryPage;