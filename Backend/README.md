# Kob-Yalgré — Backend Laravel

API REST pour la plateforme e-agriculture Kob-Yalgré.

## Stack

- **Laravel 12** + PHP 8.2
- **Laravel Sanctum** — authentification par token Bearer
- **SQLite** — base de données
- **OpenWeather API** — météo

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

Le serveur écoute sur `http://127.0.0.1:8000`.

---

## Routes API

Base : `/api`

### Publiques

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/auth/register` | Inscription client |
| POST | `/auth/login` | Connexion |
| POST | `/auth/check-boutique` | Vérification code boutique (producteur) |
| GET | `/v1/produits` | Liste produits |
| GET | `/v1/produits/{id}` | Détail produit |
| GET | `/v1/conseils-agricoles` | Liste conseils |
| GET | `/v1/annonces` | Liste annonces |
| GET | `/v1/typeproduits` | Types de produits |
| GET | `/v1/meteo?ville=X` | Météo par ville |
| GET | `/v1/meteo/coords?lat=X&lon=Y` | Météo par coordonnées GPS |
| GET | `/v1/meteo/previsions?ville=X` | Prévisions 5 jours |

### Authentifiées (Bearer token)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/auth/me` | Utilisateur courant |
| POST | `/auth/logout` | Déconnexion |
| POST | `/v1/produits` | Créer produit (producteur) |
| PUT | `/v1/produits/{id}` | Modifier produit |
| DELETE | `/v1/produits/{id}` | Supprimer produit |
| GET | `/v1/producteur-produits` | Mes produits (producteur) |
| POST | `/v1/commandes` | Créer commande |
| GET | `/v1/commandes` | Mes commandes |
| PUT | `/v1/commandes/{id}` | Modifier statut commande |
| DELETE | `/v1/commandes/{id}` | Annuler commande |
| GET/POST | `/v1/conversations` | Conversations messagerie |
| GET/POST | `/v1/conversations/{id}/messages` | Messages d'une conversation |
| POST | `/v1/conversations/{id}/lire` | Marquer messages comme lus |
| GET | `/v1/notifications` | Mes notifications |
| POST/PUT/DELETE | `/v1/annonces` | CRUD annonces |

### Admin uniquement

| Méthode | Route | Description |
|---------|-------|-------------|
| GET/POST/PUT/DELETE | `/v1/utilisateurs` | CRUD utilisateurs |
| GET/POST | `/v1/clients` | Gestion clients |
| GET/POST | `/v1/producteurs` | Gestion producteurs |
| POST | `/auth/register-producteur` | Créer compte producteur |
| POST/PUT | `/v1/typeproduits` | Gestion types produits |
| GET/PATCH | `/v1/boutiques` | Gestion boutiques |

---

## Structure des dossiers

```
app/
├── Http/Controllers/API/   ← 18 contrôleurs resource
├── Models/                 ← Eloquent (Utilisateur, Produit, Commande…)
└── Http/Middleware/        ← AdminMiddleware

database/
├── migrations/             ← 21 migrations
└── database.sqlite

routes/
├── api.php                 ← Routes API
└── web.php
```

---

## Statuts de commande

```
en_attente  →  confirmee  →  en_cours  →  livree
            ↘  refusee (motif_refus requis)
confirmee   →  annulee (stock restitué automatiquement)
```

La confirmation décrémente le stock. L'annulation le restitue.

---

## Logique boutique (producteurs)

Chaque producteur appartient à une boutique identifiée par un `code_unique`.  
À la connexion, le dashboard React effectue un second appel `POST /auth/check-boutique` avec `{ user_id, code_boutique }` pour valider l'appartenance avant d'autoriser l'accès.

---

## Variables d'environnement importantes

```env
APP_DEBUG=false            # toujours false en production
DB_CONNECTION=sqlite
MAIL_MAILER=smtp           # configurer pour les emails réels
```

---

## Bugs connus — à corriger

### CRITIQUE — `getProducteurProduits()` retourne 0 résultats

**Fichier** : `app/Http/Controllers/API/ProduitController.php:107`

```php
// AVANT (bug) :
$query->where('producteur_id', auth()->user()->id);

// APRÈS (fix) :
$query->where('producteur_id', auth()->user()->producteur->id);
```

`producteur_id` référence `producteurs.id`, pas `utilisateurs.id`. La confusion fait que le producteur connecté ne voit aucun de ses produits.

---

### CRITIQUE — Password admin hardcodé

**Fichier** : `app/Http/Controllers/API/AuthController.php`

```php
// AVANT (bug) :
$motDePasse = 'admin1234';

// APRÈS (fix) :
$motDePasse = Str::random(12);
// → envoyer par email via Mail::to($email)->send(...)
```

---

### MAJEUR — `boutique_id` absent du `$fillable`

**Fichier** : `app/Models/Utilisateur.php`

```php
// AVANT :
protected $fillable = ['nom', 'email', 'telephone', 'mot_de_passe', 'role'];

// APRÈS :
protected $fillable = ['nom', 'email', 'telephone', 'mot_de_passe', 'role', 'boutique_id'];
```

Sans ce correctif, l'assignation de boutique via le dashboard admin est silencieusement ignorée.

---

### MAJEUR — Aucun flux d'inscription producteur public

La route `/auth/register-producteur` est protégée par le middleware `admin`.  
Un producteur ne peut pas s'inscrire lui-même.

**Fix** : Rendre la route publique ou ajouter une page d'inscription producteur avec vérification de code boutique.
