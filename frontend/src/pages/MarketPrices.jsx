import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  RotateCcw,
  GitCompare,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  LineChart,
} from 'lucide-react';
import { priceAPI } from '../api/client';
import { PriceCard } from '../components/PriceCard';
import { PriceHistoryModal } from '../components/PriceHistoryModal';
import { PriceFormModal } from '../components/PriceFormModal';
import { useAuth } from '../context/AuthContext';

export const MarketPrices = ({ onCompareCrop }) => {
  const { isAdmin } = useAuth();
  const [prices, setPrices] = useState([]);
  const [meta, setMeta] = useState({ crops: [], markets: [], categories: [], states: [] });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMarket, setSelectedMarket] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals
  const [historyModalCrop, setHistoryModalCrop] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [priceToEdit, setPriceToEdit] = useState(null);

  const fetchMeta = async () => {
    try {
      const res = await priceAPI.getMeta();
      if (res.data?.success) {
        setMeta(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const params = {
        crop: searchTerm || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        market: selectedMarket !== 'All' ? selectedMarket : undefined,
        state: selectedState !== 'All' ? selectedState : undefined,
        sortBy,
        order,
        limit: 50,
      };
      const res = await priceAPI.getPrices(params);
      if (res.data?.success) {
        setPrices(res.data.prices);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPrices();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory, selectedMarket, selectedState, sortBy, order]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this market price entry?')) {
      try {
        await priceAPI.deletePrice(id);
        fetchPrices();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete record');
      }
    }
  };

  const handleEdit = (price) => {
    setPriceToEdit(price);
    setFormModalOpen(true);
  };

  const handleAddNew = () => {
    setPriceToEdit(null);
    setFormModalOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedMarket('All');
    setSelectedState('All');
    setSortBy('date');
    setOrder('desc');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Banner & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Market Price Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Daily APMC arrivals, modal mandi prices, variety indexing, and market comparisons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Price Action for Admin */}
          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Crop Price</span>
          </button>

          {/* Grid / Table View Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Panel */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by crop name (e.g. Wheat, Tomato, Onion)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              {meta.categories?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Market Filter */}
          <div>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="All">All Mandis</option>
              {meta.markets?.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div>
            <select
              value={`${sortBy}_${order}`}
              onChange={(e) => {
                const [sb, ord] = e.target.value.split('_');
                setSortBy(sb);
                setOrder(ord);
              }}
              className="w-full px-3 py-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="date_desc">Latest Date First</option>
              <option value="price_desc">Highest Price First</option>
              <option value="price_asc">Lowest Price First</option>
              <option value="crop_asc">Crop Name (A-Z)</option>
              <option value="change_desc">Top Gainers (%)</option>
            </select>
          </div>

        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
          <span>
            Found <strong className="text-slate-800">{prices.length}</strong> crop price listings
          </span>
          <button
            onClick={resetFilters}
            className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* 3. Price Content: Grid View or Table View */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium">
          Loading market arrivals and latest mandi rates...
        </div>
      ) : prices.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
          <p className="text-slate-600 font-bold text-base">No crop price records matched your filter.</p>
          <button
            onClick={resetFilters}
            className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prices.map((price) => (
            <PriceCard
              key={price._id}
              price={price}
              onViewHistory={(p) => setHistoryModalCrop(p)}
              onCompare={onCompareCrop}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-4 px-5">Commodity & Variety</th>
                  <th className="py-4 px-5">Market / Mandi</th>
                  <th className="py-4 px-5">Modal Price (₹/qtl)</th>
                  <th className="py-4 px-5">Price Range (Min - Max)</th>
                  <th className="py-4 px-5">Trend</th>
                  <th className="py-4 px-5">Arrivals</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {prices.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">
                      <div>{p.cropName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {p.variety} • {p.category}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-800">{p.market}</div>
                      <div className="text-[10px] text-slate-400">{p.state}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-sm font-extrabold text-slate-900">
                        ₹{p.modalPrice.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      ₹{p.minPrice} - ₹{p.maxPrice}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          p.trend === 'up'
                            ? 'text-emerald-600'
                            : p.trend === 'down'
                            ? 'text-rose-500'
                            : 'text-slate-400'
                        }`}
                      >
                        {p.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                        {p.trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                        {p.priceChangePercentage > 0 ? `+${p.priceChangePercentage}%` : `${p.priceChangePercentage}%`}
                      </span>
                    </td>
                    <td className="py-4 px-5">{p.arrivalVolume} qtl</td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => setHistoryModalCrop(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        History
                      </button>
                      <button
                        onClick={() => onCompareCrop(p.cropName)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200"
                      >
                        Compare
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-1 rounded text-slate-400 hover:text-amber-600"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModalCrop && (
        <PriceHistoryModal
          cropData={historyModalCrop}
          onClose={() => setHistoryModalCrop(null)}
        />
      )}

      {/* Add / Edit Form Modal */}
      {formModalOpen && (
        <PriceFormModal
          isOpen={formModalOpen}
          initialData={priceToEdit}
          onClose={() => setFormModalOpen(false)}
          onSuccess={() => {
            fetchPrices();
            setFormModalOpen(false);
          }}
        />
      )}

    </div>
  );
};
