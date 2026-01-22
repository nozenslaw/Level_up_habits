import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useRPG } from '../hooks/useRPG';
import { useTheme } from '../context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar } from '../components/ui/calendar';

export default function History() {
  const { isDark } = useTheme();
  const { getWeeklyStats, getMonthlyStats, getCompletionsForDate, habits } = useRPG();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weeklyData = getWeeklyStats();
  const monthlyData = getMonthlyStats();

  const completionsForSelected = getCompletionsForDate(selectedDate);
  const completedHabits = habits.filter(h => completionsForSelected.includes(h.id));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-lg px-3 py-2 shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-primary">
            {payload[0].value} habitude{payload[0].value !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-muted-foreground">
            {payload[0].payload.percentage}% complété
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (percentage) => {
    if (percentage >= 80) return '#22c55e';
    if (percentage >= 50) return '#6366f1';
    if (percentage >= 25) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6" data-testid="history-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading">Historique</h1>
        <p className="text-muted-foreground text-sm">
          Suivez votre progression au fil du temps
        </p>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="weekly" data-testid="tab-weekly">Semaine</TabsTrigger>
          <TabsTrigger value="monthly" data-testid="tab-monthly">Mois</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Cette semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                    />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: isDark ? '#fff' : '#000', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: isDark ? '#fff' : '#000', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="completions" radius={[4, 4, 0, 0]}>
                      {weeklyData.map((entry, index) => (
                        <Cell key={index} fill={getBarColor(entry.percentage)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Ce mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                    />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: isDark ? '#fff' : '#000', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      interval={4}
                    />
                    <YAxis 
                      tick={{ fill: isDark ? '#fff' : '#000', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="completions" radius={[2, 2, 0, 0]}>
                      {monthlyData.map((entry, index) => (
                        <Cell key={index} fill={getBarColor(entry.percentage)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Calendar */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Calendrier</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md"
            modifiers={{
              completed: (date) => {
                const completions = getCompletionsForDate(date);
                return completions.length > 0 && completions.length >= habits.length;
              },
              partial: (date) => {
                const completions = getCompletionsForDate(date);
                return completions.length > 0 && completions.length < habits.length;
              }
            }}
            modifiersStyles={{
              completed: {
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                fontWeight: 'bold'
              },
              partial: {
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: '#6366f1'
              }
            }}
            data-testid="history-calendar"
          />
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedHabits.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucune habitude complétée ce jour
            </p>
          ) : (
            <div className="space-y-2">
              {completedHabits.map(habit => (
                <div 
                  key={habit.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/10"
                  data-testid={`history-habit-${habit.id}`}
                >
                  <span className="text-xl">{habit.icon}</span>
                  <span className="font-medium">{habit.name}</span>
                  <span className="ml-auto text-xs text-accent">+{habit.xpReward} XP</span>
                </div>
              ))}
              <p className="text-sm text-muted-foreground text-center pt-2">
                {completedHabits.length}/{habits.length} habitudes ({Math.round((completedHabits.length / habits.length) * 100)}%)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
