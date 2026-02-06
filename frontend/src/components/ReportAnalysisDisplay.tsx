import React from 'react';
import { FileText, Thermometer, Heart, Activity, CheckCircle2, AlertCircle, TrendingUp, Droplets } from 'lucide-react';

interface ReportAnalysisProps {
  reportData: {
    filename: string;
    analysis: string;
    extracted_data?: {
      temperature?: number;
      heart_rate?: number;
      pain_level?: number;
      blood_pressure?: string;
      oxygen_saturation?: number;
      findings?: string[];
    };
    timestamp: string;
  } | null;
}

const ReportAnalysisDisplay: React.FC<ReportAnalysisProps> = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="bento-card h-full flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
          <FileText size={36} className="text-slate-300" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">No Report Uploaded</h3>
        <p className="text-slate-500 font-medium max-w-md">
          Upload a medical report to see AI-powered analysis and extracted metrics here.
        </p>
      </div>
    );
  }

  const { filename, analysis, extracted_data, timestamp } = reportData;
  const data = extracted_data || {};

  return (
    <div className="bento-card h-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Report Analysis</h3>
        </div>
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">AI Insights</h2>
        <p className="text-slate-500 font-medium leading-relaxed line-clamp-1">{filename}</p>
      </div>

      <div className="space-y-8">
        {/* Analysis Summary */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-[2rem] border border-emerald-100">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
              <TrendingUp size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-2">Clinical Summary</h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">{analysis}</p>
            </div>
          </div>
        </div>

        {/* Extracted Vitals */}
        {(data.temperature || data.heart_rate) && (
          <div className="grid grid-cols-2 gap-4">
            {data.temperature && (
              <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                  <Thermometer size={14} className="text-orange-400" /> Temperature
                </label>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-700">{data.temperature}</span>
                  <span className="text-slate-400 font-bold text-xl mb-1">°C</span>
                </div>
              </div>
            )}
            
            {data.heart_rate && (
              <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                  <Heart size={14} className="text-rose-400" /> Heart Rate
                </label>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-700">{data.heart_rate}</span>
                  <span className="text-slate-400 font-bold text-xl mb-1">BPM</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Metrics */}
        {(data.pain_level !== null || data.blood_pressure || data.oxygen_saturation) && (
          <div className="grid grid-cols-3 gap-3">
            {data.pain_level !== null && data.pain_level !== undefined && (
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
                <div className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Pain</div>
                <div className={`text-2xl font-bold ${data.pain_level > 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {data.pain_level}/10
                </div>
              </div>
            )}
            
            {data.blood_pressure && (
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
                <div className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">BP</div>
                <div className="text-2xl font-bold text-slate-700">{data.blood_pressure}</div>
              </div>
            )}
            
            {data.oxygen_saturation && (
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
                <div className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center justify-center gap-1">
                  <Droplets size={10} /> SpO2
                </div>
                <div className="text-2xl font-bold text-blue-600">{data.oxygen_saturation}%</div>
              </div>
            )}
          </div>
        )}

        {/* Findings */}
        {data.findings && data.findings.length > 0 && (
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Key Findings</h4>
            <div className="space-y-2">
              {data.findings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-100">
                  <AlertCircle size={16} className="text-medical-teal mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{finding}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Analyzed</span>
            <span className="text-slate-600 font-black">
              {new Date(timestamp).toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysisDisplay;
