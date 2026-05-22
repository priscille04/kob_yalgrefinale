# Audit Fonctionnel — Kob-Yalgré

> Date : 2026-05-22
> Périmètre : Backend Laravel 12, Dashboard React 19, App Flutter 3.11

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Modèle de données](#2-modèle-de-données)
3. [Routes API](#3-routes-api)
4. [Fonctionnalités implémentées](#4-fonctionnalités-implémentées)
5. [Flux critiques](#5-flux-critiques)
6. [Bugs & corrections](#6-bugs--corrections)
7. [Suivi des corrections](#7-suivi-des-corrections)

---

## 1. Vue d'ensemble

Plateforme e-agriculture en 3 couches communicant via API REST JSON.

| Couche | Techno | Rôle |
|--------|--------|------|
| Backend | Laravel 12 + Sanctum + SQLite | API REST, logique métier, base de données |
| Dashboard | React 19 + Vite + TailwindCSS | Interface admin et producteur (web) |
| Mobile | Flutter 3.11 + Provider | Application client et producteur (Android/iOS) |

**Authentification** : Bearer token via Laravel Sanctum.  
**Base de données** : SQLite (fichier `Backend/database/database.sqlite`).  
**Météo** : OpenWeather API (clé configurée dans `.env`).

---

## 2. Modèle de données

### Entités (15 tables)

```
utilisateurs
├── clients          (utilisateur_id FK)
├── producteurs      (utilisateur_id FK)
│    └── boutiques   (code_unique, groupement de producteurs)
│
├── produits         (producteur_id FK → producteurs.id, typeproduit_id FK)
├── typeproduits
│
├── commandes        (client_id FK, produit_id FK)
│
├── annonces         (producteur_id FK)
├── conseilagricoles
│
├── conversations    (client_id FK, producteur_id FK, produit_id FK nullable)
│    └── messages    (conversation_id FK, expediteur_id FK → utilisateurs.id)
│
├── notifications    (utilisateur_id FK, conversation_id FK nullable)
├── localisations    (utilisateur_id FK)
└── servicemetheos   (cache météo — usage à clarifier)
```

### Points d'attention sur les relations

| Relation | Note |
|----------|------|
| `produits.producteur_id` | Référence `producteurs.id`, **PAS** `utilisateurs.id` |
| `utilisateurs.boutique_id` | Présent en migration mais jamais utilisé dans le code |
| `producteurs.boutique_id` | Champ de liaison effectif |
| `conversations` | Unique par triplet `(client_id, producteur_id, produit_id)` |

---

## 3. Routes API

Base : `/api`

### Publiques

| Méthode | Route | Contrôleur |
|---------|-------|------------|
| POST | `/auth/register` | AuthController@register |
| POST | `/auth/login` | AuthController@login |
| POST | `/auth/check-boutique` | AuthController@checkBoutique |
| GET | `/v1/produits` | ProduitController@index |
| GET | `/v1/produits/{id}` | ProduitController@show |
| GET | `/v1/conseils-agricoles` | ConseilAgricoleController@index |
| GET | `/v1/conseils-agricoles/{id}` | ConseilAgricoleController@show |
| GET | `/v1/annonces` | AnnonceController@index |
| GET | `/v1/annonces/{id}` | AnnonceController@show |
| GET | `/v1/typeproduits` | TypeProduitController@index |
| GET | `/v1/meteo` | MeteoController@getMeteo |
| GET | `/v1/meteo/coords` | MeteoController@getMeteoByCoords |
| GET | `/v1/meteo/previsions` | MeteoController@getPrevisions |

### Authentifiées (middleware `auth:sanctum`)

| Méthode | Route | Contrôleur |
|---------|-------|------------|
| GET | `/auth/me` | AuthController@me |
| POST | `/auth/logout` | AuthController@logout |
| POST | `/auth/refresh` | AuthController@refresh |
| POST | `/v1/produits` | ProduitController@store |
| PUT | `/v1/produits/{id}` | ProduitController@update |
| DELETE | `/v1/produits/{id}` | ProduitController@destroy |
| GET | `/v1/producteur-produits` | ProduitController@getProducteurProduits ⚠️ BUG |
| POST | `/v1/commandes` | CommandeController@store |
| GET | `/v1/commandes` | CommandeController@index |
| PUT | `/v1/commandes/{id}` | CommandeController@update |
| DELETE | `/v1/commandes/{id}` | CommandeController@destroy |
| GET/POST | `/v1/conversations` | ConversationController |
| GET/POST | `/v1/conversations/{id}/messages` | MessageController |
| POST | `/v1/conversations/{id}/lire` | MessageController@marquerLu |
| GET | `/v1/notifications` | NotificationController@index |
| POST/PUT/DELETE | `/v1/annonces` | AnnonceController |
| GET/POST | `/v1/localisations` | LocalisationController |

### Admin uniquement (middleware `admin`)

| Méthode | Route | Contrôleur |
|---------|-------|------------|
| GET/POST/PUT/DELETE | `/v1/utilisateurs` | UtilisateurController |
| GET/POST | `/v1/clients` | ClientController |
| GET/POST | `/v1/producteurs` | ProducteurController |
| POST | `/auth/register-producteur` | AuthController@registerProducteur |
| POST/PUT | `/v1/typeproduits` | TypeProduitController |
| GET/PATCH | `/v1/boutiques` | BoutiqueController |

---

## 4. Fonctionnalités implémentées

### Backend ✅ complet

- Authentification (Sanctum tokens, rôles client/producteur/admin)
- Flux inscription 2-step producteur (credentials + code boutique)
- Catalogue produits avec upload image (`storage/produits/`)
- Commandes avec gestion de stock (décrémentation à la confirmation, restitution à l'annulation)
- Messagerie (conversations privées client ↔ producteur, avec produit optionnel)
- Notifications automatiques (client, producteur, admin) à chaque événement commande/message
- Conseils agricoles et annonces producteurs
- Intégration OpenWeather (météo ville, GPS, prévisions 5 jours)
- Localisation utilisateur
- Gestion boutiques et codes d'accès

### Dashboard React ✅ quasi-complet

- Connexion admin/producteur (2-step pour producteur)
- Dashboard KPIs : utilisateurs, produits, commandes, producteurs, boutiques, revenus
- Graphiques Recharts (statuts commandes, répartition rôles)
- CRUD : utilisateurs, produits, commandes, conseils, annonces, types produits, boutiques
- Deep-link vers app Flutter : `kobyalgre://client/commandes?commandeId=<id>`
- Pages publiques : accueil, marché, contact, à propos

### App Flutter ✅ quasi-complet

- Authentification avec validation token au démarrage
- Catalogue produits (liste + recherche + détail)
- Commandes (créer, lister, filtrer par statut, annuler)
- Messagerie (conversations + chat temps réel simulé)
- Notifications (lister, marquer comme lu)
- Météo (ville + GPS)
- Conseils et annonces (lecture)
- CRUD produits producteur (+ upload image)
- Profil utilisateur

### En développement / incomplet

| Fonctionnalité | État |
|----------------|------|
| USSD codes | Interface Flutter présente, logique non implémentée |
| Videos | Route déclarée, écran stub |
| Email réel | `MAIL_MAILER=log` — emails simulés en fichier log |
| Inscription producteur public | Flux non exposé côté frontend |

---

## 5. Flux critiques

### Flux commande complète

```
Client (Flutter)
  → POST /v1/commandes { produit_id, quantite }
  → Vérification stock
  → Création commande statut: en_attente
  → Notification: client + admin + producteur

Producteur (Dashboard / Flutter)
  → PUT /v1/commandes/{id} { statut: confirmee }
  → Stock décrémenté
  → PUT /v1/commandes/{id} { statut: en_cours }
  → PUT /v1/commandes/{id} { statut: livree }

OU

Producteur
  → PUT /v1/commandes/{id} { statut: refusee, motif_refus: "..." }
  → Stock inchangé

Client
  → DELETE /v1/commandes/{id}  (si statut: confirmee → annulee, stock restitué)
```

### Flux messagerie

```
Client → POST /v1/conversations { producteur_id, produit_id? }
       → Conversation unique (client × producteur × produit)

Participants → POST /v1/conversations/{id}/messages { contenu }
             → Si conversation.produit_id non null → commande auto-créée
             → Notifications auto vers les 2 participants

POST /v1/conversations/{id}/lire → marque tous messages comme lus
```

### Flux authentification producteur (2-step)

```
1. POST /auth/login { email, mot_de_passe }
   → Retourne: { token, user }
   → Si user.role == 'producteur' → step 2

2. POST /auth/check-boutique { user_id, code_boutique }
   → Vérifie appartenance boutique
   → Si OK → redirection dashboard-producteur (React) ou accueil producteur (Flutter)
```

---

## 6. Bugs & corrections

### BUG-01 — CRITIQUE : `getProducteurProduits()` retourne 0 résultats

**Fichier** : `Backend/app/Http/Controllers/API/ProduitController.php` ligne 107  
**Impact** : Un producteur connecté ne voit aucun de ses propres produits dans l'app Flutter et le dashboard.

**Cause** : Confusion entre `utilisateurs.id` et `producteurs.id`.  
`produits.producteur_id` référence `producteurs.id` (table producteurs), mais le code compare avec `auth()->user()->id` (table utilisateurs).

```php
// AVANT — bug :
$query->where('producteur_id', auth()->user()->id);

// APRÈS — fix :
$producteur = auth()->user()->producteur;
if (!$producteur) {
    return response()->json(['data' => []], 200);
}
$query->where('producteur_id', $producteur->id);
```

**Test de validation** : Connecté en tant que producteur, `GET /api/v1/producteur-produits` doit retourner ses produits.

---

### BUG-02 — CRITIQUE : Password admin hardcodé

**Fichier** : `Backend/app/Http/Controllers/API/AuthController.php` lignes 33-36  
**Impact** : Tous les comptes admin partagent le mot de passe `admin1234`. N'importe qui connaissant l'email admin peut se connecter.

```php
// AVANT — bug :
if (str_contains(strtolower($request->email), 'admin@kobyalgre.bf')) {
    $role = 'admin';
    $motDePasse = 'admin1234';
}

// APRÈS — fix :
// Supprimer la logique de hardcode.
// Les admins sont créés manuellement via le CRUD utilisateurs (dashboard).
// Ou générer un password aléatoire + envoi par email :
$motDePasse = Str::random(12);
// Mail::to($email)->send(new CompteAdminCreeMail($email, $motDePasse));
```

**Test de validation** : Il ne doit plus exister de chemin de code permettant de prédire ou forcer un mot de passe admin.

---

### BUG-03 — MAJEUR : `boutique_id` absent du `$fillable` du modèle Utilisateur

**Fichier** : `Backend/app/Models/Utilisateur.php` ligne 14-20  
**Impact** : Quand l'admin crée ou modifie un utilisateur avec un `boutique_id`, le champ est silencieusement ignoré par Eloquent (mass assignment protection). La boutique n'est jamais assignée.

```php
// AVANT — bug :
protected $fillable = [
    'nom', 'email', 'telephone', 'mot_de_passe', 'role'
];

// APRÈS — fix :
protected $fillable = [
    'nom', 'email', 'telephone', 'mot_de_passe', 'role', 'boutique_id'
];
```

**Test de validation** : Créer un utilisateur avec `boutique_id` via le dashboard → vérifier en base que `boutique_id` est bien enregistré.

---

### BUG-04 — MAJEUR : Routes React dupliquées — pages producteur inaccessibles

**Fichier** : `dashboard/src/App.jsx`  
**Impact** : `CommandesProducteur` et `NotificationsProducteur` ne sont jamais rendus car ils partagent le même path que `DashboardProducteur`. React Router affiche toujours le premier match.

```jsx
// AVANT — bug (3 routes avec le même path) :
<Route path="dashboard-producteur" element={<DashboardProducteur />} />
<Route path="dashboard-producteur" element={<CommandesProducteur />} />
<Route path="dashboard-producteur" element={<NotificationsProducteur />} />

// APRÈS — fix (paths distincts) :
<Route path="dashboard-producteur" element={<DashboardProducteur />} />
<Route path="dashboard-producteur/commandes" element={<CommandesProducteur />} />
<Route path="dashboard-producteur/notifications" element={<NotificationsProducteur />} />
```

**Test de validation** : Naviguer vers `/dashboard-producteur/commandes` et `/dashboard-producteur/notifications` — chaque page s'affiche correctement.

---

### BUG-05 — MAJEUR : Aucun flux d'auto-inscription producteur côté public

**Fichier** : `Backend/routes/api.php` + `dashboard/src/pages/admin/Register.jsx`  
**Impact** : Un producteur ne peut pas créer son compte seul. La route `POST /auth/register-producteur` est protégée par le middleware `admin`. Le formulaire `/register` du dashboard ne crée que des clients.

**Fix** :

Option A — Rendre la route publique avec vérification du code boutique :
```php
// routes/api.php
Route::post('/auth/register-producteur', [AuthController::class, 'registerProducteur']);
// (sans middleware admin)
// AuthController::registerProducteur vérifie déjà le code_boutique → suffisant
```

Option B — Ajouter un champ "type de compte" dans `/register` avec vérification code boutique conditionnelle.

**Test de validation** : Un nouvel utilisateur peut créer un compte producteur depuis la page publique `/register` en fournissant un code boutique valide.

---

### BUG-06 — MINEUR : IP réseau hardcodée dans Flutter

**Fichier** : `Flutter_app/lib/services/api_service.dart` ligne 16  
**Impact** : Chaque changement de réseau Wi-Fi ou de machine de développement nécessite une recompilation.

```dart
// AVANT — bug :
static const String _apiBaseUrl = 'http://192.168.43.152:8000/api';

// APRÈS — fix recommandé (--dart-define à la compilation) :
static const String _apiBaseUrl = String.fromEnvironment(
  'API_URL',
  defaultValue: 'http://192.168.43.152:8000/api',
);
// Usage : flutter run --dart-define=API_URL=http://192.168.1.50:8000/api
```

**Test de validation** : Lancer `flutter run --dart-define=API_URL=http://X.X.X.X:8000/api` sans modifier le code source.

---

### BUG-07 — MINEUR : Clé OpenWeather exposée côté frontend

**Fichier** : `dashboard/.env` (`VITE_WEATHER_KEY`)  
**Impact** : La clé API est intégrée dans le bundle JavaScript et visible de n'importe quel visiteur via les DevTools.

**Fix** : Supprimer `VITE_WEATHER_KEY` du `.env` dashboard. Les routes `/v1/meteo/*` du backend existent déjà et proxyfient OpenWeather — les utiliser directement.

**Test de validation** : Le composant `Meteo.jsx` appelle `/api/v1/meteo?ville=X` (backend) et non directement OpenWeather. La clé n'apparaît plus dans le bundle.

---

### BUG-08 — MINEUR : `addProduit()` Flutter — champs manquants

**Fichier** : `Flutter_app/lib/services/api_service.dart` (fonction `addProduit`)  
**Impact** : Les champs `typeproduit_id` et `description` ne sont pas inclus dans la requête `multipart/form-data`. Les produits créés depuis Flutter n'ont pas de type ni de description.

**Fix** : Ajouter les champs dans la requête multipart :
```dart
request.fields['typeproduit_id'] = typeproduitId.toString();
request.fields['description'] = description;
```

**Test de validation** : Créer un produit depuis l'app Flutter → vérifier que `typeproduit_id` et `description` sont enregistrés en base.

---

### BUG-09 — INFO : `ServiceMetheo` CRUD non utilisé

**Fichier** : `Backend/app/Http/Controllers/API/ServiceMetheoController.php`  
**Impact** : Contrôleur CRUD complet mais aucun écran ni logique ne l'utilise. Probablement un ancien système de cache météo remplacé par l'intégration OpenWeather directe.

**Action recommandée** : Confirmer l'inutilité et supprimer (contrôleur + modèle + migration + route) pour éviter la confusion.

---

## 7. Suivi des corrections

| ID | Priorité | Description | Statut | Assigné |
|----|----------|-------------|--------|---------|
| BUG-01 | CRITIQUE | `getProducteurProduits()` — mauvais ID comparé | A faire | — |
| BUG-02 | CRITIQUE | Password admin hardcodé `admin1234` | A faire | — |
| BUG-03 | MAJEUR | `boutique_id` absent du `$fillable` Utilisateur | A faire | — |
| BUG-04 | MAJEUR | Routes React dupliquées (commandes/notifs producteur) | A faire | — |
| BUG-05 | MAJEUR | Pas de flux auto-inscription producteur public | A faire | — |
| BUG-06 | MINEUR | IP réseau hardcodée Flutter | A faire | — |
| BUG-07 | MINEUR | Clé OpenWeather exposée côté frontend | A faire | — |
| BUG-08 | MINEUR | `addProduit()` Flutter — champs manquants | A faire | — |
| BUG-09 | INFO | `ServiceMetheo` CRUD inutilisé | A valider | — |

---

*Audit réalisé le 2026-05-22 — à mettre à jour à chaque correction.*
