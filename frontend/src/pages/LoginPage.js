import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/');
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const { data } = await axios.post('/api/users/login', { username, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎭</div>
                    <h1 className="font-serif text-4xl mb-2">Welcome Back</h1>
                    <p className="text-gray-300">Continue your storytelling journey</p>
                </div>
                
                {error && (
                    <div className="message error">
                        {error}
                    </div>
                )}
                
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>👤 Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>🔒 Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="loading"></span>
                                    <span className="ml-2">Signing In...</span>
                                </>
                            ) : (
                                '🚀 Login'
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="text-center mt-6">
                    <p className="text-gray-300">
                        New to Story Weave?{' '}
                        <Link 
                            to="/register" 
                            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;