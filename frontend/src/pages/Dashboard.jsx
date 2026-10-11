import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Building2,
  TrendingUp,
  TrendingDown,
  Star,
  CloudSun,
  GitCompare,
  ArrowRight,
  BarChart3,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { priceAPI, weatherAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { PriceCard } from '../components/PriceCard';
import { PriceHistoryModal } from '../components/PriceHistoryModal';

export const Dashboard = ({ onNavigate, onCompareCrop }) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [allPrices, setAllPrices] = useState([]);
  const [weatherGlance, setWeatherGlance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [historyModalCrop, setHistoryModalCrop] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [sumRes, priceRes, weaRes] = await Promise.all([
          priceAPI.getSummary(),
          priceAPI.getPrices({ limit: 40 }),
          weatherAPI.getWeather(user?.district || 'Nashik'),
        ]);

        if (sumRes.data?.success) setSummary(sumRes.data);
        if (priceRes.data?.success) setAllPrices(priceRes.data.prices);
        if (weaRes.data?.success) setWeatherGlance(weaRes.data.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Favorite crops filter
  const favoritePrices = allPrices.filter((p) =>
    user?.favoriteCrops?.includes(p.cropName)
  );

  const displayedPrices = showOnlyFavorites ? favoritePrices : allPrices.slice(0, 8);

  // Top crops comparison chart data
  const topCropsChartData = allPrices.slice(0, 7).map((p) => ({
    name: p.cropName,
    price: p.modalPrice,
    market: p.market.split(' - ')[0],
  }));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Banner & Weather Quick Glance */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              🌾 Kisan Agri-Intelligence
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Namaste, {user?.name || 'Albert Flores'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-xl">
            Live mandi prices, price oscillations across state terminals, and instant agricultural weather telemetry.
          </p>
        </div>

        {/* Weather Glance Card */}
        {weatherGlance && (
          <div
            onClick={() => onNavigate('weather')}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:border-emerald-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] cursor-pointer transition-all flex items-center gap-4 shrink-0"
            title="Click to view detailed Weather Dashboard"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CloudSun className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <span>{weatherGlance.city}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-xl font-extrabold text-slate-800">
                {weatherGlance.current?.temp}°C
                <span className="text-xs font-semibold text-slate-400 ml-1.5">
                  {weatherGlance.current?.condition}
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">
                {weatherGlance.current?.rainProbability}% Rain • {weatherGlance.current?.humidity}% Humidity
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Crops Monitored */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Crops Monitored
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {summary?.stats?.totalCropsCount || 12}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Active Commodities
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sprout className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Total Mandis Connected */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Connected Mandis
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {summary?.stats?.totalMarketsCount || 8}
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              APMC Terminals
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Highest Market Price */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Peak Value Crop
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              ₹{summary?.stats?.highestPriced?.price?.toLocaleString() || '14,200'}
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-1 truncate max-w-[130px]">
              {summary?.stats?.highestPriced?.crop || 'Green Chilli'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* Favorite Watchlist Count */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Favourite Crops
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {user?.favoriteCrops?.length || 4}
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              In Your Watchlist
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400 stroke-amber-500" />
          </div>
        </div>

      </div>

      {/* 3. Price Comparison Quick Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-[0_4px_25px_rgba(16,185,129,0.06)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-600/20 shrink-0">
            <GitCompare className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                PRO RECOMMENDED
              </span>
              <span className="text-xs text-slate-400 font-semibold">Maximize Mandi Realization</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-1">
              Cross-Market Price Comparison Tool
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl font-medium">
              Check alternate mandis before harvesting. Farmers gain up to ₹350 - ₹700 extra per quintal by choosing the optimal regional terminal.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('compare')}
          className="w-full md:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <span>Compare Mandis Now</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 4. Interactive Charts Section & Recent Price Changes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-800">
                  Prevailing Mandi Rates by Commodity (₹/Quintal)
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Benchmark modal prices across leading agricultural terminals
              </p>
            </div>
            <button
              onClick={() => onNavigate('prices')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              All Prices →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCropsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
                    `${item.payload.name} (${item.payload.market})`,
                  ]}
                />
                <Bar dataKey="price" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Price Changes (Gainers & Corrections) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Recent Price Changes
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-4">
              Top daily gainers and downward corrections
            </p>

            <div className="space-y-3">
              {/* Gainers */}
              {(summary?.topGainers || allPrices.filter((p) => p.trend === 'up').slice(0, 3)).map(
                (g, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {g.cropName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {g.market?.split(' - ')[0] || 'Mandi'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-slate-800">
                        ₹{g.modalPrice}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-0.5">
                        <TrendingUp className="w-3 h-3" /> +{g.priceChangePercentage || 3.5}%
                      </span>
                    </div>
                  </div>
                )
              )}

              {/* Losers */}
              {(summary?.topLosers || allPrices.filter((p) => p.trend === 'down').slice(0, 2)).map(
                (l, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {l.cropName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {l.market?.split(' - ')[0] || 'Mandi'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-slate-800">
                        ₹{l.modalPrice}
                      </div>
                      <span className="text-[10px] font-bold text-rose-500 flex items-center justify-end gap-0.5">
                        <TrendingDown className="w-3 h-3" /> {l.priceChangePercentage || -2.1}%
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('prices')}
            className="w-full mt-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all text-center cursor-pointer"
          >
            Explore Complete Mandi Board
          </button>
        </div>

      </div>

      {/* 5. Available Crop Prices Grid with Favorite Toggle */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
              {showOnlyFavorites ? '⭐ Favourite Crops Watchlist' : 'Available Mandi Crop Prices'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Real-time daily modal rates and arrival metrics reported across verified APMCs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showOnlyFavorites
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-white' : ''}`} />
              <span>{showOnlyFavorites ? 'Showing Favorites' : 'Filter Favorites'}</span>
            </button>

            <button
              onClick={() => onNavigate('prices')}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition cursor-pointer"
            >
              View All ({allPrices.length})
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedPrices.map((price) => (
            <PriceCard
              key={price._id}
              price={price}
              onViewHistory={(p) => setHistoryModalCrop(p)}
              onCompare={onCompareCrop}
            />
          ))}
        </div>
      </div>

      {/* Price History Modal */}
      {historyModalCrop && (
        <PriceHistoryModal
          cropData={historyModalCrop}
          onClose={() => setHistoryModalCrop(null)}
        />
      )}

    </div>
  );
};
