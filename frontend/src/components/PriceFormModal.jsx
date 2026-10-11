import React, { useState, useEffect } from 'react';
import { X, Sprout } from 'lucide-react';
import { priceAPI } from '../api/client';

export const PriceFormModal = ({
  isOpen,
  onClose,
  priceToEdit,
  initialData,
  onSaved,
  onSuccess,
  marketsList = [],
}) => {
  const dataToUse = priceToEdit || initialData;
  const callbackSuccess = onSaved || onSuccess;

  const [formData, setFormData] = useState({
    cropName: '',
    category: 'Cereals',
    variety: 'FAQ Standard',
    market: '',
    state: 'Maharashtra',
    district: '',
    modalPrice: '',
    minPrice: '',
    maxPrice: '',
    arrivalVolume: 120,
    qualityGrade: 'Grade A (FAQ)',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (dataToUse) {
      setFormData({
        cropName: dataToUse.cropName || '',
        category: dataToUse.category || 'Cereals',
        variety: dataToUse.variety || 'FAQ Standard',
        market: dataToUse.market || '',
        state: dataToUse.state || 'Maharashtra',
        district: dataToUse.district || '',
        modalPrice: dataToUse.modalPrice || '',
        minPrice: dataToUse.minPrice || '',
        maxPrice: dataToUse.maxPrice || '',
        arrivalVolume: dataToUse.arrivalVolume || 120,
        qualityGrade: dataToUse.qualityGrade || 'Grade A (FAQ)',
      });
    } else {
      setFormData({
        cropName: '',
        category: 'Cereals',
        variety: 'FAQ Standard',
        market: marketsList[0] || 'Azadpur Mandi - Delhi',
        state: 'Delhi',
        district: '',
        modalPrice: '',
        minPrice: '',
        maxPrice: '',
        arrivalVolume: 150,
        qualityGrade: 'Grade A (FAQ)',
      });
    }
  }, [dataToUse, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.cropName || !formData.market || !formData.modalPrice) {
      setError('Please provide Crop Name, Market, and Modal Price');
      return;
    }

    try {
      setSaving(true);
      if (dataToUse?._id) {
        await priceAPI.updatePrice(dataToUse._id, formData);
      } else {
        await priceAPI.createPrice(formData);
      }
      if (callbackSuccess) callbackSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save crop price record');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl rounded-3xl bg-white border border-slate-100 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Sprout className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">
                {dataToUse ? 'Edit Mandi Crop Price' : 'Add New Mandi Crop Price'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Official APMC daily market quotation entry
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

        {/* Error message */}
        {error && (
          <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Crop / Commodity Name</label>
              <input
                type="text"
                name="cropName"
                required
                placeholder="e.g. Wheat, Basmati Rice, Onion"
                value={formData.cropName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
              >
                <option value="Cereals">Cereals</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Oilseeds">Oilseeds</option>
                <option value="Pulses">Pulses</option>
                <option value="Fiber">Fiber</option>
                <option value="Spices">Spices</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Variety / Commercial Name</label>
              <input
                type="text"
                name="variety"
                placeholder="e.g. Lokwan, Desi, Red Globe"
                value={formData.variety}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mandi Terminal Market</label>
              <input
                type="text"
                name="market"
                required
                placeholder="e.g. Lasalgaon Mandi - Nashik"
                value={formData.market}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Modal Price (₹/Quintal)</label>
              <input
                type="number"
                name="modalPrice"
                required
                min="100"
                placeholder="e.g. 2450"
                value={formData.modalPrice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Min Price (₹)</label>
              <input
                type="number"
                name="minPrice"
                placeholder="e.g. 2200"
                value={formData.minPrice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                placeholder="e.g. 2650"
                value={formData.maxPrice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Arrivals Volume (Quintals)</label>
              <input
                type="number"
                name="arrivalVolume"
                value={formData.arrivalVolume}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Quality Grade</label>
              <input
                type="text"
                name="qualityGrade"
                value={formData.qualityGrade}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              {saving ? 'Saving...' : dataToUse ? 'Update Price' : 'Publish to Mandi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
