import { NavLink } from 'react-router-dom';
import { Home, ListTodo, BarChart3, History, Trophy, Settings } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Accueil' },
  { path: '/habits', icon: ListTodo, label: 'Habitudes' },
  { path: '/stats', icon: BarChart3, label: 'Stats' },
  { path: '/history', icon: History, label: 'Historique' },
  { path: '/badges', icon: Trophy, label: 'Badges' },
  { path: '/settings', icon: Settings, label: 'Réglages' }
];

export const BottomNav = () => {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      data-testid="bottom-nav"
    >
      <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              data-testid={`nav-${label.toLowerCase().replace('é', 'e')}`}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10 scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
