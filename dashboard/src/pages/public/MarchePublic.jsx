import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2, ShoppingCart, X, Plus, Minus, Trash2, ImageOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// Images
import logo from "../../assets/image/logo.jpeg";
import marcher1 from "../../assets/image/marcher1.jpg";

export default function MarchePublic() {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  // panier: { [produitId]: { produit, quantite } }
  const [panier, setPanier] = useState({});
  const [panierOuvert, setPanierOuvert] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/v1/produits');
        setProduits(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();

    // Recharge un panier déjà existant (compatible objet OU tableau)
    try {
      const saved = localStorage.getItem('panier_en_cours');
      if (saved) {
        const parsed = JSON.parse(saved);

        // Si c'est un tableau (format ConfirmerCommande)
        if (Array.isArray(parsed)) {
          const objet = {};
          parsed.forEach((item) => {
            if (item.id) {
              objet[item.id] = {
                produit: item,
                quantite: Number(item.quantite_choisie || item.quantite || 1),
              };
            }
          });
          setPanier(objet);
        }
        // Si c'est déjà un objet
        else if (parsed && typeof parsed === 'object') {
          setPanier(parsed);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Sauvegarde le panier (toujours en objet tant qu'on est sur le marché)
  useEffect(() => {
    localStorage.setItem('panier_en_cours', JSON.stringify(panier));
  }, [panier]);

  const articlesPanier = Object.values(panier);
  const totalArticles = articlesPanier.reduce((sum, item) => sum + item.quantite, 0);
  const totalMontant = articlesPanier.reduce(
    (sum, item) => sum + (Number(item.produit.prix) || 0) * item.quantite,
    0
  );

  const estDansPanier = (id) => Boolean(panier[id]);

  // Récupère l'URL de l'image du produit
  const getImageUrl = (produit) => {
    const chemin =
      produit.image_url ||
      produit.image ||
      produit.photo_url ||
      produit.photo ||
      (Array.isArray(produit.images) && produit.images[0]) ||
      null;

    if (!chemin) return null;

    if (chemin.startsWith('http')) return chemin;

    const baseURL = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

    if (chemin.startsWith('/storage/')) {
      return `${baseURL}${chemin}`;
    }
    if (chemin.startsWith('storage/')) {
      return `${baseURL}/${chemin}`;
    }

    return `${baseURL}/storage/${chemin.replace(/^\/+/, '')}`;
  };

  const ajouterAuPanier = (produit) => {
    setPanier((prev) => {
      const existant = prev[produit.id];
      return {
        ...prev,
        [produit.id]: {
          produit,
          quantite: existant ? existant.quantite + 1 : 1,
        },
      };
    });
  };

  const retirerDuPanier = (id) => {
    setPanier((prev) => {
      const copie = { ...prev };
      delete copie[id];
      return copie;
    });
  };

  const changerQuantite = (id, delta) => {
    setPanier((prev) => {
      const existant = prev[id];
      if (!existant) return prev;
      const nouvelleQuantite = existant.quantite + delta;
      if (nouvelleQuantite <= 0) {
        const copie = { ...prev };
        delete copie[id];
        return copie;
      }
      return {
        ...prev,
        [id]: { ...existant, quantite: nouvelleQuantite },
      };
    });
  };

  const viderPanier = () => setPanier({});

  // ========== CORRECTION ICI ==========
  const handleValiderPanier = () => {
    if (articlesPanier.length === 0) return;

    // Convertir en TABLEAU (format attendu par ConfirmerCommande)
    const commandeArticles = articlesPanier.map((item) => ({
      ...item.produit,
      quantite_choisie: item.quantite,
      quantite: item.quantite,
    }));

    // On écrase panier_en_cours avec le format tableau
    localStorage.setItem('panier_en_cours', JSON.stringify(commandeArticles));
    localStorage.removeItem('produit_en_cours'); // plus utile

    navigate('/login', {
      state: { redirectAfterLogin: '/ConfirmerCommande' },
    });
  };

  const handleContacterProducteur = (produit) => {
    localStorage.setItem("producteur_a_contacter", JSON.stringify({
      id: produit.producteur_id || produit.user_id,
      nom: produit.producteur_nom || `Producteur de ${produit.nom}`,
      telephone: produit.producteur_telephone || produit.telephone || "+226 "
    }));

    navigate("/login", {
      state: { redirectAfterLogin: "/MessagesClient" }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">

      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-white via-green-50 to-emerald-100 border-b border-green-200 shadow-lg shadow-green-900/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo + Nom */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/40 rounded-2xl blur-md group-hover:blur-lg transition duration-500"></div>
              <img
                src={logo}
                alt="KOB YALGRÉ"
                className="relative w-12 h-12 object-contain rounded-2xl"
              />
            </div>
            <h1 className="text-xl font-black tracking-tight text-green-800">
              KOB YALGRÉ
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
            <Link to="/" className="hover:text-green-600 transition">Accueil</Link>
            <Link to="/apropos" className="hover:text-green-600 transition">À propos</Link>
            <Link to="/marcher" className="text-green-700 font-semibold">Marché</Link>
            <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>
          </nav>

          {/* Boutons droite */}
          <div className="flex items-center gap-3">
            {/* Bouton panier */}
            <button
              onClick={() => setPanierOuvert(true)}
              className="relative bg-white border border-green-200 text-green-700 p-2.5 rounded-xl shadow hover:bg-green-50 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalArticles > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalArticles}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all font-semibold text-sm"
            >
              Connexion
            </button>
          </div>
        </div>
      </header>

      {/* ===================== CONTENU ===================== */}
      <main className="flex-1">

        {/* HERO MARCHÉ avec image de fond marcher1.jpg */}
        <section className="relative py-24 md:py-32 text-center overflow-hidden">
          {/* Image de fond */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${marcher1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>

          {/* Overlay sombre pour bien lire le texte */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/65"></div>

          {/* Contenu */}
          <div className="relative z-10 max-w-3xl mx-auto px-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg">
              Marché Agricole
            </h1>
            <p className="text-white/90 mt-5 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Découvrez, comparez et ajoutez plusieurs produits à votre panier avant de commander.
            </p>
          </div>
        </section>

        {/* PRODUITS */}
        <section className="max-w-6xl mx-auto px-8 py-16 pb-24">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {produits.map((p) => {
                const dansPanier = estDansPanier(p.id);
                const quantite = panier[p.id]?.quantite || 0;
                const imageUrl = getImageUrl(p);

                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-5 border flex flex-col justify-between ${
                      dansPanier ? 'border-green-400 ring-2 ring-green-200' : 'border-green-50'
                    }`}
                  >
                    <div>
                      {/* IMAGE DU PRODUIT */}
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={p.nom}
                          className="w-full h-40 object-cover rounded-xl mb-3"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-40 bg-green-50 rounded-xl mb-3 flex-col items-center justify-center text-green-300 text-sm gap-1"
                        style={{ display: imageUrl ? 'none' : 'flex' }}
                      >
                        <ImageOff className="w-6 h-6" />
                        Pas de photo
                      </div>

                      <h3 className="font-bold text-lg text-gray-900">{p.nom}</h3>
                      <p className="text-green-700 font-bold mt-2 text-lg">{p.prix} FCFA</p>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">{p.description}</p>
                    </div>

                    <div className="mt-4 space-y-2">
                      {dansPanier ? (
                        <div className="w-full flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                          <button
                            onClick={() => changerQuantite(p.id, -1)}
                            className="p-1 rounded-lg hover:bg-green-100 text-green-800"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-green-800 text-sm">{quantite} ajouté(s)</span>
                          <button
                            onClick={() => changerQuantite(p.id, 1)}
                            className="p-1 rounded-lg hover:bg-green-100 text-green-800"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => ajouterAuPanier(p)}
                          className="w-full bg-green-50 text-green-800 border border-green-200 py-2.5 rounded-xl hover:bg-green-100 font-bold text-sm transition flex items-center justify-center gap-1.5"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Ajouter au panier
                        </button>
                      )}

                      <button
                        onClick={() => handleContacterProducteur(p)}
                        className="w-full bg-white text-slate-700 border border-slate-300 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        Contacter / Appeler
                      </button>
                    </div>
                  </div>
                );
              })}

              {produits.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12">
                  Aucun produit disponible pour le moment.
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* BARRE FLOTTANTE PANIER */}
      {!panierOuvert && totalArticles > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md">
          <button
            onClick={() => setPanierOuvert(true)}
            className="w-full bg-green-700 text-white rounded-2xl shadow-xl px-5 py-4 flex items-center justify-between hover:bg-green-800 transition"
          >
            <span className="flex items-center gap-2 font-semibold">
              <ShoppingCart className="w-5 h-5" />
              {totalArticles} article{totalArticles > 1 ? 's' : ''}
            </span>
            <span className="font-bold">{totalMontant.toLocaleString()} FCFA</span>
          </button>
        </div>
      )}

      {/* PANNEAU LATERAL PANIER */}
      {panierOuvert && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPanierOuvert(false)}
          />
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-green-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Mon panier
              </h2>
              <button
                onClick={() => setPanierOuvert(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {articlesPanier.length === 0 ? (
                <div className="text-center text-gray-500 py-16">
                  Votre panier est vide.
                </div>
              ) : (
                articlesPanier.map(({ produit, quantite }) => {
                  const imageUrlPanier = getImageUrl(produit);
                  return (
                    <div
                      key={produit.id}
                      className="flex items-start justify-between gap-3 border-b pb-4"
                    >
                      {imageUrlPanier ? (
                        <img
                          src={imageUrlPanier}
                          alt={produit.nom}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ImageOff className="w-5 h-5 text-green-300" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{produit.nom}</h4>
                        <p className="text-green-700 text-sm font-bold mt-1">
                          {produit.prix} FCFA
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => changerQuantite(produit.id, -1)}
                            className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{quantite}</span>
                          <button
                            onClick={() => changerQuantite(produit.id, 1)}
                            className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between h-full">
                        <button
                          onClick={() => retirerDuPanier(produit.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-gray-800 mt-2">
                          {((Number(produit.prix) || 0) * quantite).toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {articlesPanier.length > 0 && (
              <div className="border-t px-6 py-4 space-y-3">
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>{totalMontant.toLocaleString()} FCFA</span>
                </div>
                <button
                  onClick={handleValiderPanier}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                >
                  Valider mon panier
                </button>
                <button
                  onClick={viderPanier}
                  className="w-full text-red-500 text-sm font-semibold hover:underline"
                >
                  Vider le panier
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-yellow-400">KOB YALGRÉ</h3>
            <p className="mt-3 text-green-100">
              Plateforme agricole dédiée à la mise en relation des producteurs et des consommateurs.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Liens rapides</h4>
            <ul className="space-y-2 text-green-100">
              <li><Link to="/" className="hover:text-yellow-400">Accueil</Link></li>
              <li><Link to="/apropos" className="hover:text-yellow-400">À propos</Link></li>
              <li><Link to="/marche" className="hover:text-yellow-400">Marché</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Contact</h4>
            <p className="text-green-100">📍 Ouagadougou, Burkina Faso</p>
            <p className="text-green-100">📧 contact@kobyalgre.bf</p>
            <p className="text-green-100">📞 +226 54 67 89 34</p>
          </div>
        </div>
        <div className="border-t border-green-700 text-center py-4 text-green-200">
          © 2026 <span className="font-semibold">KOB YALGRÉ</span> — Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}