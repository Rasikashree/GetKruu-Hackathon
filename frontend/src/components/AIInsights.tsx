import React from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

interface AIInsightsProps {
  insights: {
    anomalies_detected?: number;
    anomaly_details?: Array<{
      type: string;
      severity: string;
      message: string;
      zscore?: number;
    }>;
    trends?: {
      pain?: {
        direction: string;
        confidence: number;
        prediction_next?: number;
      };
      activity?: {
        direction: string;
        confidence: number;
      };
      recovery_score?: number;
      recovery_velocity?: number;
    };
    baseline?: {
      pain_baseline: number;
      temp_baseline: number;
      hr_baseline: number;
    };
    recovery_score?: number;
    recommendation?: string;
  } | null;
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  if (!insights) {
    return (
      <div className="bento-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Brain size={20} className="text-purple-500" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">AI Analysis</h3>
            <p className="text-sm font-bold text-slate-600">Initializing...</p>
          </div>
        </div>
      </div>
    );
  }

  const getTrendIcon = (direction: string) => {
    if (direction === 'increasing' || direction === 'improving') return <TrendingUp size={16} className="text-emerald-500" />;
    if (direction === 'decreasing' || direction === 'declining') return <TrendingDown size={16} className="text-rose-500" />;
    return <Minus size={16} className="text-slate-400" />;
  };

  const getRecommendationBadge = (rec: string) => {
    const badges: Record<string, { color: string; text: string; icon: any }> = {
      'IMMEDIATE_REVIEW_REQUIRED': { color: 'bg-rose-100 text-rose-700 border-rose-200', text: 'Immediate Review', icon: AlertTriangle },
      'SCHEDULE_FOLLOWUP': { color: 'bg-amber-100 text-amber-700 border-amber-200', text: 'Schedule Follow-up', icon: Activity },
      'MONITOR_CLOSELY': { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Monitor Closely', icon: Activity },
      'CONTINUE_MONITORING': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Continue Monitoring', icon: CheckCircle2 }
    };

    const badge = badges[rec] || badges['CONTINUE_MONITORING'];
    const Icon = badge.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider ${badge.color}`}>
        <Icon size={14} />
        {badge.text}
      </div>
    );
  };

  const recoveryScore = insights.recovery_score || 0;
  const scoreColor = recoveryScore >= 70 ? 'text-emerald-500' : recoveryScore >= 50 ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="bento-card space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">AI Monitoring</h3>
            <p className="text-2xl font-bold text-slate-900">Clinical Intelligence</p>
          </div>
        </div>
      </div>

      {/* Recovery Score */}
      {insights.recovery_score !== undefined && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Recovery Score</span>
            {insights.recommendation && getRecommendationBadge(insights.recommendation)}
          </div>
          <div className="flex items-baseline gap-3">
            <span className={`text-5xl font-black ${scoreColor}`}>{recoveryScore}</span>
            <span className="text-2xl font-bold text-slate-400">/100</span>
          </div>
          {insights.trends?.recovery_velocity !== undefined && (
            <div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-600">
              {insights.trends.recovery_velocity > 0 ? (
                <>
                  <TrendingUp size={16} className="text-emerald-500" />
                  <span className="text-emerald-600">+{insights.trends.recovery_velocity.toFixed(1)} velocity</span>
                </>
              ) : (
                <>
                  <TrendingDown size={16} className="text-rose-500" />
                  <span className="text-rose-600">{insights.trends.recovery_velocity.toFixed(1)} velocity</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Trends */}
      {insights.trends && (
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Trend Analysis</h4>
          <div className="grid grid-cols-2 gap-3">
            {insights.trends.pain && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pain</span>
                  {getTrendIcon(insights.trends.pain.direction)}
                </div>
                <div className="text-sm font-bold text-slate-700 capitalize">{insights.trends.pain.direction}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {(insights.trends.pain.confidence * 100).toFixed(0)}% confidence
                </div>
              </div>
            )}
            
            {insights.trends.activity && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Activity</span>
                  {getTrendIcon(insights.trends.activity.direction)}
                </div>
                <div className="text-sm font-bold text-slate-700 capitalize">{insights.trends.activity.direction}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {(insights.trends.activity.confidence * 100).toFixed(0)}% confidence
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Anomalies */}
      {insights.anomalies_detected && insights.anomalies_detected > 0 && insights.anomaly_details && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Anomalies Detected</h4>
            <span className="bg-rose-100 text-rose-700 text-xs font-black px-3 py-1 rounded-full">
              {insights.anomalies_detected}
            </span>
          </div>
          <div className="space-y-2">
            {insights.anomaly_details.map((anomaly, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border ${
                  anomaly.severity === 'CRITICAL' 
                    ? 'bg-rose-50 border-rose-200' 
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle 
                    size={18} 
                    className={anomaly.severity === 'CRITICAL' ? 'text-rose-500 mt-0.5' : 'text-amber-500 mt-0.5'} 
                  />
                  <div className="flex-1">
                    <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1">
                      {anomaly.type.replace('_', ' ')}
                    </div>
                    <div className="text-sm font-medium text-slate-700 leading-relaxed">
                      {anomaly.message}
                    </div>
                    {anomaly.zscore && (
                      <div className="mt-2 text-xs font-bold text-slate-500">
                        Statistical deviation: {anomaly.zscore}σ from baseline
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Baseline Info */}
      {insights.baseline && (
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Personal Baseline</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Pain</div>
              <div className="text-lg font-bold text-slate-700">{insights.baseline.pain_baseline}/10</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Temp</div>
              <div className="text-lg font-bold text-slate-700">{insights.baseline.temp_baseline}°C</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">HR</div>
              <div className="text-lg font-bold text-slate-700">{insights.baseline.hr_baseline}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
