# Kob-Yalgré — Application Mobile Flutter

Application mobile client et producteur pour la plateforme Kob-Yalgré.

## Stack

- **Flutter 3.11** + Dart
- **Provider 6.1** — gestion d'état
- **http 1.6** — appels API REST
- **SharedPreferences 2.5** — stockage local (token, user)
- **Geolocator 12** — GPS
- **image_picker 1.0** — sélection photo
- **Permission Handler 11** — permissions système
- **Intl 0.20** — formatage dates

## Installation

```bash
flutter pub get
```

Modifier l'IP du backend dans `lib/services/api_service.dart` :

```dart
static const String _apiBaseUrl = 'http://<IP_DU_SERVEUR>:8000/api';
```

> Pour l'émulateur Android, utiliser `10.0.2.2` à la place de `localhost`.
> Pour un appareil physique, utiliser l'IP locale du serveur sur le réseau Wi-Fi.

```bash
flutter run
```

---

## Écrans & Navigation

### Authentification
| Route | Écran | Accès |
|-------|-------|-------|
| `/login` | Connexion | Public |
| `/register` | Inscription | Public |

### Client
| Route | Écran |
|-------|-------|
| `/home` | Accueil → redirection selon rôle |
| `/produits` | Catalogue + recherche |
| `/commandes` | Mes commandes + filtres statut |
| `/annonces` | Annonces producteurs |
| `/meteo` | Météo (ville ou GPS) |
| `/conseils` | Conseils agricoles |
| `/messages` | Conversations (liste) |
| `/messages/:id` | Chat (détail + envoi) |
| `/notifications` | Notifications |
| `/profile` | Profil utilisateur |

### Producteur
| Route | Écran |
|-------|-------|
| `/home` | Dashboard producteur |
| `/produits` | Mes produits (CRUD) |
| `/produits/ajouter` | Ajouter produit (+ image) |
| `/commandes` | Commandes à traiter |
| `/notifications` | Notifications |
| `/meteo` | Météo |
| `/conseils` | Conseils agricoles |
| `/ussd` | Codes USSD (en développement) |

---

## Authentification

1. `login()` → token + user stockés dans SharedPreferences
2. Au démarrage : appel `GET /auth/me` pour valider le token
3. Si erreur réseau : session locale conservée
4. `logout()` → suppression token + user → redirection `/login`

---

## Services API

Tous les appels passent par `lib/services/api_service.dart`.

- Header `Authorization: Bearer <token>` ajouté automatiquement
- Timeout : 5 secondes par requête
- Upload image : `multipart/form-data`
- URL image : `http://<IP>:8000/storage/produits/<fichier>`

---

## Gestion des commandes

| Statut | Action disponible côté client |
|--------|-------------------------------|
| `en_attente` | Annuler |
| `confirmee` | — |
| `en_cours` | — |
| `livree` | — |
| `refusee` | Voir motif |
| `annulee` | — |

---

## Bugs connus — à corriger

### MINEUR — IP réseau hardcodée

**Fichier** : `lib/services/api_service.dart:16`

```dart
// AVANT (bug) :
static const String _apiBaseUrl = 'http://192.168.43.152:8000/api';

// APRÈS (fix recommandé) :
// Utiliser flutter_dotenv ou --dart-define pour injecter l'URL à la compilation
// Exemple : flutter run --dart-define=API_URL=http://192.168.1.10:8000/api
```

L'IP change à chaque réseau. En l'état, un changement de Wi-Fi rend l'app non fonctionnelle sans recompilation.

---

### MINEUR — `addProduit()` : champs manquants

**Fichier** : `lib/services/api_service.dart`

La fonction `addProduit()` n'envoie pas `typeproduit_id` ni `description` dans la requête multipart.

**Fix** : Ajouter les champs manquants dans la requête `multipart/form-data`.
