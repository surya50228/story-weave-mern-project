import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const { data } = await axios.post('/api/users/register', { username, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🌟</div>
                    <h1 className="font-serif text-4xl mb-2">Join the Story</h1>
                    <p className="text-gray-300">Become part of our creative community</p>
                </div>
                
                {error && (
                    <div className="message error">
                        {error}
                    </div>
                )}
                
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>👤 Choose Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Pick a creative username"
                            required
                            minLength={3}
                        />
                    </div>
                    <div className="form-group">
                        <label>🔒 Create Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="form-group">
                        <label>🔐 Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="loading"></span>
                                    <span className="ml-2">Creating Account...</span>
                                </>
                            ) : (
                                '✨ Join Story Weave'
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="text-center mt-6">
                    <p className="text-gray-300">
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;