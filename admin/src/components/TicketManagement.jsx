import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const { user, API_BASE_URL } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ticketsResponse, usersResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/tickets`),
        user?.role === 'admin' ? axios.get(`${API_BASE_URL}/users`) : Promise.resolve({ data: [] })
      ]);

      setTickets(ticketsResponse.data);
      setUsers(usersResponse.data.filter(u => u.role === 'support_agent'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/tickets/${ticketId}`, {
        status: newStatus
      });
      fetchData();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleAssignChange = async (ticketId, assignedTo) => {
    try {
      await axios.put(`${API_BASE_URL}/tickets/${ticketId}`, {
        assignedTo: assignedTo || null
      });
      fetchData();
    } catch (error) {
      console.error('Error assigning ticket:', error);
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

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Ticket Management</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            className="form-control" 
            style={{ width: 'auto' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ margin: 0, color: 'white' }}>
            {filter === 'all' ? 'All Tickets' : filter.replace('_', ' ').toUpperCase()} 
            ({filteredTickets.length})
          </h2>
        </div>
        <div className="card-body">
          {filteredTickets.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Created By</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(ticket => (
                  <tr key={ticket._id}>
                    <td>
                      <strong>
                        <Link to={`/ticket/${ticket._id}`} style={{ color: '#4361ee', textDecoration: 'none' }}>
                          {ticket.subject}
                        </Link>
                      </strong>
                    </td>
                    <td>{ticket.createdBy?.name}</td>
                    <td>
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                        className="form-control"
                        style={{ width: 'auto', minWidth: '120px' }}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td>{getPriorityBadge(ticket.priority)}</td>
                    <td>
                      <select
                        value={ticket.assignedTo?._id || ''}
                        onChange={(e) => handleAssignChange(ticket._id, e.target.value)}
                        className="form-control"
                        style={{ width: 'auto', minWidth: '150px' }}
                      >
                        <option value="">Unassigned</option>
                        {users.map(user => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/ticket/${ticket._id}`} 
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          View
                        </Link>
                      </div>
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
        </div>
      </div>
    </div>
  );
};

export default TicketManagement;