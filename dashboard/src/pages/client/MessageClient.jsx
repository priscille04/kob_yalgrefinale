import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaBell,
  FaCheckDouble,
  FaHeadset,
  FaSearch,
  FaPhoneAlt,
  FaEllipsisV,
  FaPaperclip,
  FaCircle,
  FaComments,
} from "react-icons/fa";

export default function MessageClient() {
  const navigate = useNavigate();
  const finDesMessagesRef = useRef(null);

  const [nouveauMessage, setNouveauMessage] = useState("");
  const [recherche, setRecherche] = useState("");
  const [notifOuvertes, setNotifOuvertes] = useState(false);
  const [vueMobile, setVueMobile] = useState("liste");

  // Producteur sélectionné depuis le marché
  const [producteurMarche] = useState(() => {
    try {
      const saved = localStorage.getItem("producteur_a_contacter");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Aucune conversation ouverte par défaut
  const [activeChannel, setActiveChannel] = useState(null);

  const [notifications] = useState([
    {
      id: 1,
      titre: "Commande expédiée",
      description: "Votre commande #1042 a été prise en charge.",
      temps: "Il y a 12 min",
      lu: false,
    },
    {
      id: 2,
      titre: "Nouveau message",
      description: "Vous avez reçu un nouveau message.",
      temps: "Il y a 1h",
      lu: false,
    },
  ]);

  const [messages, setMessages] = useState(() => {
    const base = [
      {
        id: 1,
        canal: "support",
        expediteur: "Support",
        nom: "Support KOB YALGRÉ",
        texte: "Bonjour, bienvenue sur KOB YALGRÉ. Comment pouvons-nous vous aider ?",
        heure: "09:42",
      },
    ];

    if (producteurMarche) {
      base.push({
        id: Date.now(),
        canal: "producteur_selectionne",
        expediteur: "Producteur",
        nom: producteurMarche.nom,
        texte: "Bonjour, vous m'avez contacté depuis le marché. Je suis disponible.",
        heure: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    return base;
  });

  // Liste des discussions (sans Jean)
  const discussions = [
    ...(producteurMarche
      ? [
          {
            id: "producteur_selectionne",
            nom: producteurMarche.nom || "Producteur",
            sousTitre: "Contacté depuis le marché",
            initiale: (producteurMarche.nom || "P").charAt(0).toUpperCase(),
            couleur: "bg-emerald-600",
            enLigne: true,
          },
        ]
      : []),
    {
      id: "support",
      nom: "Support KOB YALGRÉ",
      sousTitre: "Assistance client",
      initiale: "S",
      couleur: "bg-amber-600",
      enLigne: true,
      isSupport: true,
    },
  ];

  const discussionsFiltrees = discussions.filter((d) =>
    d.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const nonLus = notifications.filter((n) => !n.lu).length;
  const discussionActive = discussions.find((d) => d.id === activeChannel);
  const messagesActifs = activeChannel
    ? messages.filter((m) => m.canal === activeChannel)
    : [];

  const dernierMessage = (canal) => {
    const msgs = messages.filter((m) => m.canal === canal);
    return msgs[msgs.length - 1] || null;
  };

  const envoyerMessage = (e) => {
    e?.preventDefault();
    if (!nouveauMessage.trim() || !activeChannel) return;

    const message = {
      id: Date.now(),
      canal: activeChannel,
      expediteur: "Client",
      nom: "Vous",
      texte: nouveauMessage.trim(),
      heure: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, message]);
    setNouveauMessage("");

    // Réponse automatique
    setTimeout(() => {
      const reponses = {
        support: [
          "Merci pour votre message. Un conseiller va vous répondre rapidement.",
          "Nous avons bien reçu votre demande.",
        ],
        producteur_selectionne: [
          "Merci, je vous réponds dès que possible.",
          "Bien reçu.",
        ],
      };
      const liste = reponses[activeChannel] || reponses.support;
      const texte = liste[Math.floor(Math.random() * liste.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          canal: activeChannel,
          expediteur: activeChannel === "support" ? "Support" : "Producteur",
          nom: discussionActive?.nom || "Interlocuteur",
          texte,
          heure: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1300);
  };

  useEffect(() => {
    if (activeChannel) {
      finDesMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeChannel]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* BARRE DU HAUT */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/client/dashboard-client")}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-green-700"
        >
          <FaArrowLeft className="text-xs" />
          Tableau de bord
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOuvertes((v) => !v)}
            className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-green-50 hover:text-green-700"
          >
            <FaBell />
            {nonLus > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {nonLus}
              </span>
            )}
          </button>

          {notifOuvertes && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 font-semibold text-sm text-slate-700">
                Notifications
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-slate-50 last:border-0 ${
                      !n.lu ? "bg-green-50/50" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-800">{n.titre}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{n.temps}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENEUR PRINCIPAL */}
      <div className="flex-1 flex max-w-6xl w-full mx-auto my-4 rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
        
        {/* LISTE DES DISCUSSIONS */}
        <div
          className={`w-full md:w-[340px] border-r border-slate-200 flex flex-col ${
            vueMobile === "liste" ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Discussions</h2>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-100 border-0 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {discussionsFiltrees.length === 0 ? (
              <p className="text-center text-sm text-slate-400 mt-10">
                Aucune discussion
              </p>
            ) : (
              discussionsFiltrees.map((d) => {
                const dernier = dernierMessage(d.id);
                const estActif = activeChannel === d.id;

                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveChannel(d.id);
                      setVueMobile("discussion");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition ${
                      estActif ? "bg-green-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full ${d.couleur} text-white flex items-center justify-center font-bold`}
                      >
                        {d.isSupport ? <FaHeadset /> : d.initiale}
                      </div>
                      {d.enLigne && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800 truncate">{d.nom}</p>
                        {dernier && (
                          <span className="text-[11px] text-slate-400">{dernier.heure}</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate mt-0.5">
                        {dernier
                          ? `${dernier.expediteur === "Client" ? "Vous : " : ""}${dernier.texte}`
                          : d.sousTitre}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ZONE DE DISCUSSION */}
        <div
          className={`flex-1 flex flex-col ${
            vueMobile === "discussion" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Si aucune discussion sélectionnée */}
          {!activeChannel ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
              <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center mb-4">
                <FaComments className="text-3xl opacity-40" />
              </div>
              <p className="font-medium text-slate-500 text-lg">Sélectionnez une discussion</p>
              <p className="text-sm mt-1">Choisissez une conversation pour commencer</p>
            </div>
          ) : (
            <>
              {/* En-tête */}
              <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveChannel(null);
                      setVueMobile("liste");
                    }}
                    className="md:hidden w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600"
                  >
                    <FaArrowLeft className="text-sm" />
                  </button>

                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        discussionActive?.couleur || "bg-green-700"
                      } text-white flex items-center justify-center font-bold`}
                    >
                      {discussionActive?.isSupport ? (
                        <FaHeadset />
                      ) : (
                        discussionActive?.initiale || "?"
                      )}
                    </div>
                    {discussionActive?.enLigne && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {discussionActive?.nom}
                    </h3>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <FaCircle className="text-[6px]" />
                      En ligne
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">
                    <FaPhoneAlt className="text-sm" />
                  </button>
                  <button className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">
                    <FaEllipsisV className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50">
                {messagesActifs.map((msg) => {
                  const estMoi = msg.expediteur === "Client";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${estMoi ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                          estMoi
                            ? "bg-green-600 text-white rounded-br-md"
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-md"
                        }`}
                      >
                        {!estMoi && (
                          <p className="text-[11px] font-semibold text-green-700 mb-1">
                            {msg.nom}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed">{msg.texte}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            estMoi ? "text-green-100" : "text-slate-400"
                          }`}
                        >
                          <span className="text-[10px]">{msg.heure}</span>
                          {estMoi && <FaCheckDouble className="text-[10px]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={finDesMessagesRef} />
              </div>

              {/* Zone de saisie */}
              <form
                onSubmit={envoyerMessage}
                className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
              >
                <button
                  type="button"
                  className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center"
                >
                  <FaPaperclip />
                </button>

                <input
                  type="text"
                  value={nouveauMessage}
                  onChange={(e) => setNouveauMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 border-0 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />

                <button
                  type="submit"
                  disabled={!nouveauMessage.trim()}
                  className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white flex items-center justify-center"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}