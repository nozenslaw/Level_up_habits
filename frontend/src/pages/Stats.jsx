import { useRPG, calculateLevelFromTotalXP } from '../hooks/useRPG';
import { RadarChart } from '../components/RadarChart';
import { StatBar } from '../components/StatBar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Stats() {
  const { stats, level, totalXP, habits } = useRPG();

  // Calculate total stat levels
  const totalStatLevels = stats.reduce((sum, stat) => {
    return sum + calculateLevelFromTotalXP(stat.xp).level;
  }, 0);

  return (
    <div className="space-y-6" data-testid="stats-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading">Statistiques</h1>
        <p className="text-muted-foreground text-sm">
          Niveau global {level} • {stats.length} stats • {habits.length} habitudes
        </p>
      </div>

      <Tabs defaultValue="radar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="radar" data-testid="tab-radar">Toile d'araignée</TabsTrigger>
          <TabsTrigger value="bars" data-testid="tab-bars">Barres</TabsTrigger>
        </TabsList>

        <TabsContent value="radar">
          <Card className="glass-card">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg text-center">Profil de compétences</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p>Aucune statistique</p>
                  <p className="text-sm mt-1">Ajoutez des stats dans les réglages</p>
                </div>
              ) : (
                <RadarChart stats={stats} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bars">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Progression par stat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {stats.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>Aucune statistique</p>
                </div>
              ) : (
                stats.map(stat => (
                  <StatBar key={stat.id} stat={stat} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold font-mono text-primary">{totalXP}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">XP Total</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold font-mono text-secondary">{totalStatLevels}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Niveaux cumulés</p>
          </CardContent>
        </Card>
      </div>

      {/* Stat Details */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Détails par statistique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map(stat => {
              const levelData = calculateLevelFromTotalXP(stat.xp);
              const linkedHabits = habits.filter(h => h.linkedStats?.includes(stat.id));
              
              return (
                <div 
                  key={stat.id} 
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/20"
                  data-testid={`stat-detail-${stat.id}`}
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{stat.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {linkedHabits.length > 0 
                        ? `Liée à: ${linkedHabits.map(h => h.name).join(', ')}`
                        : 'Aucune habitude liée'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold" style={{ color: stat.color }}>
                      Niv. {levelData.level}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.xp} XP
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
