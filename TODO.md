# TODO (Connexion Admin/Producteur/Client)

- [ ] Inspecter routes API existantes et implémentations OTP admin (backend)
- [ ] Mettre à jour le dashboard : transformer `/login` en écran “Choix rôle”
- [ ] Ajouter écran login producteur/client (email + mot de passe) si nécessaire (ou réutiliser existant)
- [ ] Ajouter flow admin OTP : écran email → envoi code → écran validation code
- [ ] Mettre à jour `AuthContext.jsx` pour supporter send/verify OTP
- [ ] Mettre à jour `PublicHome`/pages publiques pour naviguer vers `/login` (qui devient le choix rôle)
- [ ] Vérifier navigation après login : admin → `/admin`, producteur → `/dashboard-producteur`, client → `/`
- [ ] Vérifier fonctionnement OTP admin via mails/logs

