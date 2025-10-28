import React from 'react';

const TicketList = ({ tickets, onTicketClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <div className="text-gray-500 text-lg mb-2">No tickets found</div>
        <div className="text-gray-400 text-sm">Create your first ticket to get started</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            <div 
              className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition duration-150"
              onClick={() => onTicketClick(ticket)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {ticket.subject}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-1">
                    {ticket.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <div className="text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketList;









