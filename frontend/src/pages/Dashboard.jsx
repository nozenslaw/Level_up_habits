import { useState, useEffect } from 'react';
import { Flame, Zap, Target } from 'lucide-react';
import Confetti from 'react-confetti';
import { useRPG } from '../hooks/useRPG';
import { XPBar } from '../components/XPBar';
import { HabitItem } from '../components/HabitItem';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    level,
    currentXP,
    xpForNextLevel,
    habits,
    getTodayCompletions,
    completeHabit,
    getStreakForHabit
  } = useRPG();

  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const todayCompletions = getTodayCompletions();
  const completedCount = todayCompletions.length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  // Calculate longest current streak
  const longestStreak = habits.reduce((max, habit) => {
    const streak = getStreakForHabit(habit.id);
    return streak > max ? streak : max;
  }, 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCompleteHabit = (habit) => {
    const result = completeHabit(habit);
    if (result.success) {
      let message = `+${result.xpGained} XP`;
      if (result.streakBonus > 0) {
        message += ` (dont +${result.streakBonus} bonus streak!)`;
      }
      toast.success(message);

      if (result.leveledUp) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        toast.success(`🎉 Niveau ${result.newLevel} atteint!`, {
          duration: 5000
        });
      }

      if (result.newBadge) {
        toast.success(`🏆 Badge débloqué: ${result.newBadge.name}!`, {
          duration: 5000
        });
      }
    }
  };

  const handleLongPress = (habit) => {
    navigate('/habits', { state: { editHabit: habit } });
  };

  return (
    <div className="space-y-6" data-testid="dashboard">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#00F0FF', '#BD00FF', '#39FF14', '#FF0055', '#FFAA00']}
        />
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight font-heading">
          LevelUp<span className="text-primary">Habits</span>
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </p>
      </div>

      {/* XP Card */}
      <Card className="glass-card border-primary/20">
        <CardContent className="pt-6">
          <XPBar
            currentXP={currentXP}
            xpForNextLevel={xpForNextLevel}
            level={level}
          />
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold font-mono">{completionPercentage}%</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Aujourd'hui</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Flame className="w-5 h-5 mx-auto mb-1 text-destructive" />
            <p className="text-2xl font-bold font-mono" data-testid="longest-streak">{longestStreak}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Meilleur Streak</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-accent" />
            <p className="text-2xl font-bold font-mono">{completedCount}/{totalHabits}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Complétées</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Habits */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>Habitudes du jour</span>
            {completedCount === totalHabits && totalHabits > 0 && (
              <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                Complètes!
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {habits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune habitude créée</p>
              <button
                onClick={() => navigate('/habits')}
                className="mt-2 text-primary hover:underline"
                data-testid="add-first-habit-btn"
              >
                Créer ma première habitude
              </button>
            </div>
          ) : (
            habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                isCompleted={todayCompletions.includes(habit.id)}
                streak={getStreakForHabit(habit.id)}
                onComplete={handleCompleteHabit}
                onLongPress={handleLongPress}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
