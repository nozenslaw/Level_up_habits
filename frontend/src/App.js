import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { RPGProvider } from "./hooks/useRPG";
import { BottomNav } from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Stats from "./pages/Stats";
import History from "./pages/History";
import Badges from "./pages/Badges";
import Settings from "./pages/Settings";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "./App.css";

const AppContent = () => {
  const { currentWallpaper, isDark, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: currentWallpaper ? `url(${currentWallpaper})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for readability */}
      <div 
        className={`fixed inset-0 transition-colors duration-300 ${
          currentWallpaper 
            ? isDark 
              ? 'bg-black/70' 
              : 'bg-white/70'
            : ''
        }`}
        style={{ zIndex: 0 }}
      />

      {/* Main Content */}
      <main 
        className="relative z-10 pb-28 pt-6 px-4 max-w-lg mx-auto"
        data-testid="main-content"
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/history" element={<History />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Toast notifications */}
      <Toaster 
        position="top-center" 
        richColors 
        theme={isDark ? 'dark' : 'light'}
        toastOptions={{
          className: 'glass-card'
        }}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <RPGProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </RPGProvider>
    </ThemeProvider>
  );
}

export default App;
