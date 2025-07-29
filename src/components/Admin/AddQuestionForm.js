import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, appId } from '../firebase/config';
import './addquestion.css';

export default function AddQuestionForm({ subject, onFinish }) {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [error, setError] = useState('');

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!question || options.some(o => !o) || !correctAnswer) {
            setError('Please fill all fields and select a correct answer.');
            return;
        }
        if (!options.includes(correctAnswer)) {
            setError('Correct answer must be one of the options.');
            return;
        }

        try {
            await addDoc(collection(db, `artifacts/${appId}/public/data/questions`), {
                subject,
                question,
                options,
                correctAnswer,
            });
            onFinish();
        } catch (err) {
            setError('Failed to add question. ' + err.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Add New Question for {subject}</h3>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Question</label>
                        <input type="text" value={question} onChange={e => setQuestion(e.target.value)} className="form-input" />
                    </div>
                    {options.map((opt, i) => (
                        <div key={i} className="form-group">
                            <label className="form-label">Option {i + 1}</label>
                            <input type="text" value={opt} onChange={e => handleOptionChange(i, e.target.value)} className="form-input" />
                        </div>
                    ))}
                    <div className="form-group">
                        <label className="form-label">Correct Answer</label>
                        <select value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className="form-input">
                            <option value="">Select correct answer</option>
                            {options.filter(o => o).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="form-buttons">
                        <button type="button" onClick={onFinish} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-save">Save Question</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
