import React, { useState } from 'react';
import SubjectView from '../Quiz/SubjectView';
import './UserDashboard.css'; // Import the custom CSS

const subjects = [
  { name: 'JavaScript', color: 'gradient-yellow' },
  { name: 'HTML', color: 'gradient-red' },
  { name: 'CSS', color: 'gradient-blue' },
  { name: 'React', color: 'gradient-cyan' },
];

export default function UserDashboard({ user }) {
  const [selectedSubject, setSelectedSubject] = useState(null);

  if (selectedSubject) {
    return (
      <SubjectView
        subject={selectedSubject}
        user={user}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Explore Subjects</h2>
      <p className="dashboard-subtext">Choose a subject to test your skills.</p>
      <div className="subject-grid">
        {subjects.map((subject) => (
          <div
            key={subject.name}
            className={`subject-card ${subject.color}`}
            onClick={() => setSelectedSubject(subject.name)}
          >
            <h3 className="subject-title">{subject.name}</h3>
            <p className="subject-action">Start Quiz →</p>
          </div>
        ))}
      </div>
    </div>
  );
}
