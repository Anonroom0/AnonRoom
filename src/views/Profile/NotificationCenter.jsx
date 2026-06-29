import React, { useState } from 'react';
import { 
  ArrowLeft, Bell, CheckCircle2, Award, Trophy, ShieldAlert, Gift
} from 'lucide-react';
import { AudioEngine } from '../../services/AudioEngine.js';

export default function NotificationCenter({ navigateTo }) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const [notifications, setNotifications] = useState([
    { id: 1, category: 'System', title: "Welcome to AnonRoom 2.0!", message: "We've completely overhauled the UI for a smoother, premium experience. Explore the new task center and automated rewards system today.", time: "Just now", isRead: false },
    { id: 2, category: 'Task', title: "Task Approved Successfully", message: "Great job! Your screenshot proof for the Partner App download task has been verified. 50 Reward Points have been instantly credited to your balance.", time: "2 hours ago", isRead: false },
    { id: 3, category: 'Raffle', title: "Raffle Tickets Confirmed", message: "Your purchase of 5 tickets for the 'PlayStation 5 Console' raffle was successful. Your unique EPID ticket numbers are securely recorded on the ledger.", time: "1 day ago", isRead: true },
    { id: 4, category: 'Security', title: "New Device Login Detected", message: "A new login was detected from Chrome on Windows (IP: 192.168.1.1). If this was you, you can safely ignore this message. If not, please change your password immediately.", time: "3 days ago", isRead: true },
    { id: 5, category: 'Reward', title: "Coupon Expiring Soon", message: "Your 'Welcome Cashback' coupon is expiring in 48 hours. Don't forget to visit the Reward Center to activate it before it's gone!", time: "4 days ago", isRead: true }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayed = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

  const handleMarkAllRead = () => {
    AudioEngine.playClick();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleExpand = (id) => {
    AudioEngine.playClick();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('menu')} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">You have {unreadCount} unread alerts.</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-sm font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-blue-200 shadow-sm active:scale-95">
            <CheckCircle2 className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="flex items-center bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm mb-6">
        <button onClick={() => { AudioEngine.playClick(); setFilter('all'); }} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
          All Messages
        </button>
        <button onClick={() => { AudioEngine.playClick(); setFilter('unread'); }} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${filter === 'unread' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
          Unread ({unreadCount})
        </button>
      </div>

      <div className="card-standard bg-white overflow-hidden shadow-sm border border-slate-100 rounded-[1.5rem]">
        {displayed.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-5 shadow-inner border border-slate-100">
              <Bell className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">All caught up!</h3>
            <p className="text-sm text-slate-500 font-medium mt-1.5">You have no {filter === 'unread' ? 'unread ' : ''}notifications at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayed.map((notif) => {
              const isExpanded = expandedId === notif.id;
              let Icon = Bell; let colorClass = 'text-blue-600 bg-blue-50 border-blue-200';
              if(notif.category === 'Task') { Icon = Award; colorClass = 'text-green-600 bg-green-50 border-green-200'; }
              if(notif.category === 'Raffle') { Icon = Trophy; colorClass = 'text-amber-600 bg-amber-50 border-amber-200'; }
              if(notif.category === 'Security') { Icon = ShieldAlert; colorClass = 'text-red-600 bg-red-50 border-red-200'; }
              if(notif.category === 'Reward') { Icon = Gift; colorClass = 'text-purple-600 bg-purple-50 border-purple-200'; }

              return (
                <div key={notif.id} onClick={() => toggleExpand(notif.id)} className={`transition-colors cursor-pointer p-5 sm:p-6 hover:bg-slate-50 ${!notif.isRead ? 'bg-blue-50/20' : ''}`}>
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="shrink-0 relative">
                      <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center border shadow-sm ${notif.isRead ? 'bg-slate-50 text-slate-400 border-slate-200' : colorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {!notif.isRead && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-sm animate-pulse"></span>}
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-2">
                        <h4 className={`text-base sm:text-lg font-bold truncate ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</h4>
                        <span className="text-xs font-bold text-slate-400 shrink-0">{notif.time}</span>
                      </div>
                      
                      {!isExpanded ? (
                        <p className={`text-sm truncate ${notif.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>{notif.message}</p>
                      ) : (
                        <div className="animate-fade-in mt-4 text-sm text-slate-600 font-medium leading-relaxed bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                          {notif.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
