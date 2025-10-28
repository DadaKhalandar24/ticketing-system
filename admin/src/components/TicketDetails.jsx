import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TicketDetails = () => {
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();
  const { user, API_BASE_URL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTicket();
    fetchUsers();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tickets`);
      const foundTicket = response.data.find(t => t._id === id);
      setTicket(foundTicket);
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (user?.role === 'admin') {
      try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        setUsers(response.data.filter(u => u.role === 'support_agent'));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/tickets/${id}`, {
        status: newStatus
      });
      fetchTicket();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleAssignChange = async (assignedTo) => {
    try {
      await axios.put(`${API_BASE_URL}/tickets/${id}`, {
        assignedTo: assignedTo || null
      });
      fetchTicket();
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/tickets/${id}/comments`, {
        text: comment
      });
      setComment('');
      fetchTicket();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
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
    return <div className="loading">Loading ticket...</div>;
  }

  if (!ticket) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Ticket not found</h2>
          <button onClick={() => navigate('/tickets')} className="btn btn-primary">
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Ticket Details</h1>
        <button onClick={() => navigate('/tickets')} className="btn btn-secondary">
          Back to Tickets
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: 'white' }}>{ticket.subject}</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {getPriorityBadge(ticket.priority)}
              {getStatusBadge(ticket.status)}
            </div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Description</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', background: '#f8f9fa', padding: '1rem', borderRadius: '6px' }}>
              {ticket.description}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Ticket Information</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <strong>Created by:</strong> {ticket.createdBy?.name}
                </div>
                <div>
                  <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Last updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem' }}>Ticket Controls</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label><strong>Status:</strong></label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="form-control"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {(user?.role === 'admin' || user?.role === 'support_agent') && (
                  <div>
                    <label><strong>Assign to:</strong></label>
                    <select
                      value={ticket.assignedTo?._id || ''}
                      onChange={(e) => handleAssignChange(e.target.value)}
                      className="form-control"
                    >
                      <option value="">Unassigned</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ margin: 0, color: 'white' }}>Comments ({ticket.comments.length})</h2>
        </div>
        <div className="card-body">
          {ticket.comments.map((comment, index) => (
            <div key={index} className="comment" style={{ marginBottom: '1.5rem' }}>
              <div className="comment-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong>{comment.userName}</strong>
                  <span className={`role-badge role-${comment.userRole}`}>
                    {comment.userRole.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <span style={{ color: '#6c757d' }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p style={{ margin: '0.5rem 0 0 0', lineHeight: '1.5' }}>
                {comment.text}
              </p>
            </div>
          ))}

          <form onSubmit={handleAddComment} style={{ marginTop: '2rem' }}>
            <div className="form-group">
              <label><strong>Add Comment</strong></label>
              <textarea
                className="form-control"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type your comment here..."
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Adding Comment...' : 'Add Comment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;