import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Notices from './pages/Notices';
import Events from './pages/Events';
import Marketplace from './pages/Marketplace';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <div className="flex-1 flex flex-col min-w-0 relative transition-all duration-300">
              <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

              <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 scroll-smooth">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/notices" element={<Notices />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-20 md:hidden glass-backdrop"
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>
            )}
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
