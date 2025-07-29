import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [stories, setStories] = useState([]);
    const [title, setTitle] = useState('');
    const [firstParagraph, setFirstParagraph] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [storiesLoading, setStoriesLoading] = useState(true);

    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const { data } = await axios.get('/api/stories');
                setStories(data);
            } catch (error) {
                console.error('Failed to fetch stories:', error);
            } finally {
                setStoriesLoading(false);
            }
        };
        fetchStories();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            navigate('/login');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post('/api/stories', { title, firstParagraph }, config);
            navigate(`/story/${data._id}`);
        } catch (err) {
            setError('Failed to create story. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="hero-section">
                <h1 className="pulse">✨ Weave Your Tale ✨</h1>
                <p>Craft collaborative stories, one enchanting paragraph at a time. Join a community of storytellers and watch narratives come alive through collective imagination.</p>
                
                <div className="mt-8 flex justify-center space-x-6">
                    <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                        <span className="text-sm font-semibold">🚀 Real-time Collaboration</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                        <span className="text-sm font-semibold">📚 Infinite Stories</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                        <span className="text-sm font-semibold">✍️ Creative Community</span>
                    </div>
                </div>
            </div>

            <div className="form-container float">
                <h2 className="font-serif text-3xl mb-6 text-center">🌟 Start a New Story</h2>
                {error && (
                    <div className="message error">
                        {error}
                    </div>
                )}
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="title">📖 Story Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a captivating title..."
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstParagraph">✨ The Opening Paragraph</label>
                        <textarea
                            id="firstParagraph"
                            rows="6"
                            value={firstParagraph}
                            onChange={(e) => setFirstParagraph(e.target.value)}
                            placeholder="Begin your story with an engaging opening that will captivate readers and inspire others to continue..."
                            required
                        ></textarea>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="loading"></span>
                                    <span className="ml-2">Creating Story...</span>
                                </>
                            ) : (
                                '🚀 Create Story'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-16">
                <h2 className="page-title text-center mb-12 fade-in">📚 Ongoing Stories</h2>
                
                {storiesLoading ? (
                    <div className="text-center py-12">
                        <div className="loading mx-auto mb-4"></div>
                        <p className="text-xl text-gray-300">Loading amazing stories...</p>
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📖</div>
                        <p className="text-xl text-gray-300">No stories yet. Be the first to create one!</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {stories.map((story, index) => (
                            <div key={story._id} className={`story-card fade-in`} style={{animationDelay: `${index * 100}ms`}}>
                                <Link to={`/story/${story._id}`} className="block">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="flex-1 hover:scale-105 transition-transform duration-300">
                                            {story.title}
                                        </h3>
                                        <div className="ml-4 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-300/20">
                                            <span className="text-sm font-semibold text-purple-200">
                                                {story.contributions?.length || 0} chapters
                                            </span>
                                        </div>
                                    </div>
                                    <div className="story-meta flex items-center justify-between">
                                        <span>✍️ Started by <strong className="text-blue-300">{story.author.username}</strong></span>
                                        <span className="text-gray-400">
                                            📅 {new Date(story.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="mt-4 p-3 bg-white/5 rounded-lg border-l-4 border-blue-400">
                                        <p className="text-sm text-gray-300 italic">Click to continue this story...</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;