# Deep-link Dashboard -> Flutter

But : depuis le Dashboard (React), rediriger le client vers son espace Flutter après une action (ex: mise à jour d’une commande).

## 1) React (Dashboard)
Fichier : `kob_yalgre/dashboard/src/pages/admin/Commandes.jsx`
- Quand le statut change, on fait :
  - `window.location.href = `kobyalgre://client/commandes?commandeId=${id}`;`

## 2) Flutter
Il faut configurer un deep-link du schéma `kobyalgre://` vers Flutter.
- Exemple côté Flutter : utiliser `uni_links` (ou `app_links`) et écouter l’URL.
- Dans le listener, router vers :
  - `/client/commandes`
  - et récupérer `commandeId` si présent.

## 3) Important
- Ces lignes ne “connectent” pas React et Flutter directement : elles ouvrent une URL système.
- Tant que le deep-link n’est pas configuré dans Flutter (AndroidManifest/iOS + code listener), le redirect ne fera rien.

