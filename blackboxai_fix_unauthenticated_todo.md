# Fix Sanctum / Unauthenticated

## Constat
- Le frontend appelle `GET /api/v1/utilisateurs?all=true`.
- Console montre `Unauthenticated.` puis `500` côté serveur.
- Cause: Sanctum `auth:sanctum` ne valide pas le token.

## Changements déjà faits
- Debug token dans `dashboard/src/api/axios.js` (commenté).

## Prochaines étapes (à faire maintenant)
1) Vérifier valeur réelle après login admin:
   - `localStorage.getItem('token')`
   - `localStorage.getItem('user')`
2) Corriger le backend pour renvoyer 401/403 proprement.

## Patch backend recommandé (à appliquer)
- Dans `Backend/app/Exceptions/Handler.php`, ajouter un traitement des exceptions liées à Sanctum/auth:
  - `Illuminate\Auth\AuthenticationException`
  - et `Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException`

## Retester
- Ouvrir la page admin Utilisateurs.
- Vérifier que l’erreur devient **401/403** si token absent/invalid (au lieu de 500).


