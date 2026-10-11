import React from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  MapPin,
  Package,
  LineChart,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const PriceHistoryModal = ({ crop, cropData, onClose, onCompare }) => {
  const targetCrop = crop || cropData;
  if (!targetCrop) return null;

  const chartData = (targetCrop.priceHistory || []).map((h) => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: h.modalPrice,
    min: h.minPrice,
    max: h.maxPrice,
    volume: h.volume,
  }));

  const isUp = targetCrop.trend === 'up';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-3xl rounded-3xl bg-white border border-slate-100 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl shadow-xs">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-800">{targetCrop.cropName}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {targetCrop.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">({targetCrop.variety})</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {targetCrop.market} • {targetCrop.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-100">
              <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">Modal Price</span>
              <div className="text-2xl font-extrabold text-slate-900 flex items-baseline gap-1">
                ₹{targetCrop.modalPrice.toLocaleString()}
                <span className="text-xs font-normal text-slate-400">/qtl</span>
              </div>
              <div className={`text-xs mt-1 font-bold flex items-center gap-1 ${isUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {targetCrop.priceChange > 0 ? `+₹${targetCrop.priceChange}` : `₹${targetCrop.priceChange}`} ({targetCrop.priceChangePercentage}%)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-100">
              <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">Trading Range</span>
              <div className="text-base sm:text-lg font-extrabold text-slate-800">
                ₹{targetCrop.minPrice} - ₹{targetCrop.maxPrice}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Spread: ₹{targetCrop.maxPrice - targetCrop.minPrice}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-100">
              <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">Arrival Volume</span>
              <div className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-600" />
                {targetCrop.arrivalVolume || 120} qtl
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Daily APMC intake</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-100">
              <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">Quality Grade</span>
              <div className="text-base sm:text-lg font-extrabold text-emerald-700">
                {targetCrop.qualityGrade || 'Grade A (FAQ)'}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Standard certified</span>
            </div>
          </div>

          {/* Price History Area Chart */}
          <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-800">
                  15-Day Historical Price Oscillation (₹/Quintal)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Daily closing auction quotes
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradientLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '16px',
                      fontSize: '12px',
                      color: '#1e293b',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                    }}
                    formatter={(val) => [`₹${val} / Quintal`, 'Modal Price']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#priceGradientLight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-[#f8fafc]">
          <span className="text-xs text-slate-400 font-medium">
            Data sourced from Directorate of Marketing & Inspection (DMI)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
