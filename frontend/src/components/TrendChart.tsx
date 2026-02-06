import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface TrendChartProps {
  data: any[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  // Generate sample data if no data exists
  const getSampleData = () => {
    const now = new Date();
    return Array.from({ length: 8 }, (_, i) => ({
      timestamp: new Date(now.getTime() - (7 - i) * 3600000).toISOString(),
      pain_level: Math.floor(Math.random() * 3) + 2, // 2-4
      heart_rate: Math.floor(Math.random() * 15) + 70, // 70-85
      temperature: 36.8 + Math.random() * 0.8 // 36.8-37.6
    }));
  };

  const chartData = (data.length > 0 ? data : getSampleData()).map(item => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fullDate: new Date(item.timestamp).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            {payload[0].payload.fullDate}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs font-bold text-slate-600">
                    {entry.name}:
                  </span>
                </div>
                <span className="text-sm font-black text-slate-900">
                  {entry.value}
                  {entry.name === 'Heart Rate' ? ' bpm' : ''}
                  {entry.name === 'Temperature' ? '°C' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bento-card col-span-1 lg:col-span-2 min-h-[450px] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Clinical Telemetry</h2>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Vitality Trends</h3>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-xl border border-teal-100">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
            <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Pain</span>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Pulse</span>
          </div>
        </div>
      </div>
      
      {data.length === 0 && (
        <div className="mb-4 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-xs font-bold text-amber-700">
            📊 Showing sample data - Log your first entry to see real metrics
          </p>
        </div>
      )}

      <div className="flex-1 min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#e2e8f0" 
              strokeOpacity={0.5}
            />
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={11} 
              fontWeight={700}
              tickLine={false} 
              axisLine={{ stroke: '#e2e8f0' }}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11} 
              fontWeight={700}
              tickLine={false} 
              axisLine={{ stroke: '#e2e8f0' }}
              dx={-10}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="pain_level" 
              stroke="#14b8a6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorPain)"
              name="Pain Level"
              dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="heart_rate" 
              stroke="#6366f1" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorPulse)"
              name="Heart Rate"
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg Pain</div>
          <div className="text-2xl font-bold text-teal-600">
            {(chartData.reduce((acc, d) => acc + d.pain_level, 0) / chartData.length).toFixed(1)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg HR</div>
          <div className="text-2xl font-bold text-indigo-600">
            {Math.round(chartData.reduce((acc, d) => acc + d.heart_rate, 0) / chartData.length)}
            <span className="text-xs text-slate-400 ml-1">bpm</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Points</div>
          <div className="text-2xl font-bold text-slate-600">
            {chartData.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
