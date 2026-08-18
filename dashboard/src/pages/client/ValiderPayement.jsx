import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import {
  Loader2,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  Smartphone,
  Lock,
} from "lucide-react";

// Liste des modes de paiement disponibles
const MODES_PAYEMENT = [
  {
    id: "om",
    nom: "Orange Money",
    couleur: "border-orange-500 bg-orange-50",
    couleurActif: "ring-2 ring-orange-500 border-orange-500 bg-orange-100",
    logo: "🟠",
  },
  {
    id: "moov",
    nom: "Moov Money",
    couleur: "border-blue-500 bg-blue-50",
    couleurActif: "ring-2 ring-blue-500 border-blue-500 bg-blue-100",
    logo: "🔵",
  },
  {
    id: "wave",
    nom: "Wave",
    couleur: "border-cyan-500 bg-cyan-50",
    couleurActif: "ring-2 ring-cyan-500 border-cyan-500 bg-cyan-100",
    logo: "🌊",
  },
];

export default function ValiderPayement() {
  const navigate = useNavigate();
  const location = useLocation();

  // ========== RÉCUPÉRATION DU PANIER ==========
  const state = location.state || {};
  const panier = state.panier || [];
  const total = state.total || 0;

  // Sécurité : si pas de panier → message d'erreur
  if (!panier || panier.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <p className="text-red-600 font-bold text-lg">
          Informations de commande manquantes.
        </p>
        <button
          onClick={() => navigate("/marcher")}
          className="mt-4 bg-green-600 text-white px-5 py-2 rounded-xl"
        >
          Retour marché
        </button>
      </div>
    );
  }

  const [methodePayement, setMethodePayement] = useState("om");
  const [numeroTelephone, setNumeroTelephone] = useState("");
  const [codeSecret, setCodeSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!numeroTelephone) {
      setError("Veuillez entrer votre numéro de paiement.");
      setLoading(false);
      return;
    }

    if (!codeSecret) {
      setError("Veuillez entrer votre code secret.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      // Ici tu peux appeler une route de paiement si tu en as une.
      // Pour l'instant on simule juste le succès du paiement
      // car les commandes ont déjà été créées dans ConfirmerCommande.

      // Exemple si tu as une route de paiement :
      // await api.post("/v1/paiements", {
      //   methode_paiement: methodePayement,
      //   telephone_paiement: numeroTelephone,
      //   montant: total,
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // Nettoyage
      localStorage.removeItem("panier_en_cours");
      localStorage.removeItem("produit_en_cours");
      localStorage.removeItem("commande_paiement");

      navigate("/client/dashboard-client", {
        state: {
          successMessage: `Paiement réussi de ${total.toLocaleString()} FCFA. Votre commande est confirmée.`,
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Erreur pendant le paiement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour
        </button>

        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-bold text-gray-800">
            Valider le paiement
          </h1>
        </div>

        {/* ========== RÉCAPITULATIF DU PANIER ========== */}
        <div className="bg-gray-100 rounded-xl p-4 mb-6 space-y-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Récapitulatif de votre commande :
          </p>

          {panier.map((item, index) => {
            const qte = Number(item.quantite_choisie) || 1;
            const prix = Number(item.prix) || 0;
            const sousTotal = prix * qte;

            return (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.nom}</span>
                  <span className="text-gray-500"> × {qte}</span>
                </div>
                <span className="font-semibold">
                  {sousTotal.toLocaleString()} FCFA
                </span>
              </div>
            );
          })}

          <div className="border-t border-gray-300 pt-3 mt-2 flex justify-between">
            <span className="font-bold text-gray-800">Total</span>
            <span className="text-lg font-bold text-green-700">
              {total.toLocaleString()} FCFA
            </span>
          </div>
        </div>

        <form onSubmit={handlePayer} className="space-y-5">
          {/* Choix du mode de paiement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choisissez votre mode de paiement
            </label>

            <div className="grid grid-cols-3 gap-3">
              {MODES_PAYEMENT.map((mode) => (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => setMethodePayement(mode.id)}
                  className={`flex flex-col items-center justify-center border rounded-xl py-3 transition ${
                    methodePayement === mode.id
                      ? mode.couleurActif
                      : mode.couleur
                  }`}
                >
                  <span className="text-2xl mb-1">{mode.logo}</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {mode.nom}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Numéro de téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
            </label>
            <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <Smartphone className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="tel"
                placeholder="Ex: 70 00 00 00"
                value={numeroTelephone}
                onChange={(e) => setNumeroTelephone(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Code secret */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code secret / Mot de passe
            </label>
            <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <Lock className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="••••••"
                value={codeSecret}
                onChange={(e) => setCodeSecret(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
          )}

          {/* Sécurité */}
          <div className="flex items-center text-xs text-gray-500 gap-1">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Paiement sécurisé
          </div>

          {/* Bouton valider */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Traitement...
              </>
            ) : (
              `Payer ${total.toLocaleString()} FCFA`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}