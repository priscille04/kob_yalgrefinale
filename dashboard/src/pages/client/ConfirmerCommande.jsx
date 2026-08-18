import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";

export default function ConfirmerCommande() {
  const navigate = useNavigate();
  const location = useLocation();

  // ========== RÉCUPÉRATION DU PANIER (compatible objet + tableau) ==========
  const [panier, setPanier] = useState(() => {
    try {
      // 1. Depuis le state de navigation
      if (location.state?.panier && Array.isArray(location.state.panier) && location.state.panier.length > 0) {
        localStorage.setItem("panier_en_cours", JSON.stringify(location.state.panier));
        return location.state.panier.map((p) => ({
          ...p,
          quantite_choisie: Number(p.quantite_choisie) || Number(p.quantite) || 1,
        }));
      }

      // 2. Ancien système : un seul produit
      if (location.state?.produit) {
        const item = {
          ...location.state.produit,
          quantite_choisie: 1,
        };
        localStorage.setItem("panier_en_cours", JSON.stringify([item]));
        return [item];
      }

      // 3. Depuis localStorage
      const saved = localStorage.getItem("panier_en_cours");
      if (saved) {
        const parsed = JSON.parse(saved);

        // Cas A : c'est déjà un tableau
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            quantite_choisie: Number(p.quantite_choisie) || Number(p.quantite) || 1,
          }));
        }

        // Cas B : c'est un objet { id: { produit, quantite } }
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const tableau = Object.values(parsed).map((item) => ({
            ...item.produit,
            quantite_choisie: Number(item.quantite) || 1,
          }));
          if (tableau.length > 0) {
            // On normalise tout de suite en tableau
            localStorage.setItem("panier_en_cours", JSON.stringify(tableau));
            return tableau;
          }
        }
      }

      // 4. Ancien localStorage produit_en_cours
      const oldProduct = localStorage.getItem("produit_en_cours");
      if (oldProduct) {
        const p = JSON.parse(oldProduct);
        const item = { ...p, quantite_choisie: 1 };
        localStorage.setItem("panier_en_cours", JSON.stringify([item]));
        return [item];
      }

      return [];
    } catch (e) {
      console.error("Erreur lecture panier :", e);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vérification connexion
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (panier.length > 0) {
        localStorage.setItem("panier_en_cours", JSON.stringify(panier));
      }
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Veuillez vous connecter pour commander.",
        },
      });
    }
  }, [navigate, location.pathname]);

  // ========== PANIER VIDE ==========
  if (!panier || panier.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-green-100">
          <p className="text-red-600 font-bold text-xl">Aucun produit sélectionné</p>
          <p className="text-gray-500 mt-2 text-sm">
            Votre panier est vide. Retournez au marché pour ajouter des produits.
          </p>
          <button
            onClick={() => navigate("/marcher")}
            className="mt-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
          >
            Retour au marché
          </button>
        </div>
      </div>
    );
  }

  // ========== FONCTIONS ==========
  const updateQuantite = (index, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) return;
    const stockMax = Number(panier[index].quantite || panier[index].stock || 1000);
    if (nouvelleQuantite > stockMax) return;

    const nouveauPanier = [...panier];
    nouveauPanier[index] = {
      ...nouveauPanier[index],
      quantite_choisie: nouvelleQuantite,
    };
    setPanier(nouveauPanier);
    localStorage.setItem("panier_en_cours", JSON.stringify(nouveauPanier));
  };

  const supprimerProduit = (index) => {
    const nouveauPanier = panier.filter((_, i) => i !== index);
    setPanier(nouveauPanier);
    localStorage.setItem("panier_en_cours", JSON.stringify(nouveauPanier));
  };

  // ========== TOTAL = somme de TOUS les produits ==========
  const total = panier.reduce((sum, item) => {
    const prix = Number(item.prix) || 0;
    const qte = Number(item.quantite_choisie) || 1;
    return sum + prix * qte;
  }, 0);

 const handleConfirmation = async () => {
  setLoading(true);
  setError(null);
  const token = localStorage.getItem("token");

  try {
    // On envoie UNE commande par produit (format attendu par ton API)
    for (const item of panier) {
      await api.post(
        "/v1/commandes",
        {
          produit_id: item.id,
          quantite: Number(item.quantite_choisie) || 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
    }

    // On vide le panier
    localStorage.removeItem("panier_en_cours");
    localStorage.removeItem("produit_en_cours");

    // Redirection vers la page de paiement
    navigate("/client/valider-payement", {
      state: {
        panier: panier,
        total: total,
      },
    });

  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message ||
        "Une erreur est survenue lors de la validation de la commande."
    );
  } finally {
    setLoading(false);
  }
};

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-3xl border border-green-100">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-900">
            Confirmer votre commande
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Vérifiez les produits de votre panier avant de valider.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Liste des produits */}
        <div className="space-y-4">
          {panier.map((item, index) => {
            const qte = Number(item.quantite_choisie) || 1;
            const prix = Number(item.prix) || 0;
            const sousTotal = prix * qte;
            const stockMax = Number(item.quantite || item.stock || 1000);

            return (
              <div
                key={`${item.id || index}-${index}`}
                className="border border-green-100 bg-green-50/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-800">
                    {item.nom || "Produit sans nom"}
                  </h2>
                  <p className="text-green-700 font-semibold mt-0.5">
                    {prix.toLocaleString()} FCFA / kg
                  </p>
                  {(item.quantite || item.stock) && (
                    <p className="text-gray-500 text-xs mt-1">
                      Stock : {stockMax} kg
                    </p>
                  )}
                </div>

                {/* Quantité */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantite(index, qte - 1)}
                    disabled={loading || qte <= 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-bold transition disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="text-lg font-extrabold text-gray-900 min-w-[50px] text-center">
                    {qte} kg
                  </span>
                  <button
                    onClick={() => updateQuantite(index, qte + 1)}
                    disabled={loading || qte >= stockMax}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-600 hover:bg-green-700 text-white text-xl font-bold transition disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                {/* Sous-total + supprimer */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:min-w-[140px]">
                  <p className="font-bold text-gray-900">
                    {sousTotal.toLocaleString()} FCFA
                  </p>
                  <button
                    onClick={() => supprimerProduit(index)}
                    disabled={loading}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition disabled:opacity-40"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========== MONTANT TOTAL + NOMBRE DE PRODUITS ========== */}
        <div className="mt-8 bg-gradient-to-r from-green-700 to-emerald-600 text-white p-5 sm:p-6 rounded-2xl shadow-lg">
          <h3 className="text-green-100 font-medium text-sm uppercase tracking-wider">
            Montant total
          </h3>
          <p className="text-3xl sm:text-4xl font-black mt-1">
            {total.toLocaleString()} FCFA
          </p>
          <p className="text-green-100 text-sm mt-2">
            {panier.length} produit{panier.length > 1 ? "s" : ""}
          </p>
        </div>

       
       {/* Boutons */}
<div className="mt-8 space-y-3">
  <button
    onClick={handleConfirmation}
    disabled={loading || panier.length === 0}
    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
  >
    {loading ? (
      <>
        <Loader2 className="w-5 h-5 animate-spin" />
        Traitement en cours...
      </>
    ) : (
      "Valider et payer"
    )}
  </button>

  <button
    onClick={() => {
      localStorage.removeItem("panier_en_cours");
      localStorage.removeItem("produit_en_cours");
      navigate("/marcher");
    }}
    disabled={loading}
    className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold transition disabled:opacity-50"
  >
    Annuler et retourner au marché
  </button>
        </div>
      </div>
    </div>
  );
}