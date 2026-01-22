import { Check, Flame } from 'lucide-react';
import { cn } from '../lib/utils';

export const HabitItem = ({ 
  habit, 
  isCompleted, 
  streak, 
  onComplete, 
  onLongPress,
  className 
}) => {
  let pressTimer = null;

  const handleMouseDown = () => {
    pressTimer = setTimeout(() => {
      if (onLongPress) onLongPress(habit);
    }, 500);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
    }
  };

  const handleClick = () => {
    if (!isCompleted && onComplete) {
      onComplete(habit);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
        isCompleted
          ? "bg-accent/10 border-accent/30"
          : "bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card/70",
        "backdrop-blur-md cursor-pointer active:scale-[0.98]",
        className
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      data-testid={`habit-item-${habit.id}`}
    >
      {/* Icon & Name */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <span className="text-2xl flex-shrink-0">{habit.icon}</span>
        <div className="min-w-0">
          <h3 className={cn(
            "font-semibold truncate",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {habit.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            +{habit.xpReward} XP
          </p>
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div 
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-mono"
          data-testid={`streak-${habit.id}`}
        >
          <Flame className="w-3 h-3" />
          <span>{streak}</span>
        </div>
      )}

      {/* Checkbox */}
      <div
        className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
          isCompleted
            ? "bg-accent border-accent text-accent-foreground"
            : "border-muted-foreground/50 hover:border-primary"
        )}
        data-testid={`habit-check-${habit.id}`}
      >
        {isCompleted && <Check className="w-5 h-5" />}
      </div>
    </div>
  );
};

export default HabitItem;
