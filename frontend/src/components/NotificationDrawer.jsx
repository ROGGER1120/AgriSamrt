import React, { useState } from 'react';
import {
  X,
  Bell,
  CloudRain,
  TrendingUp,
  Award,
  CheckCheck,
  Check,
  Megaphone,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const NotificationDrawer = ({ isOpen, onClose, onNavigate }) => {
  const { notifications, unreadCount, markRead, markAllRead, isItemRead } = useNotifications();
  const [filterType, setFilterType] = useState('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'weather_alert':
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <CloudRain className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case 'price_update':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case 'announcement':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white border-l border-slate-100 shadow-2xl h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base leading-tight">
                Alerts & Notifications
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {unreadCount > 0 ? `${unreadCount} unread notices` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                unreadCount > 0
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <CheckCheck className="w-4 h-4" />
              <span>{unreadCount > 0 ? 'Mark All' : 'Read ✓'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-slate-100 bg-[#f8fafc] flex items-center gap-2 overflow-x-auto text-[11px] font-bold no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'weather_alert', label: 'Weather' },
            { id: 'price_update', label: 'Prices' },
            { id: 'announcement', label: 'Govt.' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              className={`px-3 py-1 rounded-xl transition cursor-pointer ${
                filterType === t.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-sm font-semibold">No notifications right now.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const read = isItemRead(item);

              return (
                <div
                  key={item._id}
                  className={`p-4 rounded-2xl border transition-all ${
                    !read
                      ? 'bg-white border-emerald-300 shadow-xs'
                      : 'bg-[#f8fafc] border-slate-100 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-extrabold text-slate-800 truncate">
                          {item.title}
                        </h4>
                        {!read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        {item.message}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100/80">
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!read && (
                          <button
                            onClick={() => markRead(item._id)}
                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Bar: Go to Notifications Page */}
        <div className="p-4 border-t border-slate-100 bg-[#f8fafc]">
          <button
            onClick={() => {
              onClose();
              if (onNavigate) onNavigate('notifications');
            }}
            className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs text-center cursor-pointer"
          >
            Open Complete Notification Center
          </button>
        </div>
      </div>
    </div>
  );
};
