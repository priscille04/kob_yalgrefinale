import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import api from "../../api/axios";

export default function CommandeClient() {
  const navigate = useNavigate();

  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCommandes();
  }, []);

  const loadCommandes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Même route que le backend : GET /v1/client/commandes -> mesCommandes()
      const res = await api.get("/v1/client/commandes");
      const data = res.data?.data ?? res.data ?? [];
      console.log(data);

      setCommandes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[Client] Erreur loadCommandes:", err?.response?.data ?? err);
      setError("Impossible de charger vos commandes.");
    } finally {
      setLoading(false);
    }
  };

  
  const getStatus = (statut) => {
    switch (statut) {
      case "en_attente":
        return (
          <span className="flex items-center gap-2 text-yellow-600 font-semibold">
            <FaClock />
            En attente
          </span>
        );

      case "en_cours":
        return (
          <span className="flex items-center gap-2 text-blue-600 font-semibold">
            <FaTruck />
            En cours de livraison
          </span>
        );

      case "livree":
        return (
          <span className="flex items-center gap-2 text-green-700 font-semibold">
            <FaBoxOpen />
            Livrée
          </span>
        );

      case "annulee":
        return (
          <span className="flex items-center gap-2 text-red-600 font-semibold">
            <FaTimesCircle />
            Annulée
          </span>
        );

      default:
        return (
          <span className="flex items-center gap-2 text-gray-500 font-semibold">
            <FaCheckCircle />
            {statut || "Statut inconnu"}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard-client")}
          className="flex items-center gap-2 text-green-700 font-semibold mb-6 hover:text-green-900 transition"
        >
          <FaArrowLeft />
          Retour au tableau de bord
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-green-700">Mes commandes</h1>

            <button
              onClick={loadCommandes}
              className="text-sm text-green-700 font-semibold hover:underline"
            >
              Actualiser
            </button>
          </div>

          <p className="text-gray-500 mb-8">
            Retrouvez toutes les commandes que vous avez effectuées.
          </p>

          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          )}

          {!loading && error && (
            <div className="text-center text-red-500 py-10">{error}</div>
          )}

          {!loading && !error && commandes.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              Aucune commande pour le moment.
            </div>
          )}

          {!loading && !error && commandes.length > 0 && (
            <div className="space-y-5">
              {commandes.map((commande) => (
                <div
                  key={commande.id}
                  className="border rounded-2xl p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {commande.produit?.nom || "Produit"}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Producteur :{" "}
                        {commande.produit?.producteur?.utilisateur?.nom ||
                          "Producteur"}
                      </p>

                      <p className="text-gray-500">
                        Date :{" "}
                        {commande.created_at
                          ? new Date(commande.created_at).toLocaleDateString(
                              "fr-FR"
                            )
                          : "-"}
                      </p>

                      <p className="mt-3">
                        <span className="font-semibold">Quantité :</span>{" "}
                        {commande.quantite}
                      </p>

                      <p className="text-green-700 font-bold text-lg mt-2">
                        {parseFloat(commande.total || 0).toLocaleString(
                          "fr-FR"
                        )}{" "}
                        FCFA
                      </p>
                    </div>

                    <div>{getStatus(commande.statut)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
