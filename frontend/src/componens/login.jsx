import React, { useState } from 'react';

const Login = () => {
  // State to track whether the user is in 'login' or 'signup' mode
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [role] = useState('doctor'); // Fixed 'doctor' role to maintain the default teal theme aesthetics
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      console.log("Logging in with:", { email, password });
    } else {
      console.log("Creating account with:", { name, email, password });
    }
  };

  const getBlobTheme = () => {
    if (role === 'admin') return 'from-blue-200/40';
    if (role === 'doctor') return 'from-teal-200/40';
    if (role === 'receptionist') return 'from-indigo-200/40';
    return 'from-emerald-200/40';
  };

  const getCardActiveBorder = () => {
    if (role === 'admin') return 'hover:border-blue-300/60 hover:shadow-[0_30px_70px_rgba(37,99,235,0.12)]';
    if (role === 'doctor') return 'hover:border-teal-300/60 hover:shadow-[0_30px_70px_rgba(13,148,136,0.12)]';
    if (role === 'receptionist') return 'hover:border-indigo-300/60 hover:shadow-[0_30px_70px_rgba(79,70,229,0.12)]';
    return 'hover:border-emerald-300/60 hover:shadow-[0_30px_70px_rgba(5,150,105,0.12)]';
  };

  const getFocusBorder = () => {
    if (role === 'admin') return 'focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 focus-within:scale-[1.03] focus-within:-translate-y-0.5';
    if (role === 'doctor') return 'focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100 focus-within:scale-[1.03] focus-within:-translate-y-0.5';
    if (role === 'receptionist') return 'focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:scale-[1.03] focus-within:-translate-y-0.5';
    return 'focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 focus-within:scale-[1.03] focus-within:-translate-y-0.5';
  };

  const getSubmitButtonStyle = () => {
    if (role === 'admin') return 'bg-gradient-to-r from-blue-600 to-blue-700 btn-glow-blue';
    if (role === 'doctor') return 'bg-gradient-to-r from-teal-600 to-cyan-600 btn-glow-teal';
    if (role === 'receptionist') return 'bg-gradient-to-r from-indigo-600 to-violet-600 btn-glow-indigo';
    return 'bg-gradient-to-r from-emerald-600 to-teal-600 btn-glow-emerald';
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 md:p-0 font-sans relative overflow-hidden transition-colors duration-500">
      
      {/* Background Blobs */}
      <div className={`absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-br ${getBlobTheme()} to-transparent rounded-full blur-[100px] pointer-events-none animate-fluid-blob-light`} />
      <div className={`absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr ${getBlobTheme()} to-transparent rounded-full blur-[100px] pointer-events-none animate-fluid-blob-light [animation-delay:3s]`} />

      {/* Main Container Card */}
      <div className={`bg-white/90 backdrop-blur-xl flex rounded-[2rem] shadow-xl border border-slate-100 max-w-4xl w-full min-h-[580px] overflow-hidden relative z-10 transition-all duration-500 ${getCardActiveBorder()}`}>
        
        {/* ================= LEFT PANEL (MEDCARE OS) ================= */}
        <div className="hidden md:flex md:w-1/2 bg-slate-900 p-12 text-white flex-col justify-between relative group/sidebar overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover/sidebar:translate-x-10 group-hover/sidebar:translate-y-10" />

          {/* Logo */}
          <div className="flex items-center gap-3.5 z-10 cursor-pointer group/logo max-w-max transition-all duration-300 hover:scale-[1.05] active:scale-98">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover/logo:rotate-[15deg] group-hover/logo:bg-teal-500/20 group-hover/logo:border-teal-400/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400 transition-transform duration-300 group-hover/logo:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-wider uppercase text-slate-100 group-hover/logo:text-white transition-colors">
              MedCare <span className="text-teal-400 font-light group-hover/logo:text-teal-300 transition-all duration-300 group-hover/logo:tracking-widest">OS</span>
            </span>
          </div>

          {/* Heading Section */}
          <div className="z-10 space-y-5 group/text cursor-default">
            <div className="inline-flex px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 group-hover/sidebar:bg-teal-500/10 group-hover/sidebar:border-teal-500/20 group-hover/sidebar:text-teal-400">
              Hospital Terminal Session
            </div>
            <div className="relative inline-block">
              <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-100 transition-all duration-500 group-hover/text:scale-[1.02] group-hover/text:text-white origin-left">
                {isLoginMode ? "Digitalizing Healthcare, Elevating Care." : "Join the Next-Gen Health Network."}
              </h1>
              <div className="h-[2px] w-0 bg-gradient-to-r from-teal-400 to-cyan-500 absolute -bottom-2 left-0 transition-all duration-500 group-hover/text:w-2/3" />
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed transition-all duration-500 group-hover/sidebar:text-slate-300">
              {isLoginMode 
                ? "Access the clinical management desk securely. Please input verified personnel identity keys to enter your station dashboard."
                : "Create your secure professional core profile. Connect with patients and sync your clinic records in real-time."}
            </p>
          </div>

          {/* Footer Copyright */}
          <div className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase z-10 transition-colors duration-300 hover:text-slate-300 cursor-help">
            &copy; 2026 MedCare Core Network • Secure Node
          </div>
        </div>

        {/* ================= RIGHT PANEL FORM ================= */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white transition-all duration-500">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-800">
              {isLoginMode ? "System Sign In" : "Create Account"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isLoginMode ? "Please authenticate your station identity" : "Register new workstation credentials"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input Field - (Visible only in Sign Up / Create Account mode) */}
            {!isLoginMode && (
              <div className="space-y-1.5 transition-all duration-300">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide pl-0.5">Full Name</label>
                <div className={`bg-slate-50 border border-slate-200/80 rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.03] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${getFocusBorder()}`}>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-transparent outline-none text-sm text-slate-800 font-medium placeholder-slate-400" 
                    required 
                  />
                </div>
              </div>
            )}

            {/* Email Input Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide pl-0.5">Identity Email ID</label>
              <div className={`bg-slate-50 border border-slate-200/80 rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.03] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${getFocusBorder()}`}>
                <input 
                  type="email" 
                  placeholder="name@hospital.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-transparent outline-none text-sm text-slate-800 font-medium placeholder-slate-400" 
                  required 
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center pl-0.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Security Code</label>
                {isLoginMode && (
                  <a href="#" className="text-[11px] font-semibold text-blue-600 transition-transform duration-200 hover:scale-105 active:scale-95 inline-block">Forgot?</a>
                )}
              </div>
              <div className={`bg-slate-50 border border-slate-200/80 rounded-xl flex items-center relative transition-all duration-300 shadow-sm hover:scale-[1.03] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${getFocusBorder()}`}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-14 py-3.5 bg-transparent outline-none text-sm text-slate-800 font-medium placeholder-slate-400" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 text-xs font-bold uppercase transition-all duration-200 hover:text-slate-700 hover:scale-110 active:scale-95"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Checkbox - (Visible only in Login mode) */}
            {isLoginMode && (
              <div className="flex items-center gap-2 pl-0.5 group/check max-w-max">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-transparent cursor-pointer transition-transform duration-200 group-hover/check:scale-110" />
                <label htmlFor="remember" className="text-xs text-slate-400 font-medium cursor-pointer select-none transition-all duration-200 group-hover/check:text-slate-600 group-hover/check:translate-x-0.5">
                  Remember my terminal station session
                </label>
              </div>
            )}

            {/* Submission Button */}
            <button 
              type="submit" 
              className={`w-full py-4 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 transform shadow-md hover:scale-[1.04] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 cursor-pointer ${getSubmitButtonStyle()}`}
            >
              {isLoginMode ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* ================= SWITCH TOGGLE (Sign In / Sign Up) ================= */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              {isLoginMode ? "New to MedCare OS?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-teal-600 font-bold hover:underline transition-colors focus:outline-none"
              >
                {isLoginMode ? "Create an account" : "Sign In here"}
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;