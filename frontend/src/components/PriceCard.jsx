import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Star,
  MapPin,
  Package,
  LineChart,
  GitCompare,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PriceCard = ({
  price,
  onViewHistory,
  onCompare,
  onEdit,
  onDelete,
}) => {
  const { user, toggleFavorite, isAdmin } = useAuth();
  const isFav = user?.favoriteCrops?.includes(price.cropName);
  const isUp = price.trend === 'up';

  const getCropEmoji = (name) => {
    switch (name) {
      case 'Wheat': return '🌾';
      case 'Tomato': return '🍅';
      case 'Onion': return '🧅';
      case 'Potato': return '🥔';
      case 'Basmati Rice': return '🍚';
      case 'Cotton': return '☁️';
      case 'Soybean': return '🌱';
      case 'Mustard': return '🌼';
      case 'Green Chilli': return '🌶️';
      case 'Apple': return '🍎';
      case 'Mango': return '🥭';
      default: return '🌿';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all flex flex-col justify-between relative group">
      
      {/* Top Header: Crop Icon, Name, Variety, and Favorite Star */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-center justify-center text-xl shrink-0 shadow-xs">
              {getCropEmoji(price.cropName)}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base leading-tight group-hover:text-emerald-600 transition-colors">
                {price.cropName}
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                {price.variety} • {price.category}
              </span>
            </div>
          </div>

          {/* Favorite Star Button */}
          <button
            onClick={() => toggleFavorite(price.cropName)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isFav
                ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-xs'
                : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isFav ? 'Remove from favorite crops' : 'Add to favorite crops'}
          >
            <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
          </button>
        </div>

        {/* Mandi & Location Pill */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3 bg-[#f8fafc] px-3 py-2 rounded-2xl border border-slate-100">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate font-semibold text-slate-700">{price.market}</span>
          <span className="text-[11px] text-slate-400 ml-auto shrink-0 font-medium">
            ({price.state})
          </span>
        </div>

        {/* Price Box */}
        <div className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-100 mb-3">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Modal Price
            </span>
            <span
              className={`text-xs font-bold flex items-center gap-0.5 ${
                isUp
                  ? 'text-emerald-600'
                  : price.trend === 'down'
                  ? 'text-rose-500'
                  : 'text-slate-400'
              }`}
            >
              {isUp ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : price.trend === 'down' ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : null}
              {price.priceChange > 0 ? `+₹${price.priceChange}` : price.priceChange < 0 ? `₹${price.priceChange}` : '0.00'}{' '}
              ({price.priceChangePercentage}%)
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹{price.modalPrice.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/quintal</span>
          </div>

          {/* Highest & Lowest Range Indicators */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">
              Range: <strong className="text-slate-700">₹{price.minPrice}</strong> - <strong className="text-slate-700">₹{price.maxPrice}</strong>
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-semibold">
              <Package className="w-3 h-3 text-emerald-600" />
              {price.arrivalVolume} qtl
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: History, Compare, and Admin (Edit/Delete) */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          {onViewHistory && (
            <button
              onClick={() => onViewHistory(price)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="View 15-day price oscillation history"
            >
              <LineChart className="w-3.5 h-3.5 text-emerald-600" />
              <span>History</span>
            </button>
          )}

          {onCompare && (
            <button
              onClick={() => onCompare(price.cropName)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-200"
              title="Compare prices across mandis"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>
          )}
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(price)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                title="Edit Mandi Price"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(price._id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
