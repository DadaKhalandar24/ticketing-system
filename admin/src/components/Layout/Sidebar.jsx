import React from 'react';

const Sidebar = ({ navigation, currentPath, onLogout, user, onViewChange, onClose }) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-gray-900 text-white shadow-xl">
      {/* Sidebar Header */}
      <div className="flex-shrink-0 px-6 py-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">👑</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-gray-400 text-sm">v2.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-2">
        {navigation.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <button
              key={item.name}
              onClick={() => {
                onViewChange(item.href);
                onClose();
              }}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 w-full text-left ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border-l-4 border-purple-400'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`mr-3 text-lg transition-transform duration-200 ${
                isActive ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {item.icon}
              </span>
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-400 mt-1">{item.description}</div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="flex-shrink-0 border-t border-gray-700/50 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize truncate">{user?.role}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200 group"
          >
            <span className="mr-2 group-hover:scale-110 transition-transform">🚪</span>
            Sign Out
          </button>
          
          <div className="text-center">
            <div className="text-xs text-gray-500 bg-black/20 rounded-lg px-3 py-1 inline-block">
              System: <span className="text-green-400 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;