// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const Dashboard = () => {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user, logout, API_BASE_URL } = useAuth();

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   const fetchTickets = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/tickets`);
//       setTickets(response.data);
//     } catch (error) {
//       console.error('Error fetching tickets:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusClass = `status-badge status-${status.replace(' ', '_')}`;
//     const statusText = status.replace('_', ' ').toUpperCase();
//     return <span className={statusClass}>{statusText}</span>;
//   };

//   const getPriorityBadge = (priority) => {
//     const priorityClass = `priority-badge priority-${priority}`;
//     return <span className={priorityClass}>{priority.toUpperCase()}</span>;
//   };

//   if (loading) {
//     return <div className="container">Loading...</div>;
//   }

//   return (
//     <div>
//       <header className="header">
//         <div className="container">
//           <div className="header-content">
//             <div className="logo">Support Ticket System</div>
//             <div className="user-info">
//               <span>Welcome, {user.name}</span>
//               <button onClick={logout} className="btn btn-danger">Logout</button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="dashboard container">
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
//           <h1>My Tickets</h1>
//           <Link to="/new-ticket" className="btn btn-primary">
//             Create New Ticket
//           </Link>
//         </div>

//         <div className="ticket-list">
//           {tickets.map(ticket => (
//             <div key={ticket._id} className="ticket-card">
//               <div className="ticket-header">
//                 <Link to={`/ticket/${ticket._id}`} className="ticket-subject">
//                   {ticket.subject}
//                 </Link>
//                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
//                   {getPriorityBadge(ticket.priority)}
//                   {getStatusBadge(ticket.status)}
//                 </div>
//               </div>
              
//               <p style={{ marginBottom: '1rem', color: '#666' }}>
//                 {ticket.description}
//               </p>
              
//               <div className="ticket-meta">
//                 <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
//                 <span>Comments: {ticket.comments.length}</span>
//                 {ticket.assignedTo && (
//                   <span>Assigned to: {ticket.assignedTo.name}</span>
//                 )}
//               </div>
//             </div>
//           ))}
          
//           {tickets.length === 0 && (
//             <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
//               No tickets found. <Link to="/new-ticket">Create your first ticket</Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




                                     //running code 

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, API_BASE_URL } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tickets`);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
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

  // Calculate statistics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  // Get recent tickets (last 3)
  const recentTickets = tickets.slice(0, 3);

  if (loading) {
    return (
      <div className="loading">
        <div>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">SupportHub</div>
            <div className="user-info">
              <span>Welcome, {user.name}</span>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1 className="welcome-title">Welcome back, {user.name}!</h1>
          <p className="welcome-subtitle">Here's an overview of your support tickets.</p>
        </section>

        {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{totalTickets}</span>
            <span className="stat-label">Total Tickets</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{openTickets}</span>
            <span className="stat-label">Open</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{inProgressTickets}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{resolvedTickets}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="action-card">
            <h3>Create New Ticket</h3>
            <p>Submit a new support request for any issues you're facing.</p>
            <Link to="/new-ticket" className="btn btn-primary">
              📝 NEW TICKET
            </Link>
          </div>
          <div className="action-card">
            <h3>View All Tickets</h3>
            <p>Check the status and manage all your support tickets.</p>
            <Link to="/" className="btn btn-success">
              📋 VIEW TICKETS
            </Link>
          </div>
        </div>

        {/* Recent Tickets */}
        {recentTickets.length > 0 && (
          <section className="recent-tickets">
            <div className="section-header">
              <h2>Recent Tickets</h2>
              <Link to="/" className="btn btn-secondary">
                VIEW ALL
              </Link>
            </div>
            {recentTickets.map(ticket => (
              <div key={ticket._id} className="ticket-preview">
                <div className="ticket-subject">{ticket.subject}</div>
                <div className="ticket-description">{ticket.description}</div>
              </div>
            ))}
          </section>
        )}

        {/* View All Section */}
        <section className="view-all-section">
          <h2>Need More Help?</h2>
          <p>View all your tickets or create a new support request</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              📋 VIEW ALL TICKETS
            </Link>
            <Link to="/new-ticket" className="btn btn-success">
              📝 CREATE NEW TICKET
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>© 2024 SupportHub. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;






