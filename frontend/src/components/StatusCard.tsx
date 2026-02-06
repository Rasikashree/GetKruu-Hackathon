import React from 'react';
import { ShieldCheck, ShieldAlert, Zap, Waves, Activity } from 'lucide-react';

interface StatusCardProps {
  status: 'Normal' | 'Warning' | 'Critical';
  reason?: string;
  score?: number;
}

const StatusCard: React.FC<StatusCardProps> = ({ status, reason, score = 94 }) => {
  const configs = {
    Normal: {
      color: 'text-sky-500',
      bg: 'bg-sky-500/5',
      border: 'border-sky-100',
      label: 'Stable & Progressing',
      icon: <ShieldCheck size={32} />,
    },
    Warning: {
      color: 'text-amber-500',
      bg: 'bg-amber-500/5',
      border: 'border-amber-100',
      label: 'Review Required',
      icon: <Zap size={32} />,
    },
    Critical: {
      color: 'text-rose-500',
      bg: 'bg-rose-500/5',
      border: 'border-rose-100',
      label: 'Action Required',
      icon: <ShieldAlert size={32} />,
    },
  };

  const config = configs[status];

  return (
    <div className="bento-card group col-span-1 md:col-span-2 lg:col-span-3 !p-0 overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Main Info */}
        <div className="flex-1 p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${config.bg} ${config.color} border border-white/50 shadow-inner`}>
                {config.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Analysis Engine v2.0</span>
            </div>
            <h3 className="text-5xl font-bold text-slate-900 tracking-tighter mb-4 leading-none">
              {config.label}
            </h3>
            <p className="text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
              {reason}
            </p>
          </div>
          
          <div className="mt-10 flex items-center gap-6">
            <button 
              onClick={() => document.getElementById('vital-trends')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
            >
              Review Vitals
            </button>
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                  <Activity size={14} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Score Panel */}
        <div className={`w-full lg:w-80 p-10 ${config.bg} flex flex-col items-center justify-center border-l border-white/40`}>
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/50"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
                strokeLinecap="round"
                className={`${config.color} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-900 leading-none">{score}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Score</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <Waves size={14} className={config.color} />
              <span className={`text-[11px] font-black uppercase tracking-widest ${config.color}`}>AI Confidence</span>
            </div>
            <p className="text-xs font-bold text-slate-500">Based on multi-metric analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
