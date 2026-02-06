import { Activity, TrendingUp, AlertTriangle, Target, Zap, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Entry {
  date: string;
  pain: number;
  activity: number;
  heartRate?: number;
}

interface AIInsights {
  recovery_score?: number;
  pain_trend?: { direction: string; slope: number; confidence: number };
  activity_trend?: { direction: string; slope: number; confidence: number };
  anomalies?: string[];
}

interface Props {
  entries: Entry[];
  insights: AIInsights | null;
}

export default function PredictiveAnalytics({ entries, insights }: Props) {
  // Calculate recovery velocity (rate of improvement per day)
  const calculateRecoveryVelocity = () => {
    if (entries.length < 3) return 0;
    
    const recentEntries = entries.slice(-7);
    const painDecrease = recentEntries[0].pain - recentEntries[recentEntries.length - 1].pain;
    const activityIncrease = recentEntries[recentEntries.length - 1].activity - recentEntries[0].activity;
    
    // Velocity = (pain reduction + activity gain) / days
    const velocity = ((painDecrease * 10) + (activityIncrease * 5)) / recentEntries.length;
    return Math.max(-20, Math.min(20, velocity)); // Cap between -20 and +20
  };

  // Calculate complication probability (0-100%)
  const calculateComplicationRisk = () => {
    if (!insights || entries.length === 0) return 15;
    
    let risk = 0;
    
    // High pain = increased risk
    const avgPain = entries.slice(-3).reduce((sum, e) => sum + e.pain, 0) / Math.min(3, entries.length);
    if (avgPain > 7) risk += 30;
    else if (avgPain > 5) risk += 15;
    else if (avgPain > 3) risk += 5;
    
    // Pain increasing = higher risk
    if (insights.pain_trend?.direction === 'increasing') risk += 25;
    else if (insights.pain_trend?.direction === 'stable') risk += 10;
    
    // Decreasing activity = higher risk
    if (insights.activity_trend?.direction === 'decreasing') risk += 20;
    
    // Anomalies = significant risk
    if (insights.anomalies && insights.anomalies.length > 0) risk += 30;
    
    // Low recovery score = higher risk
    if (insights.recovery_score && insights.recovery_score < 30) risk += 20;
    
    return Math.min(100, Math.max(0, risk));
  };

  // Generate 7-day forecast data
  const generateForecast = () => {
    if (entries.length === 0) {
      return Array.from({ length: 7 }, (_, i) => ({
        day: `Day ${i + 1}`,
        predictedPain: 5,
        confidence: 0,
        predictedHR: 75,
      }));
    }

    const recentEntries = entries.slice(-5);
    const avgPain = recentEntries.reduce((sum, e) => sum + e.pain, 0) / recentEntries.length;
    const avgHR = recentEntries.reduce((sum, e) => sum + (e.heartRate || 75), 0) / recentEntries.length;
    
    const painSlope = insights?.pain_trend?.slope || -0.1;
    const painConfidence = insights?.pain_trend?.confidence || 0.5;

    return Array.from({ length: 7 }, (_, i) => {
      const dayOffset = i + 1;
      const predictedPain = Math.max(0, Math.min(10, avgPain + (painSlope * dayOffset)));
      const predictedHR = Math.max(60, Math.min(100, avgHR - (dayOffset * 0.5)));
      const confidence = Math.max(30, painConfidence * 100 - (dayOffset * 5));
      
      return {
        day: `Day ${dayOffset}`,
        predictedPain: Number(predictedPain.toFixed(1)),
        confidence: Number(confidence.toFixed(0)),
        predictedHR: Number(predictedHR.toFixed(0)),
      };
    });
  };

  const velocity = calculateRecoveryVelocity();
  const complicationRisk = calculateComplicationRisk();
  const forecast = generateForecast();

  const getVelocityStatus = () => {
    if (velocity > 5) return { label: 'Excellent', color: 'emerald', icon: '🚀' };
    if (velocity > 2) return { label: 'Good', color: 'teal', icon: '✨' };
    if (velocity > -2) return { label: 'Stable', color: 'amber', icon: '⚡' };
    return { label: 'Concerning', color: 'rose', icon: '⚠️' };
  };

  const getRiskLevel = () => {
    if (complicationRisk < 20) return { label: 'Low', color: 'emerald' };
    if (complicationRisk < 50) return { label: 'Moderate', color: 'amber' };
    return { label: 'High', color: 'rose' };
  };

  const velocityStatus = getVelocityStatus();
  const riskLevel = getRiskLevel();

  return (
    <div className="bento-card lg:col-span-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-medical-teal mb-2">Predictive Intelligence</p>
          <h3 className="text-2xl font-bold text-slate-900">Recovery Trajectory Analysis</h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-medical-teal to-teal-600 flex items-center justify-center">
          <Brain size={24} className="text-white" />
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Recovery Velocity */}
        <div className={`p-5 rounded-2xl bg-${velocityStatus.color}-50 border border-${velocityStatus.color}-100`}>
          <div className="flex items-center justify-between mb-3">
            <Zap size={20} className={`text-${velocityStatus.color}-600`} />
            <span className="text-2xl">{velocityStatus.icon}</span>
          </div>
          <p className="text-xs font-bold text-slate-600 mb-1">Recovery Velocity</p>
          <p className={`text-3xl font-black text-${velocityStatus.color}-600 mb-1`}>
            {velocity > 0 ? '+' : ''}{velocity.toFixed(1)}
          </p>
          <p className={`text-xs font-bold text-${velocityStatus.color}-600`}>{velocityStatus.label}</p>
        </div>

        {/* Complication Risk */}
        <div className={`p-5 rounded-2xl bg-${riskLevel.color}-50 border border-${riskLevel.color}-100`}>
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle size={20} className={`text-${riskLevel.color}-600`} />
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-6 rounded-full ${
                    i < Math.ceil(complicationRisk / 35) ? `bg-${riskLevel.color}-500` : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs font-bold text-slate-600 mb-1">Complication Risk</p>
          <p className={`text-3xl font-black text-${riskLevel.color}-600 mb-1`}>{complicationRisk}%</p>
          <p className={`text-xs font-bold text-${riskLevel.color}-600`}>{riskLevel.label} Risk</p>
        </div>

        {/* Recovery Score */}
        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
          <div className="flex items-center justify-between mb-3">
            <Target size={20} className="text-indigo-600" />
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-black text-indigo-600">AI</span>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-600 mb-1">Recovery Index</p>
          <p className="text-3xl font-black text-indigo-600 mb-1">
            {insights?.recovery_score?.toFixed(0) || '—'}
          </p>
          <p className="text-xs font-bold text-indigo-600">
            {insights?.recovery_score && insights.recovery_score > 70 ? 'On Track' : 
             insights?.recovery_score && insights.recovery_score > 40 ? 'Progressing' : 'Needs Attention'}
          </p>
        </div>
      </div>

      {/* 7-Day Pain Forecast Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={16} className="text-medical-teal" />
            7-Day Pain Level Forecast
          </h4>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-medical-teal" />
              <span className="text-xs font-semibold text-slate-600">Predicted Pain</span>
            </div>
            <div className="flex items-center gap-1.5 ml-3">
              <div className="w-3 h-3 rounded-full bg-violet-400" />
              <span className="text-xs font-semibold text-slate-600">Confidence</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={forecast}>
            <defs>
              <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="day" 
              stroke="#94a3b8"
              style={{ fontSize: '11px', fontWeight: 600 }}
            />
            <YAxis 
              stroke="#94a3b8"
              style={{ fontSize: '11px', fontWeight: 600 }}
              domain={[0, 10]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600
              }}
            />
            <Area 
              type="monotone" 
              dataKey="predictedPain" 
              stroke="#14b8a6" 
              strokeWidth={3}
              fill="url(#painGradient)"
            />
            <Area 
              type="monotone" 
              dataKey="confidence" 
              stroke="#a78bfa" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#confidenceGradient)"
              yAxisId={1}
            />
            <YAxis yAxisId={1} orientation="right" stroke="#a78bfa" hide />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Predictive Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-medical-teal/10 flex items-center justify-center flex-shrink-0">
              <Activity size={16} className="text-medical-teal" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 mb-1">Expected by Day 7</p>
              <p className="text-sm text-slate-600">
                Pain Level: <span className="font-bold text-medical-teal">{forecast[6].predictedPain}/10</span>
                <span className="mx-2">•</span>
                Heart Rate: <span className="font-bold text-medical-teal">{forecast[6].predictedHR} bpm</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
              <Brain size={16} className="text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 mb-1">AI Recommendation</p>
              <p className="text-sm text-slate-600">
                {velocity > 3 ? 'Maintain current recovery protocols' :
                 velocity > 0 ? 'Monitor trends closely for next 48h' :
                 'Consider care provider consultation'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
