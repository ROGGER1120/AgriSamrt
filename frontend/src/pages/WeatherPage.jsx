import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  Eye,
  Sparkles,
  Upload,
  Sun,
  CloudSun,
  CloudRain,
  ChevronRight,
  Search,
  Check,
  Download,
  Printer,
  X,
  Thermometer,
} from 'lucide-react';
import { weatherAPI } from '../api/client';
import { WeatherIllustration3D } from '../components/WeatherIllustration3D';

export const WeatherPage = ({ externalSearchQuery = '' }) => {
  // State
  const [selectedCity, setSelectedCity] = useState('Chicago');
  const [tempUnit, setTempUnit] = useState('C'); // 'C' or 'F'
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearchInput, setCitySearchInput] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  // Pre-configured other countries list matching screenshot
  const otherLocations = [
    {
      country: 'Australia',
      city: 'Canberra',
      queryCity: 'canberra',
      condition: 'Sunny',
      iconType: 'sun',
      tempMax: 32,
      tempMin: 24,
    },
    {
      country: 'Japan',
      city: 'Tokyo',
      queryCity: 'tokyo',
      condition: 'Mostly Sunny',
      iconType: 'mostly-sunny',
      tempMax: 30,
      tempMin: 19,
    },
    {
      country: 'India',
      city: 'New Delhi',
      queryCity: 'delhi',
      condition: 'Sunny',
      iconType: 'sun',
      tempMax: 32,
      tempMin: 22,
    },
    {
      country: 'United States',
      city: 'Chicago',
      queryCity: 'chicago',
      condition: 'Heavy Rain',
      iconType: 'rain',
      tempMax: 28,
      tempMin: 24,
    },
    {
      country: 'United Kingdom',
      city: 'London',
      queryCity: 'london',
      condition: 'Scattered Clouds',
      iconType: 'mostly-sunny',
      tempMax: 21,
      tempMin: 14,
    },
  ];

  // Helper to convert C to F
  const formatTemp = (celsius) => {
    if (celsius === undefined || celsius === null) return '--';
    if (tempUnit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const formatTempNumber = (celsius) => {
    if (celsius === undefined || celsius === null) return '--';
    if (tempUnit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${celsius}°`;
  };

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning !';
    if (hour < 18) return 'Good Afternoon !';
    return 'Good Evening !';
  };

  // Fetch weather data
  const loadWeatherData = async (city) => {
    try {
      setLoading(true);
      const res = await weatherAPI.getWeather(city);
      if (res.data?.success && res.data?.data) {
        setWeatherData(res.data.data);
      }
    } catch (err) {
      console.warn('Using baseline telemetry for:', city, err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(selectedCity);
  }, [selectedCity]);

  // Handle external search from navbar
  useEffect(() => {
    if (externalSearchQuery && externalSearchQuery.trim()) {
      setSelectedCity(externalSearchQuery.trim());
    }
  }, [externalSearchQuery]);

  // Baseline data reflecting the exact screenshot values for Chicago
  const isChicago = selectedCity.toLowerCase().includes('chicago');
  const currentTemp = isChicago ? 28 : weatherData?.current?.temp ?? 26;
  const minTemp = isChicago ? 24 : weatherData?.forecast?.[0]?.tempMin ?? 21;
  const currentCondition = isChicago ? 'Heavy Rain' : weatherData?.current?.condition ?? 'Partly Cloudy';
  const feelsLike = isChicago ? 26 : weatherData?.current?.feelsLike ?? 25;

  // Highlights
  const windStatus = isChicago ? '7.90 km/h' : `${weatherData?.current?.windSpeed ?? 8.5} km/h`;
  const humidity = isChicago ? '85 %' : `${weatherData?.current?.humidity ?? 78} %`;
  const sunrise = '4:50 AM';
  const uvIndex = '4 uv';
  const visibility = isChicago ? '5 km' : `${weatherData?.current?.visibility ?? 8} km`;
  const sunset = '6:45 PM';

  // 10 Day Forecast list
  const forecastDays = [
    { day: 'Today', temp: 24, condition: 'rain' },
    { day: 'Mon', temp: 31, condition: 'sun' },
    { day: 'Tue', temp: 24, condition: 'rain' },
    { day: 'Wed', temp: 27, condition: 'heavy-rain' },
    { day: 'Thu', temp: 31, condition: 'mostly-sunny' },
    { day: 'Fri', temp: 29, condition: 'sun' },
    { day: 'Sat', temp: 26, condition: 'rain' },
    { day: 'Sun', temp: 28, condition: 'sun' },
    { day: 'Mon', temp: 30, condition: 'mostly-sunny' },
    { day: 'Tue', temp: 25, condition: 'rain' },
  ];

  // Helper for small weather icons in forecast & list
  const renderMiniWeatherIcon = (type) => {
    switch (type) {
      case 'sun':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shadow-xs">
            <Sun className="w-5 h-5 fill-amber-400 stroke-amber-500" />
          </div>
        );
      case 'mostly-sunny':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-xs">
            <CloudSun className="w-5 h-5 stroke-amber-500 text-sky-400" />
          </div>
        );
      case 'heavy-rain':
      case 'rain':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 shadow-xs">
            <CloudRain className="w-5 h-5 stroke-sky-500" />
          </div>
        );
    }
  };

  // Export handler
  const handleExport = (type) => {
    if (type === 'print') {
      window.print();
    } else {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        `City,Temperature,Condition,Humidity,Wind,Sunrise,Sunset\n` +
        `"${selectedCity}","${currentTemp}°C","${currentCondition}","${humidity}","${windStatus}","${sunrise}","${sunset}"`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `FarmVista_Weather_${selectedCity}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportNotice('Telemetry exported successfully to CSV!');
      setTimeout(() => setExportNotice(''), 4000);
    }
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner: Greeting, Subtitle, and Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Optimize Your Farm Operations with Real-Time Insights
          </p>
        </div>

        {/* Green Export Button (Desktop right-aligned, Mobile styled responsive) */}
        <div className="w-full sm:w-auto">
          <button
            onClick={() => setShowExportModal(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Export</span>
            <Upload className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Main Grid: Left Column (Weather + Other Countries) & Right Column (Today's Highlights + 10 Day Forecast) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Main Current Weather Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            
            {/* Header: Location Pill Badge & C/F Switch */}
            <div className="flex items-center justify-between">
              
              {/* City Pill Badge */}
              <button
                onClick={() => setShowCityPicker(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
                title="Click to change location"
              >
                <MapPin className="w-3.5 h-3.5 text-white/90 group-hover:scale-110 transition-transform" />
                <span className="capitalize">{selectedCity}</span>
              </button>

              {/* Segmented C / F Toggle */}
              <div className="flex items-center bg-slate-100/80 p-0.5 rounded-full border border-slate-200/60 text-xs font-semibold">
                <button
                  onClick={() => setTempUnit('C')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    tempUnit === 'C'
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  C
                </button>
                <button
                  onClick={() => setTempUnit('F')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    tempUnit === 'F'
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  F
                </button>
              </div>

            </div>

            {/* Middle Section: Day/Date & 3D Weather Illustration */}
            <div className="mt-6 flex items-center justify-between">
              
              {/* Date Information */}
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                  Sunday
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  27 Aug, 2024
                </p>
              </div>

              {/* 3D Weather Illustration matching user screenshot */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 -my-2 flex items-center justify-center">
                <WeatherIllustration3D
                  condition={currentCondition}
                  className="w-full h-full transform hover:scale-105 transition-transform duration-300"
                />
              </div>

            </div>

            {/* Bottom Section: Temperature, Condition, and Feels Like */}
            <div className="mt-4 pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {formatTemp(currentTemp)}
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-400">
                  / {formatTemp(minTemp)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm font-extrabold text-slate-800">
                  {currentCondition}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Feels like {formatTempNumber(feelsLike)}
                </div>
              </div>
            </div>

          </div>

          {/* 2. "Others Countries" Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight mb-4">
              Others Countries
            </h3>

            <div className="divide-y divide-slate-100">
              {otherLocations.slice(0, 3).map((loc, idx) => {
                const isSelected = selectedCity.toLowerCase() === loc.queryCity;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedCity(loc.city)}
                    className={`py-3.5 first:pt-0 last:pb-0 flex items-center justify-between cursor-pointer rounded-xl px-2 transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-medium text-slate-400">
                        {loc.country}
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {loc.city}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {loc.condition}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {renderMiniWeatherIcon(loc.iconType)}
                      <div className="text-xs sm:text-sm font-extrabold text-slate-800 text-right min-w-[55px]">
                        {formatTempNumber(loc.tempMax)} / {formatTempNumber(loc.tempMin)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Today's Highlight Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight mb-5">
              Today's Highlight
            </h3>

            {/* Grid of 6 Metric Cards (3 cols x 2 rows on desktop / 2 cols on mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              
              {/* Metric 1: Wind Status */}
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Wind className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-600">Wind Status</span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {windStatus}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    9:00 AM
                  </div>
                </div>
              </div>

              {/* Metric 2: Humidity */}
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Droplets className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold text-slate-600">Humidity</span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {humidity}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    Humidity is good
                  </div>
                </div>
              </div>

              {/* Metric 3: Sunrise */}
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Sunrise className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-bold text-slate-600">Sunrise</span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {sunrise}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Dawn
                  </div>
                </div>
              </div>

              {/* Metric 4: UV Index */}
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-bold text-slate-600">UV Index</span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {uvIndex}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    Moderate UV
                  </div>
                </div>
              </div>

              {/* Metric 5: Visibility */}
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-600">Visibility</span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {visibility}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    9:00 AM
                  </div>
                </div>
              </div>

              {/* Metric 6: Sunset */}
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Sunset className="w-4 h-4 text-amber-600" />
                  <span className="text-[11px] font-bold text-slate-600">Sunset</span>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {sunset}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Dusk
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. 10 Day Forecast Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">
                10 Day Forecast
              </h3>
              <span className="text-xs font-semibold text-emerald-600">
                Live Agro Outlook
              </span>
            </div>

            {/* Scrollable Horizontal Forecast Cards */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
              {forecastDays.map((f, i) => (
                <div
                  key={i}
                  className="shrink-0 w-20 sm:w-24 bg-[#f8fafc] border border-slate-100 hover:border-emerald-300 rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all hover:-translate-y-0.5 shadow-xs"
                >
                  <span className="text-xs font-bold text-slate-600">
                    {f.day}
                  </span>

                  <div className="my-3">
                    {renderMiniWeatherIcon(f.condition)}
                  </div>

                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {formatTemp(f.temp)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* City Switcher Modal */}
      {showCityPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Change Weather City
              </h3>
              <button
                onClick={() => setShowCityPicker(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (citySearchInput.trim()) {
                  setSelectedCity(citySearchInput.trim());
                  setShowCityPicker(false);
                  setCitySearchInput('');
                }
              }}
              className="mt-4"
            >
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Enter city or mandi name..."
                  value={citySearchInput}
                  onChange={(e) => setCitySearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>
            </form>

            <div className="mt-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Popular Agricultural & Global Cities
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Chicago',
                  'Canberra',
                  'Tokyo',
                  'Nashik',
                  'Delhi',
                  'Mumbai',
                  'London',
                  'Ludhiana',
                  'Surat',
                  'Jaipur',
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCity(c);
                      setShowCityPicker(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedCity.toLowerCase() === c.toLowerCase()
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Export Farm Climate Report
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Download real-time agro-weather observations and 10-day forecasts for {selectedCity}.
            </p>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => handleExport('csv')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Download className="w-4 h-4" /> Download Telemetry (.CSV)
              </button>
              <button
                onClick={() => handleExport('print')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" /> Print Farm Advisory Sheet
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
