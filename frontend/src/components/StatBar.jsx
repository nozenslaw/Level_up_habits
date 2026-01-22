import { calculateLevelFromTotalXP, calculateXPForLevel } from '../hooks/useRPG';
import { cn } from '../lib/utils';

export const StatBar = ({ stat, className }) => {
  const levelData = calculateLevelFromTotalXP(stat.xp);
  const percentage = (levelData.currentXP / levelData.xpForNextLevel) * 100;

  return (
    <div className={cn("space-y-1.5", className)} data-testid={`stat-bar-${stat.id}`}>
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm" style={{ color: stat.color }}>
          {stat.name}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          Niv. {levelData.level}
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary/20 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: stat.color,
            boxShadow: `0 0 10px ${stat.color}40`
          }}
        />
      </div>
      <div className="text-[10px] text-muted-foreground text-right font-mono">
        {levelData.currentXP} / {levelData.xpForNextLevel} XP
      </div>
    </div>
  );
};

export default StatBar;
