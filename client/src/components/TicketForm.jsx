import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TicketForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { API_BASE_URL } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/tickets`, formData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">Support Ticket System</div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="form-container">
          <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Create New Ticket</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Ticket'}
              </button>
              <button 
                type="button" 
                className="btn"
                onClick={() => navigate('/')}
                style={{ background: '#6c757d', color: 'white' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;