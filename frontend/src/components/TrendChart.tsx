import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface TrendChartProps {
  data: any[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  return (
    <div className="bento-card col-span-1 lg:col-span-2 min-h-[450px]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Clinical Telemetry</h2>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Vitality Trends</h3>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Pain</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Pulse</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '16px', 
              border: '1px solid #f1f5f9', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
              backdropFilter: 'blur(4px)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="pain_level" 
            stroke="#14b8a6" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorPain)"
            name="Pain Level"
          />
          <Area 
            type="monotone" 
            dataKey="heart_rate" 
            stroke="#6366f1" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorPulse)"
            name="Heart Rate"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
