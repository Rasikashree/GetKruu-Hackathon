import React from 'react';
import { Shield, AlertTriangle, Activity, Heart, Thermometer, TrendingDown, TrendingUp } from 'lucide-react';

interface RiskAssessmentProps {
  insights: any;
  entries: any[];
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ insights, entries }) => {
  const calculateRiskScore = () => {
    if (!insights?.baseline || entries.length < 3) {
      return { score: 0, level: 'low', message: 'Insufficient data for risk assessment' };
    }

    let riskPoints = 0;
    const latest = entries[entries.length - 1];

    // Pain risk
    if (latest?.pain_level >= 7) riskPoints += 30;
    else if (latest?.pain_level >= 5) riskPoints += 15;

    // Temperature risk
    if (latest?.temperature >= 38.0) riskPoints += 40;
    else if (latest?.temperature >= 37.5) riskPoints += 20;

    // Heart rate risk (adjusted for activity)
    const expectedHR = insights.baseline.hr_baseline;
    if (latest?.heart_rate > expectedHR + 20) riskPoints += 25;
    else if (latest?.heart_rate > expectedHR + 10) riskPoints += 10;

    // Trend risk
    if (insights.trends?.pain?.direction === 'increasing') riskPoints += 15;
    if (insights.trends?.recovery_velocity < 0) riskPoints += 20;

    const score = Math.min(100, riskPoints);
    
    let level: 'low' | 'moderate' | 'high';
    let message: string;
    
    if (score < 30) {
      level = 'low';
      message = 'Recovery progressing well with minimal risk factors';
    } else if (score < 60) {
      level = 'moderate';
      message = 'Some risk factors detected - monitor closely';
    } else {
      level = 'high';
      message = 'Multiple risk factors - consider medical consultation';
    }

    return { score, level, message };
  };

  const getRiskFactors = () => {
    if (!insights?.baseline || entries.length < 3) return [];

    const factors = [];
    const latest = entries[entries.length - 1];

    if (latest?.pain_level >= 7) {
      factors.push({
        factor: 'Severe Pain',
        severity: 'high',
        description: `Pain level ${latest.pain_level}/10 exceeds normal range`,
        icon: AlertTriangle
      });
    }

    if (latest?.temperature >= 38.0) {
      factors.push({
        factor: 'Elevated Temperature',
        severity: 'high',
        description: `Temperature ${latest.temperature}°C may indicate infection`,
        icon: Thermometer
      });
    }

    if (insights.trends?.pain?.direction === 'increasing') {
      factors.push({
        factor: 'Worsening Pain Trend',
        severity: 'moderate',
        description: 'Pain levels increasing over time',
        icon: TrendingUp
      });
    }

    if (insights.trends?.activity?.direction === 'declining') {
      factors.push({
        factor: 'Reduced Activity',
        severity: 'moderate',
        description: 'Activity levels declining - may slow recovery',
        icon: TrendingDown
      });
    }

    if (latest?.heart_rate > (insights.baseline.hr_baseline + 15)) {
      factors.push({
        factor: 'Elevated Heart Rate',
        severity: 'moderate',
        description: `HR ${latest.heart_rate} bpm above baseline`,
        icon: Heart
      });
    }

    return factors;
  };

  const getProtectiveFactors = () => {
    const factors = [];
    
    if (entries.length >= 7) {
      factors.push('Consistent monitoring (7+ day streak)');
    }
    
    if (insights?.trends?.pain?.direction === 'decreasing') {
      factors.push('Pain trending downward');
    }
    
    if (insights?.trends?.activity?.direction === 'improving') {
      factors.push('Increasing activity levels');
    }
    
    if (insights?.recovery_score >= 70) {
      factors.push('High recovery score');
    }

    return factors;
  };

  const risk = calculateRiskScore();
  const riskFactors = getRiskFactors();
  const protectiveFactors = getProtectiveFactors();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'from-rose-500 to-red-500';
      case 'moderate':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-emerald-500 to-teal-500';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-rose-50 border-rose-200';
      case 'moderate':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="bento-card flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Shield size={20} className="text-purple-500" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Risk Assessment</h3>
            <p className="text-lg font-bold text-slate-900">Complication Monitor</p>
          </div>
        </div>
      </div>

      {/* Risk Score */}
      <div className={`relative p-6 rounded-2xl border-2 mb-6 ${getRiskBgColor(risk.level)}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-600 mb-1">Risk Level</div>
            <div className={`text-2xl font-black uppercase ${
              risk.level === 'high' ? 'text-rose-700' :
              risk.level === 'moderate' ? 'text-amber-700' :
              'text-emerald-700'
            }`}>
              {risk.level}
            </div>
          </div>
          <div className="relative w-20 h-20">
            <svg className="transform -rotate-90 w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-slate-200"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - risk.score / 100)}`}
                className={`${
                  risk.level === 'high' ? 'text-rose-500' :
                  risk.level === 'moderate' ? 'text-amber-500' :
                  'text-emerald-500'
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black text-slate-700">{risk.score}</span>
            </div>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-700">{risk.message}</p>
      </div>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Active Risk Factors</h4>
          <div className="space-y-2">
            {riskFactors.map((rf, idx) => {
              const Icon = rf.icon;
              return (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border ${
                    rf.severity === 'high' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon size={16} className={rf.severity === 'high' ? 'text-rose-500 mt-0.5' : 'text-amber-500 mt-0.5'} />
                    <div className="flex-1">
                      <div className="text-xs font-black text-slate-700 mb-1">{rf.factor}</div>
                      <div className="text-xs font-medium text-slate-600">{rf.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Protective Factors */}
      {protectiveFactors.length > 0 && (
        <div className="mt-auto">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Protective Factors</h4>
          <div className="space-y-2">
            {protectiveFactors.map((pf, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                <Activity size={12} className="text-emerald-500" />
                {pf}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
