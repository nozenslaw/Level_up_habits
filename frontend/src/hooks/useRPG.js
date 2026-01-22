import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';

const XP_BASE = 100;
const XP_MULTIPLIER = 1.5;
const STREAK_BONUS_MULTIPLIER = 0.1;

export const calculateXPForLevel = (level) => {
  return Math.floor(XP_BASE * Math.pow(XP_MULTIPLIER, level - 1));
};

export const calculateLevelFromTotalXP = (totalXP) => {
  let level = 1;
  let xpNeeded = XP_BASE;
  let xpAccumulated = 0;
  
  while (xpAccumulated + xpNeeded <= totalXP) {
    xpAccumulated += xpNeeded;
    level++;
    xpNeeded = calculateXPForLevel(level);
  }
  
  return {
    level,
    currentXP: totalXP - xpAccumulated,
    xpForNextLevel: xpNeeded,
    totalXP
  };
};

const DEFAULT_STATS = [
  { id: 'strength', name: 'Force', color: '#FF0055', xp: 0 },
  { id: 'endurance', name: 'Endurance', color: '#FFAA00', xp: 0 },
  { id: 'intelligence', name: 'Intelligence', color: '#00F0FF', xp: 0 },
  { id: 'charisma', name: 'Charisme', color: '#BD00FF', xp: 0 },
  { id: 'agility', name: 'Agilité', color: '#39FF14', xp: 0 },
  { id: 'wisdom', name: 'Sagesse', color: '#FFFFFF', xp: 0 }
];

const BADGE_DEFINITIONS = [
  { level: 10, name: 'Novice', icon: '🌟', description: 'Atteindre le niveau 10' },
  { level: 20, name: 'Apprenti', icon: '⚔️', description: 'Atteindre le niveau 20' },
  { level: 30, name: 'Aventurier', icon: '🛡️', description: 'Atteindre le niveau 30' },
  { level: 40, name: 'Héros', icon: '👑', description: 'Atteindre le niveau 40' },
  { level: 50, name: 'Légende', icon: '🏆', description: 'Atteindre le niveau 50' },
  { level: 60, name: 'Maître', icon: '💎', description: 'Atteindre le niveau 60' },
  { level: 70, name: 'Champion', icon: '🔥', description: 'Atteindre le niveau 70' },
  { level: 80, name: 'Titan', icon: '⚡', description: 'Atteindre le niveau 80' },
  { level: 90, name: 'Divinité', icon: '✨', description: 'Atteindre le niveau 90' },
  { level: 100, name: 'Immortel', icon: '🌌', description: 'Atteindre le niveau 100' }
];

// Helper to read from localStorage
const getFromStorage = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Helper to write to localStorage
const setToStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

const RPGContext = createContext();

