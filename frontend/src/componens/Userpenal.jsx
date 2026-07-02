import React, { useState } from 'react';

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sample data for demonstration
  const user = {
    name: "Dr. John Doe",
    email: "john.doe@hospital.com",
    role: "Consultant Cardiologist",
    station: "Core Node 04",
  };

  const metrics = [
    { id: 1, title: "Total Patients", value: "1,240", change: "+12% this month", color: "from-teal-500 to-cyan-500" },
    { id: 2, title: "Active Consultations", value: "42", change: "8 pending approval", color: "from-blue-500 to-indigo-500" },
    { id: 3, title: "System Uptime", value: "99.98%", change: "Secure node connection", color: "from-emerald-500 to-teal-500" },
  ];

  const recentActivities = [
    { id: 1, type: "Appointment", patient: "Sarah Jenkins", time: "10:30 AM", status: "Completed" },
    { id: 2, type: "Report Update", patient: "Michael Chang", time: "11:45 AM", status: "Pending review" },
    { id: 3, type: "Emergency Log", patient: "Emma Watson", time: "02:15 PM", status: "Critical" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex text-slate-800 overflow-x-hidden">
      
      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside className={`bg-slate-900 text-white w-64 min-h-screen flex flex-col justify-between p-6 fixed md:relative z-30 transition-transform duration-300 shadow-xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className="space-y-8">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group/logo max-w-max">
            <div className="bg-white/10 p-2 rounded-xl border border-white/10 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-lg font-black tracking-wider uppercase text-slate-100">
              MedCare <span className="text-teal-400 font-light">OS</span>
            </span>
          </div>

          {/* User Brief Card */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center font-bold text-slate-900 text-sm shadow-md shadow-teal-500/20">
              JD
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-200 truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/15' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}
            >
              📊 Terminal Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('patients')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'patients' ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/15' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}
            >
              👥 Patient Desk
            </button>
            <button 
              onClick={() => setActiveTab('schedules')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'schedules' ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/15' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}
            >
              📅 Shift Schedules
            </button>
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'settings' ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/15' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}
            >
              ⚙️ Node Settings
            </button>
          </nav>
        </div>

        {/* System Session Status / Logout Footer */}
        <div className="space-y-4">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider pl-2">
            Status: <span className="text-emerald-400 animate-pulse">● Online</span>
          </div>
          <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200">
            Secure Log Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 min-h-screen flex flex-col p-6 md:p-10 ml-0 md:ml-0 transition-all duration-300">
        
        {/* Header Dashboard Bar */}
        <header className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 shadow-sm">
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">Station Dashboard</h1>
            <p className="text-xs text-slate-400">Welcome back to MedCare Core Network • {user.station}</p>
          </div>
          
          {/* Mobile Sidebar Toggle Hamburger Button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="md:hidden p-2.5 bg-slate-100 rounded-xl border border-slate-200 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            ☰
          </button>
        </header>

        {/* Dynamic Content Switching Logic */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* 1. Analytics & Metrics Cards Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
                  <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${item.color}`} />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">{item.title}</p>
                  <h3 className="text-3xl font-black text-slate-800 mb-1">{item.value}</h3>
                  <p className="text-xs text-emerald-600 font-semibold">{item.change}</p>
                </div>
              ))}
            </section>

            {/* 2. Main Station Grid: Recent Activities & Alerts */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Activity Table Container */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-md font-extrabold text-slate-800">Active Station Logs</h3>
                    <p className="text-xs text-slate-400">Real-time status of clinical queues</p>
                  </div>
                  <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-[11px] font-bold uppercase tracking-wider rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 pl-2">Patient</th>
                        <th className="pb-3">Log Event</th>
                        <th className="pb-3">Time</th>
                        <th className="pb-3 text-right pr-2">Security Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                      {recentActivities.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 pl-2 font-bold text-slate-800">{log.patient}</td>
                          <td className="py-3.5 text-slate-500">{log.type}</td>
                          <td className="py-3.5 text-slate-400">{log.time}</td>
                          <td className="py-3.5 text-right pr-2">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              log.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                              log.status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar Info/Alert Desk */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-[2rem] text-white flex flex-col justify-between shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
                
                <div className="space-y-4 relative z-10">
                  <div className="inline-flex px-2.5 py-0.5 rounded-full bg-white/10 text-teal-400 text-[9px] font-bold uppercase tracking-widest">
                    Node Network Broadcast
                  </div>
                  <h3 className="text-lg font-black leading-snug">System Security Active</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your login session token is fully encrypted with AES-256 protocols. Your workstation IP has been logged for regulatory compliance auditing.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 text-[11px] text-slate-400 font-medium">
                  🔒 Verified Station Protocol 
                </div>
              </div>

            </section>
          </div>
        )}

        {/* Fallback View for Other Tabs */}
        {activeTab !== 'dashboard' && (
          <div className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-sm text-center py-20 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-lg font-extrabold text-slate-800 uppercase tracking-wide">Tab: {activeTab} Section</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">This module dashboard view is encrypted and loading infrastructure workflows...</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default UserPanel;