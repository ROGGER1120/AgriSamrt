import React, { useState } from 'react';
import {
  Bell,
  CloudRain,
  TrendingUp,
  CheckCheck,
  Check,
  Plus,
  Filter,
  Megaphone,
  X,
  Calendar,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../api/client';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markRead, markAllRead, isItemRead, fetchNotifications } = useNotifications();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [newNoticeOpen, setNewNoticeOpen] = useState(false);
  const [newNoticeData, setNewNoticeData] = useState({
    title: '',
    message: '',
    type: 'announcement',
    priority: 'medium',
  });
  const [saving, setSaving] = useState(false);

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await notificationAPI.createNotification(newNoticeData);
      setNewNoticeOpen(false);
      setNewNoticeData({ title: '', message: '', type: 'announcement', priority: 'medium' });
      fetchNotifications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setSaving(false);
    }
  };

  const getNoticeIcon = (type) => {
    switch (type) {
      case 'weather_alert':
        return (
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <CloudRain className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'price_update':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'announcement':
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Notification & Advisory Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Real-time weather alerts, crop price surges, MSP updates, and government notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllRead}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              unreadCount > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-white border border-slate-200 text-slate-500'
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            <span>{unreadCount > 0 ? `Mark All Read (${unreadCount})` : 'All Caught Up ✓'}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setNewNoticeOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Broadcast Announcement</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold no-scrollbar">
        {[
          { id: 'all', label: 'All Notices' },
          { id: 'weather_alert', label: '🌦️ Weather Alerts' },
          { id: 'price_update', label: '📈 Crop Price Spikes' },
          { id: 'announcement', label: '📢 Govt. Announcements' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-2xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-bold text-base">No notifications found in this category.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const read = isItemRead(item);

            return (
              <div
                key={item._id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !read
                    ? 'border-emerald-300 shadow-[0_4px_25px_rgba(16,185,129,0.06)]'
                    : 'border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] opacity-85'
                }`}
              >
                <div className="flex items-start gap-4">
                  {getNoticeIcon(item.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-800">
                        {item.title}
                      </h4>
                      {!read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed max-w-2xl">
                      {item.message}
                    </p>
                    <div className="text-[10px] text-slate-400 font-medium mt-2 flex items-center gap-2">
                      <span>{new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="uppercase font-bold text-emerald-600">{item.type?.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {!read && (
                  <button
                    onClick={() => markRead(item._id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark Read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Admin Broadcast Announcement Modal */}
      {newNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" /> Broadcast Mandi Notice
              </h3>
              <button
                onClick={() => setNewNoticeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APMC Closed on Diwali / Rain Alert for Mustard"
                  value={newNoticeData.title}
                  onChange={(e) => setNewNoticeData({ ...newNoticeData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Details for farmers and market participants..."
                  value={newNoticeData.message}
                  onChange={(e) => setNewNoticeData({ ...newNoticeData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newNoticeData.type}
                    onChange={(e) => setNewNoticeData({ ...newNoticeData, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="announcement">Govt / Mandi Announcement</option>
                    <option value="weather_alert">Weather Advisory</option>
                    <option value="price_update">Price Surge Alert</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newNoticeData.priority}
                    onChange={(e) => setNewNoticeData({ ...newNoticeData, priority: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="medium">Medium Priority</option>
                    <option value="high">High / Urgent</option>
                    <option value="low">Informational</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewNoticeOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                >
                  {saving ? 'Posting...' : 'Broadcast Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
