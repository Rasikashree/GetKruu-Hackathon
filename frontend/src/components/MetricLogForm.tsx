import React, { useState } from 'react';
import { Thermometer, Heart, CheckCircle2, Waves } from 'lucide-react';

interface MetricLogFormProps {
  onLog: (metrics: any) => void;
}

const MetricLogForm: React.FC<MetricLogFormProps> = ({ onLog }) => {
  const [painLevel, setPainLevel] = useState(0);
  const [temperature, setTemperature] = useState(37.0);
  const [heartRate, setHeartRate] = useState(72);
  const [activityLevel, setActivityLevel] = useState('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      onLog({
        timestamp: new Date().toISOString(),
        pain_level: painLevel,
        temperature,
        heart_rate: heartRate,
        activity_level: activityLevel,
      });
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="bento-card h-full">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
            <CheckCircle2 size={16} className="text-teal-500" />
          </div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Telemetry Entry</h3>
        </div>
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Daily Check-in</h2>
        <p className="text-slate-500 font-medium leading-relaxed">Please update your current metrics for clinical AI analysis.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <div className="flex justify-between items-center mb-6">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <Waves size={16} className="text-teal-500" /> Comfort Level
            </label>
            <div className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${painLevel > 5 ? 'bg-rose-100 text-rose-600' : 'bg-teal-100 text-teal-600'}`}>
              LEVEL {painLevel}
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={painLevel}
            onChange={(e) => setPainLevel(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.2em]">
            <span>Peaceful</span>
            <span>Distressed</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 group hover:border-teal-200 transition-all">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2">
              <Thermometer size={14} className="text-orange-400" /> Temperature
            </label>
            <div className="flex items-end gap-2">
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full bg-transparent text-3xl font-bold text-slate-700 outline-none"
              />
              <span className="text-slate-400 font-bold text-xl mb-1">°C</span>
            </div>
          </div>
          
          <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 group hover:border-rose-200 transition-all">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2">
              <Heart size={14} className="text-rose-400" /> Heart Rate
            </label>
            <div className="flex items-end gap-2">
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(parseInt(e.target.value))}
                className="w-full bg-transparent text-3xl font-bold text-slate-700 outline-none"
              />
              <span className="text-slate-400 font-bold text-xl mb-1">BPM</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-5 uppercase tracking-widest">Movement Today</label>
          <div className="flex gap-3 bg-slate-100/50 p-2 rounded-[1.5rem] border border-slate-200/50">
            {['Low', 'Medium', 'High'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setActivityLevel(level)}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                  activityLevel === level
                    ? 'bg-white text-teal-600 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
            isSubmitting 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-900 text-white hover:bg-black hover:scale-[1.02] shadow-xl active:scale-95'
          }`}
        >
          {isSubmitting ? (
            <span className="animate-pulse">RECORDING...</span>
          ) : (
            <>LOG PROGRESS <CheckCircle2 size={18} /></>
          )}
        </button>
      </form>
    </div>
  );
};

export default MetricLogForm;
