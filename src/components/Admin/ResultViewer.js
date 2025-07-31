import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
// ✅ FIX: ADMIN_EMAIL has been removed from this import statement
import { db, appId } from '../firebase/config';
import './resultviewer.css';

export default function ResultViewer() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const usersCol = collection(db, "users");
            const userSnapshot = await getDocs(usersCol);
            const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            setUsers(userList);
            
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const handleUserSelect = async (userId) => {
        if (!userId) {
            setSelectedUser(null);
            setResults([]);
            return;
        }
        const userDoc = users.find(u => u.id === userId);
        setSelectedUser(userDoc);
        const resultsCol = collection(db, `artifacts/${appId}/users/${userId}/results`);
        const resultsSnapshot = await getDocs(resultsCol);
        const userResults = resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        userResults.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
        setResults(userResults);
    };

    return (
        <div>
            <select onChange={e => handleUserSelect(e.target.value)} className="user-select">
                <option value="">Select a user to view results</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
            </select>

            {loading && <p>Loading users...</p>}

            {selectedUser && (
                <div className="result-container">
                    <h3 className="result-title">Results for {selectedUser.email}</h3>
                    {results.length > 0 ? (
                        <ul className="result-list">
                            {results.map(res => (
                                <li key={res.id} className="result-item">
                                    <p><strong>Subject:</strong> {res.subject}</p>
                                    <p>
                                        <strong>Score:</strong>
                                        <span className={res.score >= 50 ? 'score-pass' : 'score-fail'}>
                                            {res.score.toFixed(2)}%
                                        </span>
                                    </p>
                                    <p><strong>Date:</strong> {res.timestamp.toDate().toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No results found for this user.</p>
                    )}
                </div>
            )}
        </div>
    );
}