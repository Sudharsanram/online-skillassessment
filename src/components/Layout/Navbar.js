// components/Navbar.js
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Navbar({ user, onLogout }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || user.email);
        }
      }
    };
    fetchUsername();
  }, [user]);

  return (
    <nav className="navbar-container">
      <h1 className="navbar-title">Skill Assessment System</h1>
      {user && (
        <div className="navbar-user-info">
          <span className="navbar-user-email">Welcome, {username}</span>
          <button onClick={onLogout} className="navbar-logout-button">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
