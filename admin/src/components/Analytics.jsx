import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    tickets: {
      total: 0,
      byStatus: {},
      byPriority: {},
      byDay: [],
      responseTime: 0
    },
    users: {
      total: 0,
      byRole: {},
      activeUsers: 0
    },
    performance: {
      resolutionRate: 0,
      avgResolutionTime: 0,
      satisfaction: 0
    },
    agentPerformance: []
  });
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { API_BASE_URL } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/analytics`, {
        params: { period: timeRange }
      });
      
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
      // Fallback to mock data if API fails
      setAnalytics(generateMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator for fallback
  const generateMockAnalytics = () => {
    const mockTicketsByDay = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 20) + 5,
      label: i === 6 ? 'Today' : i === 5 ? '1d' : `${6 - i}d`
    }));

    return {
      tickets: {
        total: 156,
        byStatus: {
          open: 23,
          in_progress: 15,
          resolved: 45,
          closed: 73
        },
        byPriority: {
          high: 28,
          medium: 89,
          low: 39
        },
        byDay: mockTicketsByDay,
        responseTime: 2.5
      },
      users: {
        total: 48,
        byRole: {
          admin: 2,
          support_agent: 5,
          user: 41
        },
        activeUsers: 32
      },
      performance: {
        resolutionRate: 76,
        avgResolutionTime: 3.2,
        satisfaction: 92
      },
      agentPerformance: [
        {
          agentName: 'John Smith',
          agentEmail: 'john@company.com',
          assignedTickets: 45,
          resolvedTickets: 38,
          resolutionRate: 84,
          avgResolutionTime: 2.1,
          satisfaction: 94
        },
        {
          agentName: 'Sarah Johnson',
          agentEmail: 'sarah@company.com',
          assignedTickets: 38,
          resolvedTickets: 32,
          resolutionRate: 84,
          avgResolutionTime: 2.3,
          satisfaction: 91
        },
        {
          agentName: 'Mike Chen',
          agentEmail: 'mike@company.com',
          assignedTickets: 52,
          resolvedTickets: 45,
          resolutionRate: 87,
          avgResolutionTime: 1.8,
          satisfaction: 96
        }
      ]
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#4cc9f0',
      in_progress: '#4361ee',
      resolved: '#4ade80',
      closed: '#f72585'
    };
    return colors[status] || '#6c757d';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#e63946',
      medium: '#f4a261',
      low: '#2a9d8f'
    };
    return colors[priority] || '#6c757d';
  };

  const exportAsPDF = () => {
    // Mock PDF export functionality
    alert('PDF export functionality would be implemented here');
  };

  const exportAsExcel = () => {
    // Mock Excel export functionality
    alert('Excel export functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading analytics data...</div>
        <div style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
          Generating comprehensive reports...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Analytics Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <select 
            className="form-control" 
            style={{ width: 'auto' }}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button 
            onClick={fetchAnalytics}
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '2rem' }}>
          {error} - Showing demo data
        </div>
      )}

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{analytics.tickets.total}</span>
          <span className="stat-label">Total Tickets</span>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6c757d' }}>
            {timeRange === '7days' ? 'This week' : timeRange === '30days' ? 'This month' : 'This quarter'}
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-number">{analytics.performance.resolutionRate}%</span>
          <span className="stat-label">Resolution Rate</span>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6c757d' }}>
            Industry avg: 70%
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-number">{analytics.performance.avgResolutionTime}d</span>
          <span className="stat-label">Avg. Resolution Time</span>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6c757d' }}>
            Target: {'<'} 5 days
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-number">{analytics.users.activeUsers}</span>
          <span className="stat-label">Active Users</span>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6c757d' }}>
            {Math.round((analytics.users.activeUsers / analytics.users.total) * 100)}% of total
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Ticket Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0, color: 'white' }}>Ticket Status Distribution</h3>
          </div>
          <div className="card-body">
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {Object.entries(analytics.tickets.byStatus).map(([status, count]) => (
                <div key={status} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                      {status.replace('_', ' ')}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{count}</span>
                      <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                        ({Math.round((count / analytics.tickets.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{
                        width: `${(count / analytics.tickets.total) * 100}%`,
                        height: '100%',
                        backgroundColor: getStatusColor(status),
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0, color: 'white' }}>Priority Distribution</h3>
          </div>
          <div className="card-body">
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {Object.entries(analytics.tickets.byPriority).map(([priority, count]) => (
                <div key={priority} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{priority}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{count}</span>
                      <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                        ({Math.round((count / analytics.tickets.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{
                        width: `${(count / analytics.tickets.total) * 100}%`,
                        height: '100%',
                        backgroundColor: getPriorityColor(priority),
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Support Agent Performance */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 style={{ margin: 0, color: 'white' }}>Support Agent Performance</h3>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Assigned Tickets</th>
                <th>Resolved</th>
                <th>Resolution Rate</th>
                <th>Avg. Time</th>
                <th>Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {analytics.agentPerformance.map((agent, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{agent.agentName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>{agent.agentEmail}</div>
                    </div>
                  </td>
                  <td>{agent.assignedTickets}</td>
                  <td>{agent.resolvedTickets}</td>
                  <td>
                    <span style={{ 
                      color: agent.resolutionRate >= 80 ? '#4ade80' : agent.resolutionRate >= 60 ? '#f4a261' : '#e63946',
                      fontWeight: 'bold'
                    }}>
                      {agent.resolutionRate}%
                    </span>
                  </td>
                  <td>{agent.avgResolutionTime}d</td>
                  <td>
                    <span style={{ 
                      color: agent.satisfaction >= 90 ? '#4ade80' : agent.satisfaction >= 80 ? '#f4a261' : '#e63946',
                      fontWeight: 'bold'
                    }}>
                      {agent.satisfaction}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          onClick={exportAsPDF} 
          className="btn btn-primary" 
          style={{ marginRight: '1rem' }}
        >
          📊 Export as PDF
        </button>
        <button 
          onClick={exportAsExcel} 
          className="btn btn-success"
        >
          📈 Export as Excel
        </button>
      </div>
    </div>
  );
};

export default Analytics;