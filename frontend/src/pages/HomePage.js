import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [stories, setStories] = useState([]);
    const [title, setTitle] = useState('');
    const [firstParagraph, setFirstParagraph] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchStories = async () => {
            const { data } = await axios.get('/api/stories');
            setStories(data);
        };
        fetchStories();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            navigate('/login');
            return;
        }
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
        }
    };

    return (
        <div>
            <div className="form-container">
                <h2 className="font-serif text-2xl mb-4">Start a New Story</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstParagraph">The First Paragraph</label>
                        <textarea
                            id="firstParagraph"
                            rows="5"
                            value={firstParagraph}
                            onChange={(e) => setFirstParagraph(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn">Create Story</button>
                </form>
            </div>

            <div className="mt-12">
                <h2 className="font-serif text-3xl text-center mb-6">Ongoing Stories</h2>
                <div>
                    {stories.map((story) => (
                        <div key={story._id} className="story-card">
                            <Link to={`/story/${story._id}`}>
                                <h3 className="font-serif text-xl">{story.title}</h3>
                                <p className="story-meta">Started by {story.author.username} on {new Date(story.createdAt).toLocaleDateString()}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;