import { cn } from '../lib/utils';

export const XPBar = ({ currentXP, xpForNextLevel, level, className }) => {
  const percentage = Math.min((currentXP / xpForNextLevel) * 100, 100);

  return (
    <div className={cn("space-y-2", className)} data-testid="xp-bar">
      <div className="flex justify-between items-center text-sm">
        <span className="font-mono font-bold text-primary" data-testid="level-display">
          Niv. {level}
        </span>
        <span className="text-muted-foreground font-mono" data-testid="xp-display">
          {currentXP} / {xpForNextLevel} XP
        </span>
      </div>
      <div className="h-3 rounded-full bg-secondary/20 overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)'
          }}
          data-testid="xp-progress"
        />
      </div>
    </div>
  );
};

export default XPBar;
