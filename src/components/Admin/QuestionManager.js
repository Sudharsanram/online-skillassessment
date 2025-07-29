import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, appId } from '../firebase/config';
import AddQuestionForm from './AddQuestionForm';
import './questionmanager.css'; // ✅ Import the CSS

const subjects = ['JavaScript', 'HTML', 'CSS', 'React'];

export default function QuestionManager() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, `artifacts/${appId}/public/data/questions`), where("subject", "==", selectedSubject));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedQuestions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuestions(fetchedQuestions);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [selectedSubject]);

    return (
        <div>
            <div className="toolbar">
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="dropdown">
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => setShowAddForm(true)} className="add-button">Add New Question</button>
            </div>

            {showAddForm && <AddQuestionForm subject={selectedSubject} onFinish={() => setShowAddForm(false)} />}

            <div className="question-container">
                <h3 className="question-title">Questions for {selectedSubject}</h3>
                {loading ? <p>Loading...</p> : (
                    <ul className="question-list">
                        {questions.map(q => (
                            <li key={q.id} className="question-item">
                                <p className="question-text">{q.question}</p>
                                <ul className="option-list">
                                    {q.options.map((opt, i) => (
                                        <li key={i} className={opt === q.correctAnswer ? 'correct-option' : ''}>
                                            {opt}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
