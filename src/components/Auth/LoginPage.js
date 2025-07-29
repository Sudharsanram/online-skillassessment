import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config.js';
import './login.css';

export default function LoginPage({ setPage }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Load from localStorage if "Remember me" is on
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('rememberMe'));
        if (saved?.identifier && saved?.password) {
            setIdentifier(saved.identifier);
            setPassword(saved.password);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let emailToLogin = identifier;

            // If it's not an email, treat it as a username and resolve email
            if (!identifier.includes('@')) {
                const q = query(collection(db, "users"), where("username", "==", identifier));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) throw new Error("Username not found");

                const userData = querySnapshot.docs[0].data();
                emailToLogin = userData.email;
            }

            await signInWithEmailAndPassword(auth, emailToLogin, password);

            // Save to localStorage if checked
            if (rememberMe) {
                localStorage.setItem("rememberMe", JSON.stringify({ identifier, password }));
            } else {
                localStorage.removeItem("rememberMe");
            }
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Welcome</h2>
                {error && <p className="login-error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            className="login-input"
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Username or Email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="login-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <div className="input-group checkbox-group">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            id="rememberMe"
                        />
                        <label htmlFor="rememberMe" className="remember-label">Remember me</label>
                    </div>
                    <button className="login-button" type="submit">Login</button>
                </form>
            </div>
            <p className="login-footer">
                New user?{' '}
                <button onClick={() => setPage('register')} className="register-link">
                    Register here
                </button>
            </p>
        </div>
    );
}
