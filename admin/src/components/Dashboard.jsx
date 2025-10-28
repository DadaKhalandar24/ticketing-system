import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    totalUsers: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, API_BASE_URL } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ticketsResponse, usersResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/tickets`),
        user?.role === 'admin' ? axios.get(`${API_BASE_URL}/users`) : Promise.resolve({ data: [] })
      ]);

      const tickets = ticketsResponse.data;
      
      const statsData = {
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => t.status === 'open').length,
        inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
        resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
        totalUsers: usersResponse.data.length
      };

      setStats(statsData);
      setRecentTickets(tickets.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = `status-badge status-${status}`;
    const statusText = status.replace('_', ' ').toUpperCase();
    return <span className={statusClass}>{statusText}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityClass = `priority-badge priority-${priority}`;
    return <span className={priorityClass}>{priority.toUpperCase()}</span>;
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard Overview</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/tickets" className="btn btn-primary">
            View All Tickets
          </Link>
          {user?.role === 'admin' && (
            <Link to="/users" className="btn btn-success">
              Manage Users
            </Link>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.totalTickets}</span>
          <span className="stat-label">Total Tickets</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.openTickets}</span>
          <span className="stat-label">Open Tickets</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.inProgressTickets}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.resolvedTickets}</span>
          <span className="stat-label">Resolved & Closed</span>
        </div>
        {user?.role === 'admin' && (
          <div className="stat-card">
            <span className="stat-number">{stats.totalUsers}</span>
            <span className="stat-label">Total Users</span>
          </div>
        )}
      </div>

      {/* Recent Tickets */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ margin: 0, color: 'white' }}>Recent Tickets</h2>
        </div>
        <div className="card-body">
          {recentTickets.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Created By</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map(ticket => (
                  <tr key={ticket._id}>
                    <td>
                      <strong>{ticket.subject}</strong>
                    </td>
                    <td>{ticket.createdBy?.name}</td>
                    <td>{getStatusBadge(ticket.status)}</td>
                    <td>{getPriorityBadge(ticket.priority)}</td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link 
                        to={`/ticket/${ticket._id}`} 
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
              No tickets found.
            </div>
          )}
          
          {recentTickets.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/tickets" className="btn btn-secondary">
                View All Tickets
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;