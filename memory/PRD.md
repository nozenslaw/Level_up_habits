# LevelUp Habits - PRD

## Original Problem Statement
Application web téléchargeable sur téléphone (PWA) pour suivre des habitudes journalières avec un système de stats RPG. L'utilisateur peut créer, modifier, supprimer ses habitudes et les lier à des statistiques personnalisées (Force, Endurance, Intelligence, etc.). Système de niveaux avec XP, streaks qui boostent l'XP, badges tous les 10 niveaux. Vue journalière avec avancement hebdomadaire et mensuel.

## User Personas
- **Utilisateur Principal**: Personne souhaitant gamifier son suivi d'habitudes quotidiennes
- **Profil**: Amateur de jeux RPG cherchant à progresser dans la vie réelle
- **Besoins**: Simplicité d'usage, motivation par le jeu, visualisation claire de la progression

## Core Requirements
- ✅ CRUD complet des habitudes (créer, modifier, supprimer)
- ✅ Association habitudes → stats RPG personnalisables
- ✅ Système XP + niveaux avec calcul progressif
- ✅ Streaks avec bonus XP
- ✅ Badges tous les 10 niveaux (10 badges jusqu'au niveau 100)
- ✅ Vue journalière, hebdomadaire, mensuelle
- ✅ Radar chart (toile d'araignée) pour les stats
- ✅ Barres de progression par stat
- ✅ Graphiques d'historique
- ✅ Calendrier avec jours complétés
- ✅ Mode sombre / clair
- ✅ Fond d'écran personnalisable
- ✅ Stockage 100% local (localStorage)

## What's Been Implemented (Jan 22, 2026)

### Architecture
- **Frontend Only**: React + Tailwind + Shadcn/UI
- **Data**: localStorage avec RPGContext (état partagé globalement)
- **Design**: Glassmorphism, accents néon, fonts Outfit/Manrope

### Pages
1. **Dashboard** (`/`) - Niveau, XP, streaks, habitudes du jour
2. **Habits** (`/habits`) - CRUD habitudes avec liaison stats
3. **Stats** (`/stats`) - Radar chart + barres de progression
4. **History** (`/history`) - Graphiques hebdo/mensuel + calendrier
5. **Badges** (`/badges`) - Collection 10 badges
6. **Settings** (`/settings`) - Thème, wallpaper, gestion stats

### Key Files
- `/app/frontend/src/hooks/useRPG.js` - RPGContext avec logique XP/niveaux/streaks
- `/app/frontend/src/context/ThemeContext.js` - Thème + wallpaper
- `/app/frontend/src/pages/*.jsx` - 6 pages principales

## Prioritized Backlog

### P0 (Done)
- [x] Système RPG complet
- [x] CRUD habitudes
- [x] Visualisations (radar, barres, graphiques)
- [x] Mode sombre/clair
- [x] Persistance localStorage

### P1 (Next)
- [ ] PWA manifest + service worker (offline)
- [ ] Notifications/rappels
- [ ] Export/import données

### P2 (Future)
- [ ] Sons/effets audio
- [ ] Animations de level up plus élaborées
- [ ] Achievements supplémentaires (streaks, catégories)

## Technical Notes
- Hot reload actif (pas besoin de restart pour les changements code)
- Données isolées par navigateur/appareil (localStorage)
- Compatible mobile-first (responsive)

---
*Dernière mise à jour: 22 Janvier 2026*
