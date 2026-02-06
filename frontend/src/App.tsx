import { useState, useEffect } from 'react';
import MetricLogForm from './components/MetricLogForm';
import TrendChart from './components/TrendChart';
import StatusCard from './components/StatusCard';
import { Activity, Bell, History, Sparkles, PhoneCall, LayoutDashboard, Calendar, Search, User, ShieldCheck } from 'lucide-react';

interface MetricEntry {
  timestamp: string;
  pain_level: number;
  temperature: number;
  heart_rate: number;
  activity_level: string;
}

function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const body = isLogin ? { username, password } : { username, password, full_name: fullName };
      
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Auth failed');
      
      if (isLogin) {
        onLogin(data);
      } else {
        setIsLogin(true);
        alert('Registered successfully! Please login.');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bento-card">
        <div className="text-center mb-10">
          <div className="bg-slate-900 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Activity className="text-medical-teal" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">VITAL SENTINEL</h1>
          <p className="text-slate-500 font-medium">{isLogin ? 'Welcome back to your clinical dashboard' : 'Join our precision recovery network'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
              <input 
                type="text" 
                required 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-medical-teal outline-none transition-all font-bold text-sm"
                placeholder="Alex Sanders"
              />
            </div>
          )}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Username</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-medical-teal outline-none transition-all font-bold text-sm"
              placeholder="alex_99"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-medical-teal outline-none transition-all font-bold text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            {loading ? 'PROCESSING...' : (isLogin ? 'LOGIN' : 'SIGN UP')}
          </button>
        </form>

        <p className="text-center mt-8 text-xs font-bold text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <button onClick={() => setIsLogin(!isLogin)} className="text-medical-teal ml-2 uppercase tracking-widest">
            {isLogin ? 'Create one' : 'Login now'}
          </button>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<MetricEntry[]>([]);
  const [status, setStatus] = useState<'Normal' | 'Warning' | 'Critical'>('Normal');
  const [reason, setReason] = useState('Analysis confirms physiological stability and optimal tissue regeneration.');
  const [alerts, setAlerts] = useState<string[]>([]);
  const [patientName] = useState('Alex');
  const [healthScore, setHealthScore] = useState(94);
  const [reports, setReports] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleLog = async (newEntry: MetricEntry) => {
    try {
      const entryWithUser = { ...newEntry, user_id: user.username };
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryWithUser),
      });
      const result = await response.json();
      
      const updatedEntries = [...entries, newEntry];
      setEntries(updatedEntries);
      
      setStatus(result.status);
      setReason(result.reason);
      
      if (result.alert_provider) {
        setAlerts(prev => [`CRITICAL ALERT: ${result.reason}`, ...prev].slice(0, 5));
      }
      
      let newScore = 94;
      if (result.status === 'Critical') newScore = 45;
      else if (result.status === 'Warning') newScore = 72;
      setHealthScore(newScore);

    } catch (error) {
      console.error('Failed to sync with clinical engine:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const response = await fetch('http://localhost:8000/upload-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.username,
            filename: file.name,
            content_type: file.type,
            file_base64: base64String
          })
        });
        const result = await response.json();
        alert(`AI Analysis: ${result.analysis}`);
        fetchReports();
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const fetchReports = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8000/reports/${user.username}`);
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  const analyzeTrends = (data: MetricEntry[]) => {
    // Keep local fallback just in case
  };

  const clearHistory = () => {
    setEntries([]);
    setStatus('Normal');
    setReason('Ready for clinical monitoring baseline acquisition.');
    setHealthScore(94);
    setAlerts([]);
  };

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/history/${user.username}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setEntries(data.reverse());
        }
      } catch (error) {
        console.error('Failed to fetch telemetry history:', error);
      }
    };
    fetchHistory();
    fetchReports();
  }, [user]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-medical-teal/10 font-sans antialiased text-slate-900">
      {/* Background Innovations */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-medical-teal to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-accent-purple to-transparent blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto">
        {/* Navigation / Header */}
        <header className="glass-panel rounded-[2rem] px-8 py-4 mb-14 flex items-center justify-between shadow-2xl shadow-slate-200/50">
          <div className="flex items-center gap-6">
            <div className="bg-slate-900 p-3 rounded-2xl">
              <Activity className="text-medical-teal" size={24} />
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block" />
            <h1 className="text-2xl font-black tracking-tighter hidden md:block">
              VITAL<span className="text-medical-teal">SENTINEL</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-100/50 rounded-2xl px-6 py-2 border border-slate-200/50 hidden lg:flex">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search telemetry..." className="bg-transparent border-none outline-none text-xs font-bold w-48" />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Secure</span>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <Calendar size={16} className="text-medical-teal" />
                <span className="text-[11px] font-black">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Patient Identity</p>
                  <p className="text-xs font-black text-slate-900 leading-none">{user.full_name.toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setUser(null)}
                  className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden hover:bg-rose-50 transition-colors group"
                >
                  <User size={24} className="text-slate-400 group-hover:text-rose-500" />
                </button>
              </div>
              <button onClick={clearHistory} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100">
                <History size={20} className="text-slate-400 hover:text-rose-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="mb-14 px-4 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6 animate-float">
              <div className="bg-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Sparkles size={12} fill="white" /> Intelligent Monitor
              </div>
              <span className="text-[11px] font-black text-medical-teal uppercase tracking-[0.3em]">Continuous Analysis Active</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter mb-6 leading-[0.9]">
              Heal <span className="text-slate-300">with</span> <br /> Confidence.
            </h2>
            <p className="text-xl text-slate-500 max-w-xl font-medium leading-relaxed">
              Welcome back, {user.full_name.split(' ')[0]}. Your recovery journey is supported by our advanced clinical AI, providing real-time monitoring and personalized insights for your peace of mind.
            </p>
          </div>
        </div>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Main Status Hero (Full Width Top) */}
          <StatusCard status={status} reason={reason} score={healthScore} />

          {/* Activity Bento */}
          <div className="bento-card group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Telemetry Activity</h3>
                <Activity size={18} className="text-medical-teal animate-pulse-soft" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{entries.length}</span>
                <span className="text-xs font-bold text-slate-400 uppercase">Synchronized Points</span>
              </div>
            </div>
            <div className="mt-8 flex gap-2">
              {[1, 0.6, 0.4, 0.8, 1, 0.5, 0.9].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 rounded-full h-12 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full bg-medical-teal/40 rounded-full transition-all duration-1000" style={{ height: `${h * 100}%` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Metric Form */}
          <div className="lg:col-span-2 row-span-2">
            <MetricLogForm onLog={handleLog} />
          </div>

          {/* Clinical Documents Bento */}
          <div className="bento-card bg-slate-900 text-white !border-none flex flex-col justify-between overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 text-white/5 rotate-12 transition-transform duration-700 group-hover:scale-110">
              <PhoneCall size={200} />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-medical-teal transition-colors">
                  <PhoneCall className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage</p>
                  <p className="text-xs font-bold">{reports.length} Reports</p>
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-3 tracking-tight">Clinical Reports</h4>
              <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar max-h-32">
                {reports.length > 0 ? (
                  reports.map((r, i) => (
                    <div key={i} className="mb-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item">
                      <p className="text-[10px] font-black uppercase text-medical-teal mb-1">{r.filename.slice(0, 20)}...</p>
                      <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">{r.analysis}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">Upload medical lab results for AI analysis.</p>
                )}
              </div>
              <label className="relative z-10 w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-medical-teal hover:text-white transition-all text-center cursor-pointer">
                {uploading ? 'ANALYZING...' : 'UPLOAD LAB REPORT'}
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Trend Chart (Large Area) */}
          <div className="lg:col-span-2" id="vital-trends">
            <TrendChart data={entries} />
          </div>

          {/* Alerts / Notifications Bento */}
          <div className="bento-card col-span-1 md:col-span-2 lg:col-span-4 flex flex-col md:flex-row gap-10 items-center justify-between min-h-[160px]">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center border border-rose-100">
                <Bell size={28} className={alerts.length > 0 ? "text-rose-500 animate-bounce" : "text-slate-300"} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">System Notifications</h4>
                <p className="text-slate-500 font-medium">Monitoring engine is operating at full capacity.</p>
              </div>
            </div>
            
            <div className="flex-1 flex gap-4 overflow-x-auto pb-2 scrollbar-hide max-w-2xl">
              {alerts.length > 0 ? (
                alerts.map((alert, i) => (
                  <div key={i} className="bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl text-xs font-black whitespace-nowrap border border-rose-100">
                    {alert.toUpperCase()}
                  </div>
                ))
              ) : (
                <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl text-xs font-black whitespace-nowrap border border-emerald-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  ALL CHANNELS SECURE
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Innovations */}
        <footer className="mt-20 pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4">
            <Activity size={20} className="text-slate-400" />
            <div className="h-4 w-px bg-slate-300" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">RecoveryGuard OS Core v2.4.9</p>
          </div>
          <div className="flex gap-8">
            {['Analytics', 'Telemetry', 'Privacy', 'Compliance'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-medical-teal transition-colors">{item}</a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
