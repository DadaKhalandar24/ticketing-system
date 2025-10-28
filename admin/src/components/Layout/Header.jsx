import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Header = ({ user, onLogout, children, currentView, onViewChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: '📊', description: 'System Overview' },
    { name: 'Ticket Management', href: 'tickets', icon: '🎫', description: 'Manage all tickets' },
    { name: 'User Management', href: 'users', icon: '👥', description: 'User accounts & roles' },
    { name: 'Analytics', href: 'analytics', icon: '📈', description: 'Reports & insights' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0`}>
        <Sidebar 
          navigation={navigation} 
          currentPath={currentView}
          onLogout={onLogout}
          user={user}
          onViewChange={onViewChange}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-gray-200/60 z-30">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Open sidebar"
            >
              <span className="text-xl">☰</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="font-semibold text-gray-900">Admin</span>
            </div>
            <div className="w-9"></div> {/* Spacer */}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Header;