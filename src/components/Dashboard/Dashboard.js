import React from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import './dashboard.css';

export default function Dashboard({ isAdmin, user }) {
    if (isAdmin) {
        return <AdminDashboard />;
    }
    return <UserDashboard user={user} />;
}
