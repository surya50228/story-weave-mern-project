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

        // Setup socket connection
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('joinStory', id);

        socketRef.current.on('contributionAdded', (addedContribution) => {
            setStory((prevStory) => ({
                ...prevStory,
                contributions: [...prevStory.contributions, addedContribution],
            }));
        });
        
        // Disconnect on component unmount
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
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data: createdContribution } = await axios.post(`/api/stories/${id}/contribute`, { text: newContribution }, config);
            
            // Emit the new contribution to the server
            socketRef.current.emit('newContribution', {
                storyId: id,
                contribution: createdContribution,
            });

            setNewContribution('');
        } catch (error) {
            console.error('Failed to add contribution', error);
        }
    };

    if (loading) return <p>Loading story...</p>;
    if (!story) return <p>Story not found.</p>;

    return (
        <div>
            <h1 className="font-serif text-4xl text-center mt-8">{story.title}</h1>
            <p className="text-center text-gray-500 mb-8">A story started by {story.author.username}</p>

            <div className="story-content">
                {story.contributions.map((contrib) => (
                    <div key={contrib._id} className="contribution-item">
                        <p className="contribution-text">{contrib.text}</p>
                        <p className="contribution-author">- <strong>{contrib.author.username}</strong> on {new Date(contrib.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>

            {userInfo && (
                <div className="add-contribution-form form-container">
                    <h3 className="font-serif text-2xl mb-4">Add the Next Paragraph</h3>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <textarea
                                rows="6"
                                value={newContribution}
                                onChange={(e) => setNewContribution(e.target.value)}
                                placeholder="What happens next?"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn">Add to Story</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StoryPage;