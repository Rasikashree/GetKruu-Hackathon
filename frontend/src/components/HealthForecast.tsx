import React from 'react';
import { TrendingUp, Calendar, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';

interface HealthForecastProps {
  insights: any;
  entries: any[];
}

const HealthForecast: React.FC<HealthForecastProps> = ({ insights, entries }) => {
  const getDaysUntilFullRecovery = () => {
    if (!insights?.trends?.pain) return 14;
    
    const painSlope = insights.trends.pain.slope || 0;
    if (painSlope >= -0.05) return 21; // Slow recovery
    if (painSlope <= -0.3) return 7;   // Fast recovery
    return 14; // Average
  };

  const getRecoveryMilestones = () => {
    const daysToRecovery = getDaysUntilFullRecovery();
    const today = new Date();
    
    return [
      {
        milestone: 'Pain Management',
        status: entries.length > 3 ? 'completed' : 'in-progress',
        expectedDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        confidence: 95
      },
      {
        milestone: 'Mobility Restoration',
        status: 'in-progress',
        expectedDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        confidence: 85
      },
      {
        milestone: 'Full Recovery',
        status: 'pending',
        expectedDate: new Date(today.getTime() + daysToRecovery * 24 * 60 * 60 * 1000),
        confidence: 78
      }
    ];
  };

  const getPredictedMetrics = () => {
    if (!insights?.baseline) return null;
    
    const painTrend = insights.trends?.pain?.slope || -0.15;
    const currentPain = entries[entries.length - 1]?.pain_level || insights.baseline.pain_baseline;
    
    return {
      tomorrow: {
        pain: Math.max(0, Math.min(10, currentPain + painTrend)),
        confidence: 82
      },
      nextWeek: {
        pain: Math.max(0, Math.min(10, currentPain + (painTrend * 7))),
        confidence: 68
      }
    };
  };

  const milestones = getRecoveryMilestones();
  const predictions = getPredictedMetrics();
  const daysToRecovery = getDaysUntilFullRecovery();

  return (
    <div className="bento-card col-span-1 lg:col-span-2 min-h-[450px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Predictive Analytics</h2>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Recovery Forecast</h3>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-2xl">
          <div className="text-xs font-black uppercase tracking-wider">Est. Recovery</div>
          <div className="text-2xl font-black">{daysToRecovery} Days</div>
        </div>
      </div>

      {/* Predicted Metrics */}
      {predictions && (
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-teal-700 uppercase tracking-wider">Tomorrow</span>
              <Zap size={16} className="text-teal-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-teal-900">{predictions.tomorrow.pain.toFixed(1)}</span>
              <span className="text-sm font-bold text-teal-600">/10 pain</span>
            </div>
            <div className="mt-2 text-xs font-bold text-teal-600">
              {predictions.tomorrow.confidence}% confidence
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-blue-700 uppercase tracking-wider">Next Week</span>
              <Clock size={16} className="text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-900">{predictions.nextWeek.pain.toFixed(1)}</span>
              <span className="text-sm font-bold text-blue-600">/10 pain</span>
            </div>
            <div className="mt-2 text-xs font-bold text-blue-600">
              {predictions.nextWeek.confidence}% confidence
            </div>
          </div>
        </div>
      )}

      {/* Recovery Milestones */}
      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Recovery Timeline</h4>
        <div className="space-y-3">
          {milestones.map((milestone, idx) => (
            <div 
              key={idx}
              className={`relative p-4 rounded-2xl border-2 transition-all ${
                milestone.status === 'completed' 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : milestone.status === 'in-progress'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    milestone.status === 'completed'
                      ? 'bg-emerald-500'
                      : milestone.status === 'in-progress'
                      ? 'bg-blue-500 animate-pulse'
                      : 'bg-slate-300'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <CheckCircle2 size={20} className="text-white" />
                    ) : milestone.status === 'in-progress' ? (
                      <TrendingUp size={20} className="text-white" />
                    ) : (
                      <Calendar size={20} className="text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-bold text-slate-900">{milestone.milestone}</h5>
                      <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-full ${
                        milestone.status === 'completed'
                          ? 'bg-emerald-200 text-emerald-700'
                          : milestone.status === 'in-progress'
                          ? 'bg-blue-200 text-blue-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-slate-600 font-bold">
                        <Calendar size={12} />
                        {milestone.expectedDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-slate-500 font-medium">
                        {milestone.confidence}% confidence
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {milestone.status === 'in-progress' && (
                  <div className="ml-4">
                    <div className="w-32 h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      {insights?.trends && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-purple-500 mt-0.5" />
            <div>
              <div className="text-xs font-black text-purple-700 uppercase tracking-wider mb-1">
                AI Recommendation
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {insights.trends.pain?.direction === 'decreasing' 
                  ? 'Your recovery is progressing well. Continue current treatment plan and maintain activity levels.'
                  : insights.trends.pain?.direction === 'increasing'
                  ? 'Pain levels trending upward. Consider scheduling a follow-up consultation.'
                  : 'Recovery is stable. Keep logging daily metrics for accurate predictions.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthForecast;
