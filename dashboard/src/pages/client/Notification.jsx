import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaBoxOpen,
} from "react-icons/fa";

export default function Notification() {
  const navigate = useNavigate();

  // Données fictives (à remplacer plus tard par l'API)
  const notifications = [
    {
      id: 1,
      type: "confirmation",
      titre: "Commande confirmée",
      message:
        "Le producteur Jean OUEDRAOGO a confirmé votre commande de Tomates fraîches.",
      date: "30 Juin 2026 - 09:15",
      lu: false,
    },
    {
      id: 2,
      type: "livraison",
      titre: "Commande en livraison",
      message:
        "Votre commande de Maïs est en cours de livraison.",
      date: "29 Juin 2026 - 15:40",
      lu: false,
    },
    {
      id: 3,
      type: "attente",
      titre: "Commande en attente",
      message:
        "Votre commande d'Oignons est en attente de validation par le producteur.",
      date: "28 Juin 2026 - 11:20",
      lu: true,
    },
    {
      id: 4,
      type: "livree",
      titre: "Commande livrée",
      message:
        "Votre commande de Riz a été livrée avec succès.",
      date: "27 Juin 2026 - 18:10",
      lu: true,
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "confirmation":
        return (
          <FaCheckCircle className="text-green-600 text-2xl" />
        );

      case "livraison":
        return (
          <FaTruck className="text-blue-600 text-2xl" />
        );

      case "attente":
        return (
          <FaClock className="text-yellow-600 text-2xl" />
        );

      default:
        return (
          <FaBoxOpen className="text-green-700 text-2xl" />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-8">

        {/* HEADER */}

        <button
          onClick={() => navigate("/dashboard-client")}
          className="flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition mb-6"
        >
          <FaArrowLeft />
          Retour au tableau de bord
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex items-center gap-3 mb-2">

            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <FaBell className="text-green-700 text-xl" />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-green-700">
                Notifications
              </h1>

              <p className="text-gray-500">
                Consultez les dernières informations concernant vos commandes.
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-5">            {notifications.length > 0 ? (

              notifications.map((notification) => (

                <div
                  key={notification.id}
                  className={`border rounded-2xl p-5 transition hover:shadow-lg ${
                    notification.lu
                      ? "bg-white"
                      : "bg-green-50 border-green-300"
                  }`}
                >

                  <div className="flex justify-between items-start">

                    <div className="flex gap-4">

                      <div className="mt-1">
                        {getIcon(notification.type)}
                      </div>

                      <div>

                        <h2 className="text-xl font-bold text-gray-800">
                          {notification.titre}
                        </h2>

                        <p className="text-gray-600 mt-2 leading-relaxed">
                          {notification.message}
                        </p>

                        <p className="text-sm text-gray-400 mt-3">
                          {notification.date}
                        </p>

                      </div>

                    </div>

                    {!notification.lu && (
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Nouveau
                      </span>
                    )}

                  </div>

                </div>

              ))

            ) : (

              <div className="text-center py-16">

                <FaBell className="text-5xl text-gray-300 mx-auto mb-4" />

                <h3 className="text-2xl font-bold text-gray-700">
                  Aucune notification
                </h3>

                <p className="text-gray-500 mt-2">
                  Vous n'avez reçu aucune notification pour le moment.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}