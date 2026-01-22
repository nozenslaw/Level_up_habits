import { useRPG } from '../hooks/useRPG';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../lib/utils';

export default function Badges() {
  const { badges, unlockedBadges, level } = useRPG();

  const unlockedCount = unlockedBadges.length;
  const nextBadge = badges.find(b => !unlockedBadges.includes(b.level));

  return (
    <div className="space-y-6" data-testid="badges-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading">Badges</h1>
        <p className="text-muted-foreground text-sm">
          {unlockedCount}/{badges.length} badges débloqués
        </p>
      </div>

      {/* Progress to next badge */}
      {nextBadge && (
        <Card className="glass-card border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl border-2 border-dashed border-primary/50">
                ?
              </div>
              <div className="flex-1">
                <p className="font-semibold">Prochain badge: {nextBadge.name}</p>
                <p className="text-sm text-muted-foreground">
                  Niveau {nextBadge.level} requis ({nextBadge.level - level} niveaux restants)
                </p>
                <div className="mt-2 h-2 rounded-full bg-secondary/20 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ 
                      width: `${Math.min((level / nextBadge.level) * 100, 100)}%`,
                      boxShadow: '0 0 10px rgba(0,240,255,0.5)'
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges Grid */}
      <div className="grid grid-cols-2 gap-4">
        {badges.map(badge => {
          const isUnlocked = unlockedBadges.includes(badge.level);
          
          return (
            <Card 
              key={badge.level}
              className={cn(
                "glass-card transition-all duration-300",
                isUnlocked 
                  ? "border-accent/50" 
                  : "opacity-50 grayscale"
              )}
              data-testid={`badge-${badge.level}`}
            >
              <CardContent className="p-4 text-center">
                <div 
                  className={cn(
                    "w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-3 transition-all",
                    isUnlocked 
                      ? "bg-accent/20 shadow-[0_0_20px_rgba(57,255,20,0.3)]" 
                      : "bg-secondary/20"
                  )}
                >
                  {isUnlocked ? badge.icon : '🔒'}
                </div>
                <h3 className="font-semibold">{badge.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {badge.description}
                </p>
                {isUnlocked && (
                  <span className="inline-block mt-2 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                    Débloqué!
                  </span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* All badges unlocked message */}
      {unlockedCount === badges.length && (
        <Card className="glass-card border-accent/50">
          <CardContent className="py-8 text-center">
            <span className="text-5xl">🏆</span>
            <h2 className="text-xl font-bold mt-4 text-accent">Félicitations!</h2>
            <p className="text-muted-foreground mt-2">
              Vous avez débloqué tous les badges!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
