import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Sliders,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const Navbar = ({
  onOpenNotifications,
  onNavigate,
  onOpenMobileSidebar,
  onGlobalSearch,
  searchQuery = '',
  setSearchQuery,
}) => {
  const { user, logout, switchDemoRole, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onGlobalSearch && searchQuery.trim()) {
      onGlobalSearch(searchQuery.trim());
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-100/90 px-4 sm:px-6 lg:px-8 py-3 select-none">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left: Mobile Hamburger & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search something here....."
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 shadow-xs transition-all"
              />
            </div>
          </form>
        </div>

        {/* Right: Notification Bell & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Notification Bell with green alert dot */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-full bg-white border border-slate-200/80 hover:border-emerald-500/40 hover:bg-slate-50 transition-all text-slate-600 shadow-xs cursor-pointer"
            title="Notifications & Alerts"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            {unreadCount > 0 ? (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
            ) : (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-3 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-emerald-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Albert Flores"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initial if image fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="hidden">AF</span>
              </div>

              {/* Name & Email (desktop only) */}
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.name || 'Albert Flores'}
                </div>
                <div className="text-[11px] text-slate-400 font-medium leading-tight">
                  {user?.email || 'albert45@mail.com'}
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-100 p-2 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="p-3 border-b border-slate-100">
                  <p className="font-bold text-slate-800">{user?.name || 'Albert Flores'}</p>
                  <p className="text-slate-400 text-[11px] truncate">{user?.email || 'albert45@mail.com'}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {isAdmin ? 'Mandi Admin' : 'Farm Manager'}
                    </span>
                    <span className="text-[10px] text-slate-400">Live Sync</span>
                  </div>
                </div>

                {/* Role Switcher for demo */}
                <div className="p-2 border-b border-slate-100 bg-slate-50/70 rounded-xl my-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                    Demo Mode Switch
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        switchDemoRole('farmer');
                      }}
                      className={`px-2 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 transition ${
                        !isAdmin ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Farmer {!isAdmin && <Check className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        switchDemoRole('admin');
                      }}
                      className={`px-2 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 transition ${
                        isAdmin ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Admin {isAdmin && <Check className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => onNavigate('account')}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-600" /> My Account
                  </button>
                  <button
                    onClick={() => onNavigate('settings')}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                  >
                    <Sliders className="w-4 h-4 text-slate-400" /> Settings
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      logout();
                      onNavigate('login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
