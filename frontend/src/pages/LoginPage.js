import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/');
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/login', { username, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
            window.location.reload(); // To refresh navbar state
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="form-container">
            <h1 className="font-serif text-2xl mb-6">Login</h1>
            {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;