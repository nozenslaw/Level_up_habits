import { useState } from 'react';
import { Moon, Sun, Plus, Trash2, Palette, Image, RotateCcw, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useRPG } from '../hooks/useRPG';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
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

const STAT_COLORS = [
  '#FF0055', '#FFAA00', '#00F0FF', '#BD00FF', '#39FF14', '#FFFFFF',
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'
];

export default function Settings() {
  const { theme, toggleTheme, isDark, wallpapers, wallpaperId, selectWallpaper, customWallpaper, setWallpaperFromUrl } = useTheme();
  const { stats, addStat, updateStat, deleteStat, resetAllData } = useRPG();

  const [showStatDialog, setShowStatDialog] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [statName, setStatName] = useState('');
  const [statColor, setStatColor] = useState('#00F0FF');
  const [deleteStatId, setDeleteStatId] = useState(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');

  const openStatDialog = (stat = null) => {
    if (stat) {
      setEditingStat(stat);
      setStatName(stat.name);
      setStatColor(stat.color);
    } else {
      setEditingStat(null);
      setStatName('');
      setStatColor('#00F0FF');
    }
    setShowStatDialog(true);
  };

  const handleSaveStat = () => {
    if (!statName.trim()) {
      toast.error('Le nom est requis');
      return;
    }

    if (editingStat) {
      updateStat(editingStat.id, { name: statName.trim(), color: statColor });
      toast.success('Statistique modifiée');
    } else {
      addStat({ name: statName.trim(), color: statColor });
      toast.success('Statistique ajoutée');
    }

    setShowStatDialog(false);
  };

  const handleDeleteStat = () => {
    if (deleteStatId) {
      deleteStat(deleteStatId);
      toast.success('Statistique supprimée');
      setDeleteStatId(null);
    }
  };

  const handleReset = () => {
    resetAllData();
    toast.success('Données réinitialisées');
    setShowResetDialog(false);
  };

  const handleCustomWallpaper = () => {
    if (customWallpaperUrl.trim()) {
      setWallpaperFromUrl(customWallpaperUrl.trim());
      setCustomWallpaperUrl('');
      toast.success('Fond d\'écran personnalisé appliqué');
    }
  };

  return (
    <div className="space-y-6" data-testid="settings-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading">Réglages</h1>
        <p className="text-muted-foreground text-sm">
          Personnalisez votre expérience
        </p>
      </div>

      {/* Theme */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Thème
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mode {isDark ? 'sombre' : 'clair'}</p>
              <p className="text-sm text-muted-foreground">
                Basculer entre les thèmes
              </p>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={toggleTheme}
              data-testid="theme-toggle"
            />
          </div>
        </CardContent>
      </Card>

      {/* Wallpaper */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image className="w-5 h-5" />
            Fond d'écran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {wallpapers.map(wp => (
              <button
                key={wp.id}
                onClick={() => selectWallpaper(wp.id)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  wallpaperId === wp.id 
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-transparent hover:border-primary/50'
                }`}
                data-testid={`wallpaper-${wp.id}`}
              >
                {wp.url ? (
                  <img 
                    src={wp.url} 
                    alt={wp.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${isDark ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}`} />
                )}
                {wallpaperId === wp.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/30">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom URL */}
          <div className="space-y-2 pt-2">
            <Label>URL personnalisée</Label>
            <div className="flex gap-2">
              <Input
                value={customWallpaperUrl}
                onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1"
                data-testid="custom-wallpaper-input"
              />
              <Button onClick={handleCustomWallpaper} data-testid="apply-wallpaper-btn">
                Appliquer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Management */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Statistiques RPG
          </CardTitle>
          <Button
            size="sm"
            onClick={() => openStatDialog()}
            data-testid="add-stat-btn"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Aucune statistique
            </p>
          ) : (
            stats.map(stat => (
              <div
                key={stat.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20"
                data-testid={`stat-item-${stat.id}`}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: stat.color }}
                />
                <span className="flex-1 font-medium">{stat.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openStatDialog(stat)}
                  data-testid={`edit-stat-${stat.id}`}
                >
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteStatId(stat.id)}
                  className="text-destructive hover:text-destructive"
                  data-testid={`delete-stat-${stat.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Reset Data */}
      <Card className="glass-card border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <RotateCcw className="w-5 h-5" />
            Zone de danger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Réinitialiser toutes les données (habitudes, XP, stats, historique). Cette action est irréversible.
          </p>
          <Button
            variant="destructive"
            onClick={() => setShowResetDialog(true)}
            data-testid="reset-data-btn"
          >
            Réinitialiser tout
          </Button>
        </CardContent>
      </Card>

      {/* Stat Dialog */}
      <Dialog open={showStatDialog} onOpenChange={setShowStatDialog}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingStat ? 'Modifier la statistique' : 'Nouvelle statistique'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stat-name">Nom</Label>
              <Input
                id="stat-name"
                value={statName}
                onChange={(e) => setStatName(e.target.value)}
                placeholder="Ex: Force"
                data-testid="stat-name-input"
              />
            </div>

            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {STAT_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setStatColor(color)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      statColor === color ? 'ring-2 ring-offset-2 ring-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    data-testid={`color-${color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowStatDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveStat} data-testid="save-stat-btn">
              {editingStat ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Stat Confirmation */}
      <AlertDialog open={!!deleteStatId} onOpenChange={() => setDeleteStatId(null)}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette statistique ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera la statistique et la dissociera de toutes les habitudes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStat}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="confirm-delete-stat-btn"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirmation */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser toutes les données ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes vos habitudes, statistiques, XP et historique seront supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="confirm-reset-btn"
            >
              Réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
