import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, appId } from '../firebase/config';
import './quiz.css';

export default function Quiz({ subject, user, onFinish }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const q = query(collection(db, `artifacts/${appId}/public/data/questions`), where("subject", "==", subject));
            const querySnapshot = await getDocs(q);
            const fetchedQuestions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuestions(fetchedQuestions);
            setLoading(false);
        };
        fetchQuestions();
    }, [subject]);

    const handleAnswerSelect = (questionId, selectedOption) => {
        setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
    };

    const handleSubmit = async () => {
        let correctAnswers = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctAnswers++;
            }
        });
        const finalScore = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;
        setScore(finalScore);
        setShowResult(true);

        await addDoc(collection(db, `artifacts/${appId}/users/${user.uid}/results`), {
            subject,
            score: finalScore,
            timestamp: new Date(),
            answers,
        });
    };

    if (loading) return <p className="quiz-loading">Loading quiz...</p>;

    if (questions.length === 0) {
        return (
            <div className="quiz-empty">
                <p>No questions available for this subject yet.</p>
                <button onClick={onFinish} className="quiz-btn quiz-back-btn">Go Back</button>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="quiz-result">
                <h2>Quiz Completed!</h2>
                <p>Your score is: <span className={score >= 50 ? 'quiz-pass' : 'quiz-fail'}>{score.toFixed(2)}%</span></p>
                <button onClick={onFinish} className="quiz-btn">Back to Dashboard</button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <h2 className="quiz-title">{subject} Quiz</h2>
            <p className="quiz-subtitle">Question {currentQuestionIndex + 1} of {questions.length}</p>

            <div className="quiz-question-block">
                <h3>{currentQuestion.question}</h3>
                <div className="quiz-options">
                    {currentQuestion.options.map((option, index) => (
                        <label key={index} className={`quiz-option ${answers[currentQuestion.id] === option ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name={currentQuestion.id}
                                value={option}
                                checked={answers[currentQuestion.id] === option}
                                onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            <div className="quiz-nav">
                <button onClick={() => setCurrentQuestionIndex(prev => prev - 1)} disabled={currentQuestionIndex === 0} className="quiz-btn">
                    Previous
                </button>
                {currentQuestionIndex < questions.length - 1 ? (
                    <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="quiz-btn primary">Next</button>
                ) : (
                    <button onClick={handleSubmit} className="quiz-btn submit">Submit</button>
                )}
            </div>
        </div>
    );
}
