import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUserInfo(storedUserInfo);
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        navigate('/login');
    };

    return (
        <nav className={`navbar transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
            <Link to="/" className="navbar-brand font-serif">
                ✨ Story Weave
            </Link>
            <div className="nav-links">
                {userInfo ? (
                    <>
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full border border-purple-300/20">
                                <span className="text-purple-200">
                                    👋 Hello, <strong className="text-white">{userInfo.username}</strong>
                                </span>
                            </div>
                            <button 
                                onClick={logoutHandler}
                                className="hover:scale-105 transition-transform duration-200"
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/login"
                            className="hover:scale-105 transition-transform duration-200"
                        >
                            🔑 Login
                        </Link>
                        <Link 
                            to="/register"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
                        >
                            ✨ Join Us
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;