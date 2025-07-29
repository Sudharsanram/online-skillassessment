import React, { useState } from 'react';
import QuestionManager from '../Admin/QuestionManager';
import ResultViewer from '../Admin/ResultViewer';
import './AdminDashboard.css'; // custom CSS file

export default function AdminDashboard() {
    const [view, setView] = useState('questions');

    return (
        <div className="admin-dashboard-container">
            <h2 className="admin-dashboard-title">Admin Dashboard</h2>
            <div className="admin-nav-tabs">
                <button
                    onClick={() => setView('questions')}
                    className={`admin-tab-button ${view === 'questions' ? 'active' : ''}`}
                >
                    Manage Questions
                </button>
                <button
                    onClick={() => setView('results')}
                    className={`admin-tab-button ${view === 'results' ? 'active' : ''}`}
                >
                    View User Results
                </button>
            </div>
            <div className="admin-view-container">
                {view === 'questions' && <QuestionManager />}
                {view === 'results' && <ResultViewer />}
            </div>
        </div>
    );
}
