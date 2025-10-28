import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TicketDetails = () => {
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();
  const { user, API_BASE_URL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTicket();
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/tickets/${id}/comments`, {
        text: comment
      });
      setComment('');
      fetchTicket(); // Refresh ticket data
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = `status-badge status-${status.replace(' ', '_')}`;
    const statusText = status.replace('_', ' ').toUpperCase();
    return <span className={statusClass}>{statusText}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityClass = `priority-badge priority-${priority}`;
    return <span className={priorityClass}>{priority.toUpperCase()}</span>;
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!ticket) {
    return <div className="container">Ticket not found</div>;
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">Support Ticket System</div>
            <button 
              onClick={() => navigate('/')} 
              className="btn"
              style={{ background: '#6c757d', color: 'white' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="ticket-card">
          <div className="ticket-header">
            <h1 className="ticket-subject">{ticket.subject}</h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {getPriorityBadge(ticket.priority)}
              {getStatusBadge(ticket.status)}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{ticket.description}</p>
          </div>

          <div className="ticket-meta">
            <span><strong>Created by:</strong> {ticket.createdBy.name}</span>
            <span><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</span>
            {ticket.assignedTo && (
              <span><strong>Assigned to:</strong> {ticket.assignedTo.name}</span>
            )}
          </div>
        </div>

        <div className="comments-section">
          <h2 style={{ marginBottom: '1rem' }}>Comments ({ticket.comments.length})</h2>
          
          {ticket.comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-header">
                <div>
                  <span className="comment-user">{comment.userName}</span>
                  <span className="comment-role" style={{ marginLeft: '0.5rem' }}>
                    {comment.userRole.replace('_', ' ')}
                  </span>
                </div>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p style={{ margin: 0 }}>{comment.text}</p>
            </div>
          ))}

          <form onSubmit={handleAddComment} style={{ marginTop: '2rem' }}>
            <div className="form-group">
              <label>Add Comment</label>
              <textarea
                className="form-control"
                rows="3"
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