
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand font-serif">Story Weave</Link>
            <div className="nav-links">
                {userInfo ? (
                    <>
                        <span>Hello, {userInfo.username}</span>
                        <button onClick={logoutHandler}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};
export default Navbar;