# Kob-Yalgré — Dashboard React

Interface web pour les administrateurs et producteurs de la plateforme Kob-Yalgré.

## Stack

- **React 19** + Vite 8
- **React Router 7** — navigation
- **TailwindCSS 4** — styles
- **Axios** — appels API
- **Recharts** — graphiques KPI
- **Lucide React** — icônes

## Installation

```bash
npm install
cp .env.example .env   # configurer les variables ci-dessous
npm run dev
```

Le dashboard écoute sur `http://localhost:5173`.

## Variables d'environnement

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_WEATHER_KEY=<clé_openweather>
```

> La clé météo doit idéalement transiter par le backend pour ne pas être exposée
> dans le bundle JS. Voir bug #MINEUR ci-dessous.

---

## Routing

### Public
| Route | Page |
|-------|------|
| `/` | Accueil |
| `/login` | Connexion |
| `/register` | Inscription client |
| `/marcher` | Marché public |
| `/contact` | Contact |
| `/apropos` | À propos |
| `/conversation/:id` | Détail conversation |

### Admin (protégé — rôle `admin`)
| Route | Page |
|-------|------|
| `/admin` | Dashboard KPIs |
| `/admin/utilisateurs` | CRUD utilisateurs |
| `/admin/produits` | CRUD produits |
| `/admin/commandes` | Gestion commandes |
| `/admin/conseils` | CRUD conseils agricoles |
| `/admin/annonces` | CRUD annonces |
| `/admin/typeproduits` | CRUD types de produits |
| `/admin/notifications` | Notifications |
| `/admin/boutiques` | Gestion boutiques |

### Producteur
| Route | Page |
|-------|------|
| `/dashboard-producteur` | Dashboard producteur |
| `/producteur/conseils` | Conseils (vue producteur) |

---

## Authentification

- Token stocké dans `localStorage.token`
- User stocké dans `localStorage.user` (JSON)
- Interceptor Axios : Bearer token ajouté automatiquement à chaque requête
- Erreur 401/403 → nettoyage localStorage → redirection `/login`
- **Connexion producteur en 2 étapes** : credentials → vérification code boutique → accès

---

## Dashboard Admin — KPIs

- Nombre d'utilisateurs, produits, commandes, producteurs, boutiques
- Revenu total (somme commandes livrées)
- Graphique barres : répartition des statuts de commande
- Graphique camembert : répartition des rôles utilisateurs
- Tableau des dernières commandes avec deep-link Flutter :
  ```
  kobyalgre://client/commandes?commandeId=<id>
  ```

---

## Bugs connus — à corriger

### MAJEUR — Routes React dupliquées

**Fichier** : `src/App.jsx`

```jsx
// AVANT (bug) — même path pour 3 composants différents :
<Route path="dashboard-producteur" element={<DashboardProducteur />} />
<Route path="dashboard-producteur" element={<CommandesProducteur />} />      // jamais rendu
<Route path="dashboard-producteur" element={<NotificationsProducteur />} />  // jamais rendu

// APRÈS (fix) — paths distincts :
<Route path="dashboard-producteur" element={<DashboardProducteur />} />
<Route path="dashboard-producteur/commandes" element={<CommandesProducteur />} />
<Route path="dashboard-producteur/notifications" element={<NotificationsProducteur />} />
```

`CommandesProducteur` et `NotificationsProducteur` sont actuellement inaccessibles.

---

### MINEUR — Clé OpenWeather exposée côté frontend

La variable `VITE_WEATHER_KEY` est intégrée dans le bundle JavaScript et visible de tous.

**Fix** : Supprimer la clé du `.env` frontend et passer tous les appels météo via le backend (les routes `/v1/meteo/*` existent déjà).
