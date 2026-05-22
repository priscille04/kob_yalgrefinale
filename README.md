# Kob-Yalgré — Plateforme E-Agriculture

Plateforme numérique de mise en relation entre producteurs agricoles et clients au Burkina Faso.

## Architecture

```
kob_yalgre/
├── Backend/        Laravel 12 — API REST
├── dashboard/      React 19 — Interface admin & producteur
└── Flutter_app/    Flutter 3 — Application mobile
```

## Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| API | Laravel + Sanctum | 12.x |
| Dashboard | React + Vite + TailwindCSS | 19 / 8 / 4 |
| Mobile | Flutter + Provider | 3.11 |
| Base de données | SQLite | — |
| Météo | OpenWeather API | — |

---

## Installation rapide

### 1. Backend (Laravel)

```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
# → http://127.0.0.1:8000
```

### 2. Dashboard (React)

```bash
cd dashboard
npm install
cp .env.example .env   # configurer VITE_API_URL et VITE_WEATHER_KEY
npm run dev
# → http://localhost:5173
```

### 3. App Flutter

```bash
cd Flutter_app
flutter pub get
# Modifier lib/services/api_service.dart : _apiBaseUrl → IP du backend
flutter run
```

---

## Fonctionnalités

### Clients (app mobile)
- Parcourir le catalogue de produits agricoles
- Passer et suivre des commandes
- Messagerie avec les producteurs
- Conseils agricoles et annonces
- Météo par ville ou GPS

### Producteurs (app mobile + dashboard)
- Gérer son catalogue de produits (CRUD + images)
- Traiter les commandes (confirmer / refuser / livrer)
- Messagerie avec les clients
- Publier des annonces
- Météo et conseils agricoles

### Administrateurs (dashboard uniquement)
- Tableau de bord KPIs (utilisateurs, produits, commandes, revenus)
- CRUD complet : utilisateurs, produits, commandes, boutiques, conseils, annonces, types de produits
- Gestion des boutiques et codes d'accès producteurs
- Notifications

---

## Modèle de données (résumé)

```
utilisateurs (client / producteur / admin)
 ├── clients          → commandes
 ├── producteurs      → produits → commandes
 │    └── boutiques   (groupement de producteurs)
 ├── conversations    → messages
 └── notifications
```

**Entités complètes** : utilisateurs, clients, producteurs, boutiques, produits, typeproduits, commandes, annonces, conseilagricoles, conversations, messages, notifications, localisations, servicemetheos

---

## Authentification

- **Token Bearer** via Laravel Sanctum
- **Flux client** : email + mot de passe → token
- **Flux producteur** : email + mot de passe → code boutique → token
- **Flux admin** : email `*@kobyalgre.bf` → rôle admin auto-assigné

---

## Statuts de commande

```
en_attente → confirmee → en_cours → livree
           ↘ refusee (+ motif)
confirmee  → annulee (stock restitué)
```

---

## Variables d'environnement

### Backend (`Backend/.env`)

| Variable | Description |
|----------|-------------|
| `APP_KEY` | Clé Laravel (générée) |
| `DB_CONNECTION` | `sqlite` |
| `APP_DEBUG` | `false` en production |

### Dashboard (`dashboard/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL du backend (ex: `http://127.0.0.1:8000/api`) |
| `VITE_WEATHER_KEY` | Clé API OpenWeather |

---

## Bugs connus — corrections en cours

> Voir détail dans chaque sous-module.

| Priorité | Problème | Fichier |
|----------|----------|---------|
| CRITIQUE | `getProducteurProduits()` compare mauvais IDs → 0 produits retournés | `Backend/app/Http/Controllers/API/ProduitController.php:107` |
| CRITIQUE | Password admin hardcodé `admin1234` | `Backend/app/Http/Controllers/API/AuthController.php` |
| MAJEUR | `boutique_id` absent du `$fillable` Utilisateur | `Backend/app/Models/Utilisateur.php` |
| MAJEUR | Routes React dupliquées (commandes/notifications producteur inaccessibles) | `dashboard/src/App.jsx` |
| MAJEUR | Aucun flux d'auto-inscription producteur côté public | `Backend/routes/api.php` |
| MINEUR | IP réseau hardcodée dans Flutter | `Flutter_app/lib/services/api_service.dart:16` |
| MINEUR | Clé OpenWeather exposée côté frontend | `dashboard/.env` |
| MINEUR | `APP_DEBUG=true` en production | `Backend/.env` |

---

## Deep-link Flutter

Le dashboard admin peut ouvrir l'app mobile directement sur une commande :

```
kobyalgre://client/commandes?commandeId=<id>
```
