import express from 'express';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get comprehensive analytics data
router.get('/', auth, authorize('admin', 'support_agent'), async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    
    // Calculate date range based on period
    const dateRange = getDateRange(period);
    const dateFilter = dateRange ? { createdAt: dateRange } : {};

    const [tickets, users, supportAgents] = await Promise.all([
      Ticket.find(dateFilter).populate('createdBy', 'name').populate('assignedTo', 'name'),
      User.find(),
      User.find({ role: 'support_agent' })
    ]);

    // Ticket statistics
    const totalTickets = tickets.length;
    const byStatus = {
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length
    };

    const byPriority = {
      high: tickets.filter(t => t.priority === 'high').length,
      medium: tickets.filter(t => t.priority === 'medium').length,
      low: tickets.filter(t => t.priority === 'low').length
    };

    // User statistics
    const totalUsers = users.length;
    const byRole = {
      admin: users.filter(u => u.role === 'admin').length,
      support_agent: users.filter(u => u.role === 'support_agent').length,
      user: users.filter(u => u.role === 'user').length
    };

    // Calculate active users (logged in last 30 days)
    const activeUsers = users.filter(u => 
      u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    // Performance metrics
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
    const resolutionRate = totalTickets > 0 ? (resolvedTickets.length / totalTickets) * 100 : 0;

    // Calculate average resolution time
    let totalResolutionTime = 0;
    let resolvedWithTime = 0;

    resolvedTickets.forEach(ticket => {
      if (ticket.createdAt && ticket.updatedAt) {
        const created = new Date(ticket.createdAt);
        const resolved = new Date(ticket.updatedAt);
        const resolutionTime = (resolved - created) / (1000 * 60 * 60 * 24); // in days
        totalResolutionTime += resolutionTime;
        resolvedWithTime++;
      }
    });

    const avgResolutionTime = resolvedWithTime > 0 ? totalResolutionTime / resolvedWithTime : 0;

    // Tickets by day for the selected period
    const ticketsByDay = await getTicketsByDay(period);

    // Support agent performance
    const agentPerformance = await getAgentPerformance(supportAgents, dateRange);

    const analytics = {
      tickets: {
        total: totalTickets,
        byStatus,
        byPriority,
        byDay: ticketsByDay,
        responseTime: calculateAverageResponseTime(tickets) // Mock for now
      },
      users: {
        total: totalUsers,
        byRole,
        activeUsers
      },
      performance: {
        resolutionRate: Math.round(resolutionRate),
        avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
        satisfaction: calculateSatisfactionRate(tickets) // Mock for now
      },
      agentPerformance
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error generating analytics' });
  }
});

// Get tickets over time for charts
router.get('/tickets-over-time', auth, authorize('admin', 'support_agent'), async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    const ticketsByDay = await getTicketsByDay(period);
    res.json(ticketsByDay);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets over time' });
  }
});

// Get agent performance metrics
router.get('/agent-performance', auth, authorize('admin', 'support_agent'), async (req, res) => {
  try {
    const supportAgents = await User.find({ role: 'support_agent' });
    const agentPerformance = await getAgentPerformance(supportAgents);
    res.json(agentPerformance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agent performance' });
  }
});

// Helper function to calculate date range
function getDateRange(period) {
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case '7days':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(now.getDate() - 90);
      break;
    default:
      return null; // All time
  }

  return {
    $gte: startDate,
    $lte: now
  };
}

// Helper function to get tickets by day
async function getTicketsByDay(period) {
  const dateRange = getDateRange(period);
  const tickets = await Ticket.find(dateRange || {});

  const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    const dayTickets = tickets.filter(ticket => {
      const ticketDate = ticket.createdAt.toISOString().split('T')[0];
      return ticketDate === dateString;
    });

    result.push({
      date: dateString,
      count: dayTickets.length,
      label: getDayLabel(i, days)
    });
  }

  return result;
}

// Helper function to get day labels
function getDayLabel(offset, totalDays) {
  if (totalDays === 7) {
    const days = ['Today', '1d', '2d', '3d', '4d', '5d', '6d'];
    return days[Math.min(offset, days.length - 1)];
  }
  
  const date = new Date();
  date.setDate(date.getDate() - (totalDays - 1 - offset));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Helper function to calculate agent performance
async function getAgentPerformance(agents, dateRange = {}) {
  const performance = [];

  for (const agent of agents) {
    const assignedTickets = await Ticket.find({
      assignedTo: agent._id,
      ...dateRange
    });

    const resolvedTickets = assignedTickets.filter(t => 
      t.status === 'resolved' || t.status === 'closed'
    );

    // Calculate resolution time for this agent
    let totalResolutionTime = 0;
    let resolvedWithTime = 0;

    resolvedTickets.forEach(ticket => {
      if (ticket.createdAt && ticket.updatedAt) {
        const created = new Date(ticket.createdAt);
        const resolved = new Date(ticket.updatedAt);
        const resolutionTime = (resolved - created) / (1000 * 60 * 60 * 24);
        totalResolutionTime += resolutionTime;
        resolvedWithTime++;
      }
    });

    const avgResolutionTime = resolvedWithTime > 0 ? totalResolutionTime / resolvedWithTime : 0;
    const resolutionRate = assignedTickets.length > 0 ? 
      (resolvedTickets.length / assignedTickets.length) * 100 : 0;

    performance.push({
      agentName: agent.name,
      agentEmail: agent.email,
      assignedTickets: assignedTickets.length,
      resolvedTickets: resolvedTickets.length,
      resolutionRate: Math.round(resolutionRate),
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      satisfaction: Math.floor(Math.random() * 10) + 85 // Mock satisfaction score
    });
  }

  return performance;
}

// Mock function for average response time (first comment time)
function calculateAverageResponseTime(tickets) {
  // This would ideally calculate time to first comment by support agent
  return 2.5; // Mock value in hours
}

// Mock function for satisfaction rate
function calculateSatisfactionRate(tickets) {
  // This would come from ticket ratings or feedback system
  return 92; // Mock value in percentage
}

export default router;