export const RPGProvider = ({ children }) => {
  // State initialization from localStorage
  const [totalXP, setTotalXPState] = useState(() => getFromStorage('rpg_total_xp', 0));
  const [stats, setStatsState] = useState(() => getFromStorage('rpg_stats', DEFAULT_STATS));
  const [unlockedBadges, setUnlockedBadgesState] = useState(() => getFromStorage('rpg_badges', []));
  const [habits, setHabitsState] = useState(() => getFromStorage('rpg_habits', []));
  const [completionHistory, setCompletionHistoryState] = useState(() => getFromStorage('rpg_history', {}));

  // Sync state setters with localStorage
  const setTotalXP = useCallback((value) => {
    const newValue = value instanceof Function ? value(totalXP) : value;
    setTotalXPState(newValue);
    setToStorage('rpg_total_xp', newValue);
  }, [totalXP]);

  const setStats = useCallback((value) => {
    const newValue = value instanceof Function ? value(stats) : value;
    setStatsState(newValue);
    setToStorage('rpg_stats', newValue);
  }, [stats]);

  const setUnlockedBadges = useCallback((value) => {
    const newValue = value instanceof Function ? value(unlockedBadges) : value;
    setUnlockedBadgesState(newValue);
    setToStorage('rpg_badges', newValue);
  }, [unlockedBadges]);

  const setHabits = useCallback((value) => {
    const newValue = value instanceof Function ? value(habits) : value;
    setHabitsState(newValue);
    setToStorage('rpg_habits', newValue);
  }, [habits]);

  const setCompletionHistory = useCallback((value) => {
    const newValue = value instanceof Function ? value(completionHistory) : value;
    setCompletionHistoryState(newValue);
    setToStorage('rpg_history', newValue);
  }, [completionHistory]);

  const levelData = useMemo(() => calculateLevelFromTotalXP(totalXP), [totalXP]);

  const getStreakForHabit = useCallback((habitId) => {
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let checkDate = new Date();
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayHistory = completionHistory[dateStr] || [];
      
      if (dayHistory.includes(habitId)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dateStr === today) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }, [completionHistory]);

  const completeHabit = useCallback((habit) => {
    const today = new Date().toISOString().split('T')[0];
    const todayHistory = completionHistory[today] || [];
    
    if (todayHistory.includes(habit.id)) {
      return { success: false, message: 'Déjà complété aujourd\'hui' };
    }

    const streak = getStreakForHabit(habit.id);
    const baseXP = habit.xpReward || 25;
    const streakBonus = Math.floor(baseXP * streak * STREAK_BONUS_MULTIPLIER);
    const totalXPGained = baseXP + streakBonus;

    // Update total XP
    const newTotalXP = totalXP + totalXPGained;
    const oldLevel = levelData.level;
    const newLevelData = calculateLevelFromTotalXP(newTotalXP);
    setTotalXP(newTotalXP);

    // Update stats
    if (habit.linkedStats && habit.linkedStats.length > 0) {
      const xpPerStat = Math.floor(totalXPGained / habit.linkedStats.length);
      setStats(prevStats => 
        prevStats.map(stat => 
          habit.linkedStats.includes(stat.id)
            ? { ...stat, xp: stat.xp + xpPerStat }
            : stat
        )
      );
    }

    // Update completion history
    setCompletionHistory(prev => ({
      ...prev,
      [today]: [...(prev[today] || []), habit.id]
    }));

    // Check for new badges
    let newBadge = null;
    if (newLevelData.level > oldLevel) {
      const earnedBadge = BADGE_DEFINITIONS.find(
        b => b.level === newLevelData.level && !unlockedBadges.includes(b.level)
      );
      if (earnedBadge) {
        setUnlockedBadges(prev => [...prev, earnedBadge.level]);
        newBadge = earnedBadge;
      }
    }

    return {
      success: true,
      xpGained: totalXPGained,
      streakBonus,
      newStreak: streak + 1,
      leveledUp: newLevelData.level > oldLevel,
      newLevel: newLevelData.level,
      newBadge
    };
  }, [completionHistory, getStreakForHabit, totalXP, levelData.level, setTotalXP, setStats, setCompletionHistory, unlockedBadges, setUnlockedBadges]);

  const uncompleteHabit = useCallback((habitId) => {
    const today = new Date().toISOString().split('T')[0];
    setCompletionHistory(prev => ({
      ...prev,
      [today]: (prev[today] || []).filter(id => id !== habitId)
    }));
  }, [setCompletionHistory]);

  const addHabit = useCallback((habit) => {
    const newHabit = {
      id: `habit_${Date.now()}`,
      name: habit.name,
      icon: habit.icon || '⭐',
      xpReward: habit.xpReward || 25,
      linkedStats: habit.linkedStats || [],
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  }, [setHabits]);

  const updateHabit = useCallback((habitId, updates) => {
    setHabits(prev => 
      prev.map(h => h.id === habitId ? { ...h, ...updates } : h)
    );
  }, [setHabits]);

  const deleteHabit = useCallback((habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  }, [setHabits]);

  const addStat = useCallback((stat) => {
    const newStat = {
      id: `stat_${Date.now()}`,
      name: stat.name,
      color: stat.color || '#00F0FF',
      xp: 0
    };
    setStats(prev => [...prev, newStat]);
    return newStat;
  }, [setStats]);

  const updateStat = useCallback((statId, updates) => {
    setStats(prev => 
      prev.map(s => s.id === statId ? { ...s, ...updates } : s)
    );
  }, [setStats]);

  const deleteStat = useCallback((statId) => {
    setStats(prev => prev.filter(s => s.id !== statId));
    setHabits(prev => 
      prev.map(h => ({
        ...h,
        linkedStats: h.linkedStats.filter(id => id !== statId)
      }))
    );
  }, [setStats, setHabits]);

  const getTodayCompletions = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return completionHistory[today] || [];
  }, [completionHistory]);

  const getCompletionsForDate = useCallback((date) => {
    const dateStr = date.toISOString().split('T')[0];
    return completionHistory[dateStr] || [];
  }, [completionHistory]);

  const getWeeklyStats = useCallback(() => {
    const weekStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const completions = completionHistory[dateStr] || [];
      weekStats.push({
        date: dateStr,
        day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        completions: completions.length,
        percentage: habits.length > 0 ? Math.round((completions.length / habits.length) * 100) : 0
      });
    }
    return weekStats;
  }, [completionHistory, habits.length]);

  const getMonthlyStats = useCallback(() => {
    const monthStats = [];
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      const dateStr = date.toISOString().split('T')[0];
      const completions = completionHistory[dateStr] || [];
      monthStats.push({
        date: dateStr,
        day: i,
        completions: completions.length,
        percentage: habits.length > 0 ? Math.round((completions.length / habits.length) * 100) : 0
      });
    }
    return monthStats;
  }, [completionHistory, habits.length]);

  const resetAllData = useCallback(() => {
    setTotalXP(0);
    setStats(DEFAULT_STATS);
    setUnlockedBadges([]);
    setHabits([]);
    setCompletionHistory({});
  }, [setTotalXP, setStats, setUnlockedBadges, setHabits, setCompletionHistory]);

  const value = {
    // Level & XP
    level: levelData.level,
    currentXP: levelData.currentXP,
    xpForNextLevel: levelData.xpForNextLevel,
    totalXP,
    
    // Stats
    stats,
    addStat,
    updateStat,
    deleteStat,
    
    // Habits
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    getStreakForHabit,
    
    // History
    completionHistory,
    getTodayCompletions,
    getCompletionsForDate,
    getWeeklyStats,
    getMonthlyStats,
    
    // Badges
    badges: BADGE_DEFINITIONS,
    unlockedBadges,
    
    // Utils
    resetAllData
  };

  return (
    <RPGContext.Provider value={value}>
      {children}
    </RPGContext.Provider>
  );
};

export const useRPG = () => {
  const context = useContext(RPGContext);
  if (!context) {
    throw new Error('useRPG must be used within an RPGProvider');
  }
  return context;
};

export default RPGContext;
