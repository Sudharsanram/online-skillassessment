import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/config.js';
import './login.css'; // Use your CSS file

export default function RegisterPage({ setPage }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save username and email in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                username: username,
                createdAt: new Date()
            });

            // Optional: redirect to login
            setPage('login');
        } catch (err) {
            setError('Failed to register. ' + err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Create Account</h2>
                {error && <p className="login-error">{error}</p>}
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <input
                            className="login-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="login-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="login-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password (min. 6 characters)"
                            required
                        />
                    </div>
                    <button className="login-button" type="submit">Register</button>
                </form>
            </div>
            <p className="login-footer">
                Already have an account?{' '}
                <button onClick={() => setPage('login')} className="register-link">
                    Login here
                </button>
            </p>
        </div>
    );
}
