import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, appId } from '../firebase/config.js';
import Quiz from './Quiz';
import './SubjectView.css';

export default function SubjectView({ subject, user, onBack }) {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);

    useEffect(() => {
        const fetchAttempts = async () => {
            if (!user) return;
            setLoading(true);
            const q = query(collection(db, `artifacts/${appId}/users/${user.uid}/results`), where("subject", "==", subject));
            const querySnapshot = await getDocs(q);
            const userAttempts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            userAttempts.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
            setAttempts(userAttempts);
            setLoading(false);
        };
        fetchAttempts();
    }, [subject, user, showQuiz]);

    if (showQuiz) {
        return <Quiz subject={subject} user={user} onFinish={() => setShowQuiz(false)} />;
    }

    return (
        <div className="subject-container">
            <button onClick={onBack} className="back-button">&larr; Back to Subjects</button>
            <div className="subject-box">
                <div className="subject-main">
                    <h2 className="subject-title">{subject}</h2>
                    <div className="attempt-section">
                        <h3 className="attempt-heading">Previous Attempts</h3>
                        {loading ? <p>Loading attempts...</p> : (
                            attempts.length > 0 ? (
                                <ul className="attempt-list">
                                    {attempts.map(attempt => (
                                        <li key={attempt.id} className="attempt-item">
                                            <span className="attempt-time">{attempt.timestamp.toDate().toLocaleString()}</span>
                                            <span className={`attempt-score ${attempt.score >= 50 ? 'score-pass' : 'score-fail'}`}>
                                                Score: {Math.round(attempt.score)}%
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-attempt">No previous attempts found.</p>
                            )
                        )}
                    </div>
                </div>
                <div className="quiz-button-wrapper">
                    <button onClick={() => setShowQuiz(true)} className="quiz-button">
                        Attempt Quiz Now
                    </button>
                </div>
            </div>
        </div>
    );
}
