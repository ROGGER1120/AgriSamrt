import React from 'react';
import {
  LayoutDashboard,
  Coins,
  GitCompare,
  CloudSun,
  Bell,
  LogOut,
  X,
  Sprout,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const Sidebar = ({
  activeTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { logout, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();

  // Strictly the 5 required features
  const navItems = [
    {
      id: 'dashboard',
      label: 'Farmer Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'prices',
      label: 'Market Prices',
      icon: Coins,
      badge: isAdmin ? 'ADMIN' : null,
      badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      id: 'compare',
      label: 'Price Comparison',
      icon: GitCompare,
      badge: 'COMPARE',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      id: 'weather',
      label: 'Weather & Forecast',
      icon: CloudSun,
      badge: 'LIVE',
      badgeColor: 'bg-sky-50 text-sky-600 border-sky-200',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
      badgeColor: 'bg-rose-500 text-white font-bold',
    },
  ];

  const handleNavClick = (id) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white select-none">
      
      {/* Brand Header: FarmVista */}
      <div className="p-6 pb-5 flex items-center justify-between border-b border-slate-100/90">
        <div 
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-800">
              Farm<span className="text-emerald-600">Vista</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              AgriSmart Intelligence
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Navigation Items */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Platform Features
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all relative group cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {/* Active left indicator pill */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-600 rounded-r-full" />
              )}
              
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-600 stroke-[2.3]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Informative Mandi Status Card */}
        <div className="pt-5 mt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-100 text-slate-500 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-700 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                National e-Mandi
              </span>
              <span className="text-emerald-600 font-extrabold text-[10px] uppercase">
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Real-time APMC arrivals synchronized across Punjab, Maharashtra, Delhi, & Gujarat mandis.
            </p>
          </div>
        </div>
      </div>

      {/* Log Out at Bottom */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            logout();
            onSelectTab('login');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
          <span>Log Out</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 sticky top-0 h-screen border-r border-slate-100/90 bg-white z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-over with backdrop) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
