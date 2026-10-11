import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Dashboard } from './pages/Dashboard';
import { MarketPrices } from './pages/MarketPrices';
import { MarketComparison } from './pages/MarketComparison';
import { WeatherPage } from './pages/WeatherPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';

function AgriSmartApp() {
  const [activeTab, setActiveTab] = useState('weather');
  const [comparedCrop, setComparedCrop] = useState('Wheat');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompareCrop = (cropName) => {
    setComparedCrop(cropName);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalSearch = (query) => {
    if (activeTab !== 'weather' && activeTab !== 'prices') {
      setActiveTab('weather');
    }
  };

  const isAuthPage = ['login', 'register', 'forgot'].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-800 flex">
      
      {/* 1. Left Sidebar Navigation (Desktop Permanent & Mobile Slide-Over) */}
      {!isAuthPage && (
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleNavigate}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 2. Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        {!isAuthPage && (
          <Navbar
            onOpenNotifications={() => setNotificationDrawerOpen(true)}
            onNavigate={handleNavigate}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onGlobalSearch={handleGlobalSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* Page Content Viewport */}
        <main className={`flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto ${!isAuthPage ? 'pb-24 md:pb-8' : ''}`}>
          
          {/* Auth Pages */}
          {isAuthPage && (
            <div className="py-6 max-w-md mx-auto">
              {activeTab === 'login' && <Login onNavigate={handleNavigate} />}
              {activeTab === 'register' && <Register onNavigate={handleNavigate} />}
              {activeTab === 'forgot' && <ForgotPassword onNavigate={handleNavigate} />}
            </div>
          )}

          {/* Core Feature Pages */}
          {!isAuthPage && (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  onNavigate={handleNavigate}
                  onCompareCrop={handleCompareCrop}
                />
              )}

              {activeTab === 'prices' && (
                <MarketPrices
                  onCompareCrop={handleCompareCrop}
                />
              )}

              {activeTab === 'compare' && (
                <MarketComparison
                  initialCrop={comparedCrop}
                />
              )}

              {activeTab === 'weather' && (
                <WeatherPage externalSearchQuery={searchQuery} />
              )}

              {activeTab === 'notifications' && (
                <NotificationsPage />
              )}
            </>
          )}

        </main>

      </div>

      {/* 3. Mobile Bottom Navigation Bar */}
      {!isAuthPage && (
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={handleNavigate}
        />
      )}

      {/* 4. Slide-over Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onNavigate={handleNavigate}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AgriSmartApp />
      </NotificationProvider>
    </AuthProvider>
  );
}
