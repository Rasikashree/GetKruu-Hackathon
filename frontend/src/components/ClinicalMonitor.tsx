import { Shield, TrendingDown, AlertCircle, CheckCircle, Clock, Target } from 'lucide-react';

interface Entry {
  date: string;
  pain: number;
  activity: number;
  heartRate?: number;
}

interface AIInsights {
  recovery_score?: number;
  pain_trend?: { direction: string; slope: number };
  activity_trend?: { direction: string };
  anomalies?: string[];
}

interface Props {
  entries: Entry[];
  insights: AIInsights | null;
}

export default function ClinicalMonitor({ entries, insights }: Props) {
  // Calculate vital signs status
  const getVitalStatus = () => {
    if (entries.length === 0) {
      return {
        pain: { value: '—', status: 'baseline', color: 'slate' },
        hr: { value: '—', status: 'baseline', color: 'slate' },
        activity: { value: '—', status: 'baseline', color: 'slate' }
      };
    }

    const latest = entries[entries.length - 1];
    
    return {
      pain: {
        value: latest.pain,
        status: latest.pain <= 3 ? 'optimal' : latest.pain <= 6 ? 'moderate' : 'elevated',
        color: latest.pain <= 3 ? 'emerald' : latest.pain <= 6 ? 'amber' : 'rose'
      },
      hr: {
        value: latest.heartRate || 75,
        status: (latest.heartRate || 75) <= 80 ? 'optimal' : (latest.heartRate || 75) <= 90 ? 'moderate' : 'elevated',
        color: (latest.heartRate || 75) <= 80 ? 'emerald' : (latest.heartRate || 75) <= 90 ? 'amber' : 'rose'
      },
      activity: {
        value: latest.activity,
        status: latest.activity >= 7 ? 'optimal' : latest.activity >= 4 ? 'moderate' : 'low',
        color: latest.activity >= 7 ? 'emerald' : latest.activity >= 4 ? 'amber' : 'rose'
      }
    };
  };

  // Calculate next milestone
  const getNextMilestone = () => {
    if (entries.length === 0) return { title: 'Begin Recovery Tracking', days: 0, progress: 0 };
    
    const avgPain = entries.slice(-3).reduce((sum, e) => sum + e.pain, 0) / Math.min(3, entries.length);
    
    if (avgPain > 5) {
      return { title: 'Pain Management', days: 7, progress: 35 };
    } else if (avgPain > 2) {
      return { title: 'Mobility Restoration', days: 14, progress: 65 };
    } else {
      return { title: 'Full Recovery', days: 21, progress: 85 };
    }
  };

  // Get monitoring alerts
  const getActiveAlerts = () => {
    const alerts = [];
    
    if (entries.length === 0) {
      return [{ type: 'info', message: 'System ready - awaiting first data entry', icon: CheckCircle, color: 'slate' }];
    }

    if (insights?.anomalies && insights.anomalies.length > 0) {
      alerts.push({ 
        type: 'warning', 
        message: `${insights.anomalies.length} anomal${insights.anomalies.length > 1 ? 'ies' : 'y'} detected`,
        icon: AlertCircle,
        color: 'rose'
      });
    }

    if (insights?.pain_trend?.direction === 'increasing') {
      alerts.push({
        type: 'warning',
        message: 'Pain levels trending upward',
        icon: TrendingDown,
        color: 'amber'
      });
    }

    if (insights?.activity_trend?.direction === 'decreasing') {
      alerts.push({
        type: 'warning',
        message: 'Activity declining - encourage movement',
        icon: Target,
        color: 'amber'
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        type: 'success',
        message: 'All vitals within expected ranges',
        icon: CheckCircle,
        color: 'emerald'
      });
    }

    return alerts.slice(0, 2); // Max 2 alerts
  };

  const vitals = getVitalStatus();
  const milestone = getNextMilestone();
  const alerts = getActiveAlerts();

  return (
    <div className="bento-card row-span-2 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600 mb-1">Live Monitoring</p>
          <h3 className="text-xl font-bold text-slate-900">Clinical Status</h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Shield size={24} className="text-white" />
        </div>
      </div>

      {/* Real-time Vitals Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`p-3 rounded-xl bg-${vitals.pain.color}-50 border border-${vitals.pain.color}-100`}>
          <p className="text-[9px] font-black uppercase text-slate-600 mb-1">Pain</p>
          <p className={`text-2xl font-black text-${vitals.pain.color}-600`}>
            {vitals.pain.value}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className={`h-0.5 flex-1 rounded-full ${
                  vitals.pain.status === 'optimal' ? 'bg-emerald-400' :
                  vitals.pain.status === 'moderate' && i < 2 ? 'bg-amber-400' :
                  vitals.pain.status === 'elevated' ? 'bg-rose-400' :
                  'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className={`p-3 rounded-xl bg-${vitals.hr.color}-50 border border-${vitals.hr.color}-100`}>
          <p className="text-[9px] font-black uppercase text-slate-600 mb-1">HR</p>
          <p className={`text-2xl font-black text-${vitals.hr.color}-600`}>
            {vitals.hr.value}
          </p>
          <p className="text-[8px] font-bold text-slate-500 mt-1">bpm</p>
        </div>

        <div className={`p-3 rounded-xl bg-${vitals.activity.color}-50 border border-${vitals.activity.color}-100`}>
          <p className="text-[9px] font-black uppercase text-slate-600 mb-1">Activity</p>
          <p className={`text-2xl font-black text-${vitals.activity.color}-600`}>
            {vitals.activity.value}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className={`h-0.5 flex-1 rounded-full ${
                  vitals.activity.status === 'optimal' ? 'bg-emerald-400' :
                  vitals.activity.status === 'moderate' && i < 2 ? 'bg-amber-400' :
                  vitals.activity.status === 'low' && i < 1 ? 'bg-rose-400' :
                  'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Target size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-900">{milestone.title}</p>
            <p className="text-[10px] text-slate-600">Estimated {milestone.days} days</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-indigo-600">{milestone.progress}%</p>
          </div>
        </div>
        <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
      </div>

      {/* Active Monitoring Alerts */}
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase text-slate-600 mb-3 tracking-wider">Active Monitoring</p>
        <div className="space-y-2">
          {alerts.map((alert, i) => {
            const Icon = alert.icon;
            return (
              <div key={i} className={`p-3 rounded-xl bg-${alert.color}-50 border border-${alert.color}-100 flex items-start gap-3`}>
                <Icon size={16} className={`text-${alert.color}-600 flex-shrink-0 mt-0.5`} />
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">{alert.message}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Status Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-bold text-slate-600">Monitoring Active</p>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock size={12} />
          <p className="text-[9px] font-bold">Real-time</p>
        </div>
      </div>
    </div>
  );
}
