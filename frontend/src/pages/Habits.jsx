import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useRPG } from '../hooks/useRPG';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';

const HABIT_ICONS = ['💪', '📚', '🧘', '🏃', '💧', '🎯', '🧹', '💤', '🍎', '✍️', '🎵', '🌿'];

export default function Habits() {
  const location = useLocation();
  const { habits, stats, addHabit, updateHabit, deleteHabit, getStreakForHabit } = useRPG();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deleteConfirmHabit, setDeleteConfirmHabit] = useState(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('💪');
  const [formXP, setFormXP] = useState(25);
  const [formLinkedStats, setFormLinkedStats] = useState([]);

  // Check if we should open edit dialog from navigation
  useEffect(() => {
    if (location.state?.editHabit) {
      openEditDialog(location.state.editHabit);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const resetForm = () => {
    setFormName('');
    setFormIcon('💪');
    setFormXP(25);
    setFormLinkedStats([]);
    setEditingHabit(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (habit) => {
    setEditingHabit(habit);
    setFormName(habit.name);
    setFormIcon(habit.icon);
    setFormXP(habit.xpReward);
    setFormLinkedStats(habit.linkedStats || []);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Le nom est requis');
      return;
    }

    if (editingHabit) {
      updateHabit(editingHabit.id, {
        name: formName.trim(),
        icon: formIcon,
        xpReward: formXP,
        linkedStats: formLinkedStats
      });
      toast.success('Habitude modifiée');
    } else {
      addHabit({
        name: formName.trim(),
        icon: formIcon,
        xpReward: formXP,
        linkedStats: formLinkedStats
      });
      toast.success('Habitude créée');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteConfirmHabit) {
      deleteHabit(deleteConfirmHabit.id);
      toast.success('Habitude supprimée');
      setDeleteConfirmHabit(null);
    }
  };

  const toggleStat = (statId) => {
    setFormLinkedStats(prev =>
      prev.includes(statId)
        ? prev.filter(id => id !== statId)
        : [...prev, statId]
    );
  };

  return (
    <div className="space-y-6" data-testid="habits-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Mes Habitudes</h1>
          <p className="text-muted-foreground text-sm">
            {habits.length} habitude{habits.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="rounded-full h-12 px-6"
          data-testid="add-habit-btn"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center text-muted-foreground">
              <p className="text-lg mb-2">Aucune habitude</p>
              <p className="text-sm">Créez votre première habitude pour commencer</p>
            </CardContent>
          </Card>
        ) : (
          habits.map(habit => {
            const streak = getStreakForHabit(habit.id);
            const linkedStatNames = stats
              .filter(s => habit.linkedStats?.includes(s.id))
              .map(s => s.name);

            return (
              <Card key={habit.id} className="glass-card" data-testid={`habit-card-${habit.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{habit.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{habit.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          +{habit.xpReward} XP
                        </span>
                        {streak > 0 && (
                          <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">
                            🔥 {streak} jours
                          </span>
                        )}
                      </div>
                      {linkedStatNames.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          → {linkedStatNames.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(habit)}
                        data-testid={`edit-habit-${habit.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirmHabit(habit)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`delete-habit-${habit.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingHabit ? 'Modifier l\'habitude' : 'Nouvelle habitude'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="habit-name">Nom</Label>
              <Input
                id="habit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Faire du sport"
                className="h-12"
                data-testid="habit-name-input"
              />
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label>Icône</Label>
              <div className="flex flex-wrap gap-2">
                {HABIT_ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormIcon(icon)}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                      formIcon === icon
                        ? 'bg-primary/20 ring-2 ring-primary'
                        : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                    data-testid={`icon-${icon}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* XP Reward */}
            <div className="space-y-2">
              <Label htmlFor="habit-xp">Récompense XP</Label>
              <Input
                id="habit-xp"
                type="number"
                min="5"
                max="100"
                value={formXP}
                onChange={(e) => setFormXP(parseInt(e.target.value) || 25)}
                className="h-12"
                data-testid="habit-xp-input"
              />
            </div>

            {/* Linked Stats */}
            <div className="space-y-2">
              <Label>Statistiques liées</Label>
              <div className="grid grid-cols-2 gap-2">
                {stats.map(stat => (
                  <div
                    key={stat.id}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`stat-${stat.id}`}
                      checked={formLinkedStats.includes(stat.id)}
                      onCheckedChange={() => toggleStat(stat.id)}
                      data-testid={`stat-checkbox-${stat.id}`}
                    />
                    <label
                      htmlFor={`stat-${stat.id}`}
                      className="text-sm cursor-pointer"
                      style={{ color: stat.color }}
                    >
                      {stat.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} data-testid="save-habit-btn">
              <Check className="w-4 h-4 mr-2" />
              {editingHabit ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmHabit} onOpenChange={() => setDeleteConfirmHabit(null)}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette habitude ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'habitude "{deleteConfirmHabit?.name}" sera supprimée définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="confirm-delete-btn"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
