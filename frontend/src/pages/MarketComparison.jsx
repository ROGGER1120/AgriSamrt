import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  TrendingUp,
  Sparkles,
  MapPin,
  Filter,
  BarChart3,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { priceAPI } from '../api/client';
import { ProfitCalculator } from '../components/ProfitCalculator';

export const MarketComparison = ({ initialCrop = 'Wheat' }) => {
  const [cropsList, setCropsList] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch available crops
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await priceAPI.getMeta();
        if (res.data?.success && res.data.crops?.length > 0) {
          setCropsList(res.data.crops);
          if (!res.data.crops.includes(selectedCrop)) {
            setSelectedCrop(res.data.crops[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch crops meta:', err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch comparison data for selected crop
  useEffect(() => {
    const fetchComparison = async () => {
      if (!selectedCrop) return;
      try {
        setLoading(true);
        setError('');
        const res = await priceAPI.comparePrices(selectedCrop);
        if (res.data?.success) {
          setComparisonData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'No market comparison records found for this crop');
        setComparisonData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [selectedCrop]);

  const chartData = (comparisonData?.comparison || []).map((m) => ({
    name: m.market.split(' - ')[0],
    fullName: m.market,
    price: m.modalPrice,
    isHighest: m.isHighest,
    isLowest: m.isLowest,
    state: m.state,
  }));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header & Crop Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Mandi Price Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Compare Market Prices Across Mandis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium leading-relaxed">
            Real-time price variations across states. Identify premium buyer markets, calculate price spreads, and maximize your farm revenue before harvesting or loading transport.
          </p>
        </div>

        {/* Crop Selector Pills */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Select Crop:
          </span>
          {cropsList.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCrop === crop
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {crop === 'Wheat' && '🌾 '}
              {crop === 'Tomato' && '🍅 '}
              {crop === 'Onion' && '🧅 '}
              {crop === 'Basmati Rice' && '🍚 '}
              {crop === 'Cotton' && '☁️ '}
              {crop === 'Soybean' && '🌱 '}
              {crop === 'Potato' && '🥔 '}
              {crop === 'Mustard' && '🌼 '}
              {crop === 'Green Chilli' && '🌶️ '}
              {crop}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 font-medium">
          Analyzing regional mandi rates for {selectedCrop}...
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-slate-500 font-medium">
          {error}
        </div>
      ) : comparisonData ? (
        <>
          {/* 2. Key Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Highest Price Market */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200 shadow-[0_4px_25px_rgba(16,185,129,0.06)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Highest Paying Mandi
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  BEST RATE
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                ₹{comparisonData.highestMarket?.modalPrice?.toLocaleString()}
                <span className="text-xs font-medium text-slate-400"> /qtl</span>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1 truncate">
                {comparisonData.highestMarket?.market}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">{comparisonData.highestMarket?.state}</p>
            </div>

            {/* Lowest Price Market */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                  Lowest Paying Mandi
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                  MIN RATE
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                ₹{comparisonData.lowestMarket?.modalPrice?.toLocaleString()}
                <span className="text-xs font-medium text-slate-400"> /qtl</span>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1 truncate">
                {comparisonData.lowestMarket?.market}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">{comparisonData.lowestMarket?.state}</p>
            </div>

            {/* Spread Difference */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-[0_4px_25px_rgba(245,158,11,0.06)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Cross-Mandi Spread
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                  SPREAD GAP
                </span>
              </div>
              <div className="text-2xl font-extrabold text-amber-600">
                +₹{comparisonData.spreadDifference?.toLocaleString()}
                <span className="text-xs font-medium text-slate-400"> /qtl</span>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1">
                {comparisonData.spreadPercentage}% Price Advantage
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Difference between best & min</p>
            </div>

            {/* Average Market Rate */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  National Benchmark
                </span>
                <span className="text-xs text-slate-400 font-medium">{comparisonData.totalMarkets} Markets</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                ₹{comparisonData.averagePrice?.toLocaleString()}
                <span className="text-xs font-medium text-slate-400"> /qtl</span>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1">
                Weighted Average
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Across reporting APMCs</p>
            </div>

          </div>

          {/* 3. Comparative Bar Chart */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-800">
                    {selectedCrop} — Price Comparison by Mandi (₹/Quintal)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Visual spread comparison across trading terminals
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Highest Mandi
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span> Lowest Mandi
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span> Other Mandis
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '16px',
                      fontSize: '12px',
                      color: '#1e293b',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                    }}
                    formatter={(val, name, item) => [
                      `₹${val} / Quintal`,
                      `${item.payload.fullName} (${item.payload.state})`,
                    ]}
                  />
                  <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.isHighest
                            ? '#059669'
                            : entry.isLowest
                            ? '#f43f5e'
                            : '#94a3b8'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Comparison Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">
                Detailed Terminal Breakdown for {selectedCrop}
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Sorted by modal rate
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-5">Mandi Market</th>
                    <th className="py-4 px-5">State</th>
                    <th className="py-4 px-5">Modal Price (₹/qtl)</th>
                    <th className="py-4 px-5">Range (Min - Max)</th>
                    <th className="py-4 px-5">Arrival Volume</th>
                    <th className="py-4 px-5">Spread vs Average</th>
                    <th className="py-4 px-5 text-right">Mandi Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {(comparisonData.comparison || []).map((m) => {
                    const diff = m.modalPrice - comparisonData.averagePrice;
                    return (
                      <tr
                        key={m._id}
                        className={`hover:bg-slate-50 transition-colors ${
                          m.isHighest ? 'bg-emerald-50/40' : m.isLowest ? 'bg-rose-50/20' : ''
                        }`}
                      >
                        <td className="py-4 px-5 font-bold text-slate-900">
                          {m.market}
                        </td>
                        <td className="py-4 px-5">{m.state}</td>
                        <td className="py-4 px-5">
                          <span className="text-sm font-extrabold text-slate-900">
                            ₹{m.modalPrice.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-5">₹{m.minPrice} - ₹{m.maxPrice}</td>
                        <td className="py-4 px-5">{m.arrivalVolume} qtl</td>
                        <td className="py-4 px-5">
                          <span
                            className={`font-bold ${
                              diff > 0
                                ? 'text-emerald-600'
                                : diff < 0
                                ? 'text-rose-500'
                                : 'text-slate-400'
                            }`}
                          >
                            {diff > 0 ? `+₹${Math.round(diff)}` : `₹${Math.round(diff)}`}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          {m.isHighest && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                              ★ Top Price
                            </span>
                          )}
                          {m.isLowest && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              Lowest Rate
                            </span>
                          )}
                          {!m.isHighest && !m.isLowest && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              Standard
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Freight & Transport Profit Calculator */}
          <ProfitCalculator
            cropName={selectedCrop}
            highestMarket={comparisonData.highestMarket}
            lowestMarket={comparisonData.lowestMarket}
          />
        </>
      ) : null}

    </div>
  );
};
