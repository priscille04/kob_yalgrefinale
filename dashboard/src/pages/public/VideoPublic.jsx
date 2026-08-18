import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import sub from "../../assets/image/sub.jpg";
import logo from "../../assets/image/logo.jpeg";

// VIDEOS
import video1 from "../../assets/image/video1.mp4";
import video2 from "../../assets/image/video2.mp4";
import video3 from "../../assets/image/video3.mp4";
import video4 from "../../assets/image/video4.mp4";
import video5 from "../../assets/image/video5.mp4";
import video6 from "../../assets/image/video6.mp4";
import video7 from "../../assets/image/video7.mp4";
import video8 from "../../assets/image/video8.mp4";
import video9 from "../../assets/image/video9.mp4";
import video10 from "../../assets/image/video10.mp4";

export default function VideoPublic() {
  const [user, setUser] = useState({
    nom: "",
    numero: "",
  });

  const [step, setStep] = useState(1);
  const [methode, setMethode] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const videos = [
    video1, video2, video3, video4, video5,
    video6, video7, video8, video9, video10
  ];

  const descriptions = [
    "Introduction aux techniques agricoles modernes.",
    "Préparation du sol et semences.",
    "Irrigation efficace.",
    "Utilisation des engrais.",
    "Protection des cultures.",
    "Récolte et conservation.",
    "Gestion de ferme.",
    "Élevage complémentaire.",
    "Commercialisation digitale.",
    "Conclusion et conseils pratiques."
  ];

  // PAIEMENT + ACCES
  const handlePayment = async () => {
    if (!user.nom || !user.numero || !methode) {
      alert("Veuillez remplir toutes les informations");
      return;
    }

    try {
      setLoading(true);

      // 1. créer abonnement
      const create = await axios.post(
        "http://127.0.0.1:8000/api/create-subscription",
        {
          nom: user.nom,
          numero: user.numero,
          type: "mois",
          montant: 200,
        }
      );

      const subscription = create.data.subscription;

      // 2. paiement simulé
      await axios.post("http://127.0.0.1:8000/api/payment", {
        subscription_id: subscription.id,
        methode: methode,
      });

      // 3. accès e-learning
      await axios.post("http://127.0.0.1:8000/api/access-elearning", {
        code: subscription.code_abonnement,
      });

      setIsAllowed(true);
      setLoading(false);

    } catch (error) {
      console.log(error);
      alert("Erreur paiement ou serveur");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-slate-800 flex flex-col">

      {/* ===================== HEADER ===================== */}
      <header className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/30 rounded-xl blur group-hover:blur-md transition"></div>
              <img
                src={logo}
                alt="KOB YALGRÉ"
                className="relative w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl"
              />
            </div>
            <span className="font-black text-green-800 text-lg sm:text-xl tracking-tight">
              KOB YALGRÉ
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-green-700 transition">Accueil</Link>
            <Link to="/APropos" className="hover:text-green-700 transition">À propos</Link>
            <Link to="/marcher" className="hover:text-green-700 transition">Explorer</Link>
            <Link to="/contact" className="hover:text-green-700 transition">Contact</Link>
          </nav>

          <Link
            to="/login"
            className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            Connexion
          </Link>
        </div>
      </header>

      {/* ===================== CONTENU ===================== */}
      <main className="flex-1">

        {/* FORMULAIRE D'ACCÈS */}
        {!isAllowed && (
          <div className="flex justify-center items-center px-4 py-12 sm:py-16">
            <div
              className="w-full max-w-md rounded-2xl shadow-xl border border-green-100 overflow-hidden relative"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${sub})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 mb-3">
                    <img src={logo} alt="Logo" className="w-9 h-9 object-contain rounded-lg" />
                  </div>
                  <h2 className="text-green-800 font-black text-xl sm:text-2xl">
                    Accès E-Learning
                  </h2>
                  <p className="text-green-600 font-semibold mt-1">
                    1 000 FCFA / mois
                  </p>
                </div>

                {/* ETAPE 1 */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        name="nom"
                        placeholder="Votre nom"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition text-sm"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Numéro de téléphone
                      </label>
                      <input
                        type="tel"
                        name="numero"
                        placeholder="Ex: 70 00 00 00"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition text-sm"
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!user.nom || !user.numero) {
                          alert("Veuillez remplir nom et numéro");
                          return;
                        }
                        setStep(2);
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-md transition"
                    >
                      Continuer
                    </button>
                  </div>
                )}

                {/* ETAPE 2 */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-green-800 text-center text-lg">
                      {!methode
                        ? "Choisir un mode de paiement"
                        : `Paiement via ${methode.toUpperCase()}`}
                    </h3>

                    {!methode ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => setMethode("orange")}
                          className="w-full bg-[#FF6600] text-white py-3.5 px-4 rounded-xl flex items-center justify-between font-bold shadow hover:opacity-90 transition"
                        >
                          <span>Orange Money</span>
                          <span className="bg-white text-[#FF6600] px-2.5 py-0.5 rounded text-xs uppercase font-bold">
                            Orange
                          </span>
                        </button>

                        <button
                          onClick={() => setMethode("moov")}
                          className="w-full bg-[#005B94] text-white py-3.5 px-4 rounded-xl flex items-center justify-between font-bold shadow hover:opacity-90 transition"
                        >
                          <span>Moov Money</span>
                          <span className="bg-white text-[#005B94] px-2.5 py-0.5 rounded text-xs uppercase font-bold">
                            Moov
                          </span>
                        </button>

                        <button
                          onClick={() => setMethode("wave")}
                          className="w-full bg-[#1D9BF0] text-white py-3.5 px-4 rounded-xl flex items-center justify-between font-bold shadow hover:opacity-90 transition"
                        >
                          <span>Wave</span>
                          <span className="bg-white text-[#1D9BF0] px-2.5 py-0.5 rounded text-xs uppercase font-bold">
                            Wave
                          </span>
                        </button>

                        <button
                          onClick={() => setStep(1)}
                          className="w-full text-sm text-slate-500 hover:text-green-700 mt-2"
                        >
                          ← Retour
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <button
                          onClick={() => setMethode("")}
                          className="text-xs text-slate-500 hover:text-green-700 hover:underline"
                        >
                          ← Changer de mode de paiement
                        </button>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Numéro de paiement
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="Ex: 70 00 00 00"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Code secret / OTP
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-sm"
                          />
                        </div>

                        <button
                          onClick={handlePayment}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-md transition"
                        >
                          {loading ? "Paiement en cours..." : "Valider le paiement"}
                        </button>
                      </div>
                    )}

                    {loading && (
                      <p className="text-center text-green-600 mt-2 font-medium animate-pulse text-sm">
                        Traitement en cours...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIDEOS */}
        {isAllowed && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-green-800">
                E-Learning Agricole
              </h2>
              <p className="text-slate-500 mt-2">
                Formations pratiques pour moderniser votre agriculture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((vid, i) => (
                <div
                  key={i}
                  className="bg-white border border-green-100 rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  <video controls className="w-full aspect-video bg-black">
                    <source src={vid} type="video/mp4" />
                  </video>

                  <div className="p-4">
                    <p className="font-bold text-green-700">
                      Vidéo {i + 1}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {descriptions[i]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-gradient-to-b from-green-950 to-emerald-950 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="KOB YALGRÉ"
                className="w-10 h-10 object-contain rounded-lg"
              />
              <h3 className="text-xl font-black text-yellow-400">
                KOB YALGRÉ
              </h3>
            </div>
            <p className="text-green-100/80 text-sm leading-relaxed">
              Plateforme agricole dédiée à la mise en relation des producteurs
              et des consommateurs pour une agriculture moderne, durable et accessible.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-green-100/80 text-sm">
              <li><Link to="/" className="hover:text-yellow-400 transition">Accueil</Link></li>
              <li><Link to="/APropos" className="hover:text-yellow-400 transition">À propos</Link></li>
              <li><Link to="/marcher" className="hover:text-yellow-400 transition">Marché</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <p className="text-green-100/80 text-sm">📍 Ouagadougou, Burkina Faso</p>
            <p className="text-green-100/80 text-sm mt-1">📧 contact@kobyalgre.bf</p>
            <p className="text-green-100/80 text-sm mt-1">📞 +226 54 67 89 34</p>
          </div>
        </div>

        <div className="border-t border-green-800/50 text-center py-4 text-green-200/70 text-sm">
          © 2026 <span className="font-semibold text-yellow-400">KOB YALGRÉ</span> — Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}