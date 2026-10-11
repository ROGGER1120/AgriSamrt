import React, { useState } from 'react';
import {
  Calculator,
  Truck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const ProfitCalculator = ({ crop, cropName, markets = [], highestMarket, lowestMarket }) => {
  const [quantity, setQuantity] = useState(50); // in quintals

  const activeCrop = cropName || crop || 'Selected Crop';

  // Construct market list from either props
  const marketList = markets.length > 0 
    ? markets 
    : [highestMarket, lowestMarket].filter(Boolean);

  if (marketList.length === 0) return null;

  const localMarket = marketList[marketList.length - 1];
  const localGross = quantity * (localMarket?.modalPrice || 2000);

  // Compute net earnings for each market
  const marketAnalysis = marketList.map((m) => {
    const gross = quantity * m.modalPrice;
    const distanceKm = m.transportBenchmarkKm || 65;
    const transportTotal = Math.round(quantity * (distanceKm * 0.15 + 15) * 1.5);
    const netEarnings = gross - transportTotal;
    const diffVsLocal = netEarnings - localGross;

    return {
      ...m,
      gross,
      transportTotal,
      netEarnings,
      diffVsLocal,
    };
  });

  // Find best market by net profit
  const bestMarket = [...marketAnalysis].sort((a, b) => b.netEarnings - a.netEarnings)[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Farmer Net Profit & Transport Arbitrage Calculator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Simulate your net earnings after freight & diesel costs for {activeCrop}.
          </p>
        </div>

        {/* Input for Quantity */}
        <div className="flex items-center gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
              Quantity to Sell:
            </label>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#f8fafc] border border-slate-200">
              <input
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-16 bg-transparent text-slate-800 font-extrabold text-sm focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-medium">Quintals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Destination Highlight */}
      {bestMarket && (
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Optimal Selling Destination
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  Max Net Payout
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-800 mt-0.5">
                {bestMarket.market}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Modal rate: <strong className="text-emerald-700">₹{bestMarket.modalPrice}/qtl</strong> ({bestMarket.state})
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-emerald-200 sm:pl-6 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium block">Estimated Net Revenue</span>
            <div className="text-2xl font-black text-emerald-700">
              ₹{bestMarket.netEarnings.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              (After deducting ₹{bestMarket.transportTotal.toLocaleString()} freight)
            </span>
          </div>
        </div>
      )}

      {/* Market Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {marketAnalysis.map((item) => {
          const isBest = item.market === bestMarket?.market;
          return (
            <div
              key={item.market}
              className={`p-4 rounded-2xl border transition-all ${
                isBest
                  ? 'bg-white border-emerald-400 shadow-sm'
                  : 'bg-[#f8fafc] border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h5 className="font-bold text-slate-800 text-xs leading-tight">
                  {item.market}
                </h5>
                {isBest && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shrink-0">
                    BEST CHOICE
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between text-xs mb-3">
                <span className="text-slate-400">Modal Price:</span>
                <span className="font-extrabold text-slate-800">₹{item.modalPrice} /qtl</span>
              </div>

              <div className="space-y-1.5 py-2 border-t border-slate-200/60 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Gross Value ({quantity} qtl):</span>
                  <span className="font-bold text-slate-700">₹{item.gross.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" /> Freight Estimate:
                  </span>
                  <span className="text-rose-500 font-bold">- ₹{item.transportTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200/60 font-bold">
                  <span className="text-slate-700">Net Farmer Payout:</span>
                  <span className="text-emerald-700 font-extrabold">₹{item.netEarnings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
