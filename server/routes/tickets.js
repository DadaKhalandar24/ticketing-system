import express from 'express';
import { body, validationResult } from 'express-validator';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all tickets (with filters based on role)
router.get('/', auth, async (req, res) => {
  try {
    let tickets;
    if (req.user.role === 'admin') {
      tickets = await Ticket.find()
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'support_agent') {
      tickets = await Ticket.find({
        $or: [
          { assignedTo: req.user._id },
          { status: 'open' }
        ]
      })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: req.user._id })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create ticket
router.post('/', [
  auth,
  body('subject').notEmpty(),
  body('description').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, description, priority } = req.body;

    const ticket = new Ticket({
      subject,
      description,
      priority,
      createdBy: req.user._id
    });

    await ticket.save();
    await ticket.populate('createdBy', 'name email');

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ticket
router.put('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check permissions
    if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, assignedTo } = req.body;

    // Only admin and support agents can reassign
    if (assignedTo && !['admin', 'support_agent'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions to reassign' });
    }

    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;

    await ticket.save();
    await ticket.populate('createdBy', 'name email');
    await ticket.populate('assignedTo', 'name email');

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comments', [
  auth,
  body('text').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check permissions
    if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comment = {
      user: req.user._id,
      text: req.body.text,
      userName: req.user.name,
      userRole: req.user.role
    };

    ticket.comments.push(comment);
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;