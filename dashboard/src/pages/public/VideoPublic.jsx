import { useState } from "react";
import axios from "axios";
import sub from "../../assets/image/sub.jpg";

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
    <div className="min-h-screen bg-white text-black">
          

      {/* HEADER */}
      <header className="bg-green-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <h1 className="font-bold">KOB-YALGRÉ</h1>

        <nav className="flex gap-6 text-sm font-semibold">
          <a href="/">Accueil</a>
          <a href="/apropos">À propos</a>
          <a href="/contact">Contact</a>
          <a href="/marche">Explorer</a>
        </nav>
      </header>

      {/* FORMULAIRE */}
      {!isAllowed && (
        <div className="flex justify-center mt-10">
           <div
      className="w-full max-w-md shadow-lg p-6 rounded-xl border border-green-500 relative bg-cover bg-center"
      style={{
        backgroundImage: "url('/sub.jpg')"
      }}
    >

            <h2 className="text-green-700 font-bold text-xl text-center mb-4">
              Accès E-Learning - 1000f / mois
            </h2>

            {/* ETAPE 1 */}
            {step === 1 && (
              <div className="space-y-3">
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                />

                <input
                  type="tel"
                  name="numero"
                  placeholder="Numéro"
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                />

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-green-600 text-white py-2 rounded"
                >
                  Continuer
                </button>
              </div>
            )}
{/* ETAPE 2 */}
{step === 2 && (
  <div className="space-y-4">
    <h3 className="font-bold text-green-700 text-center text-lg">
      {!methode ? "Choisir paiement" : `Paiement via ${methode.toUpperCase()}`}
    </h3>

    {/* SOUS-ÉTAPE A : Affichage des modes de paiement uniquement */}
    {!methode ? (
      <div className="space-y-3">
        <button 
          onClick={() => setMethode("orange")} 
          className="w-full bg-[#FF6600] text-white py-3 px-4 rounded-xl flex items-center justify-between font-bold shadow hover:opacity-90 transition"
        >
          <span>Orange Money</span>
          <span className="bg-white text-[#FF6600] px-2 py-0.5 rounded text-xs uppercase">Orange</span>
        </button>

        <button 
          onClick={() => setMethode("moov")} 
          className="w-full bg-[#005B94] text-white py-3 px-4 rounded-xl flex items-center justify-between font-bold shadow hover:opacity-90 transition"
        >
          <span>Moov Money</span>
          <span className="bg-white text-[#005B94] px-2 py-0.5 rounded text-xs uppercase">Moov</span>
        </button>

        <button 
          onClick={() => setMethode("wave")} 
          className="w-full bg-[#1D9BF0] text-white py-3 px-4 rounded-xl flex items-center justify-between font-bold shadow hover:opacity-90 transition"
        >
          <span>Wave</span>
          <span className="bg-white text-[#1D9BF0] px-2 py-0.5 rounded text-xs uppercase">Wave</span>
        </button>
      </div>
    ) : (
      /* SOUS-ÉTAPE B : Formulaire de validation après clic */
      <div className="space-y-4 animate-fade-in">
        <button 
          onClick={() => setMethode(null)} 
          className="text-xs text-gray-500 hover:underline block"
        >
          ← Changer de mode de paiement
        </button>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Valider votre numéro
          </label>
          <input
            type="tel"
            required
            placeholder="Ex: 07000000"
            className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-green-600 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Valider votre code
          </label>
          <input
            type="password"
            required
            placeholder="Code secret / OTP"
            className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-green-600 text-sm"
          />
        </div>

       <button
  onClick={handlePayment}
  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow transition mt-2"
>
  Valider
</button>
      </div>
    )}

    {loading && (
      <p className="text-center text-green-600 mt-2 font-medium animate-pulse">
        Paiement en cours...
      </p>
    )}
  </div>
)}

          </div>
        </div>
      )}

      {/* VIDEOS */}
      {isAllowed && (
        <div className="p-6">
          <h2 className="text-center text-green-700 text-2xl font-bold mb-8">
            E-LEARNING AGRICOLE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((vid, i) => (
              <div key={i} className="bg-white border border-green-200 rounded-lg shadow p-4">

                <video controls className="w-full rounded">
                  <source src={vid} type="video/mp4" />
                </video>

                <p className="text-center mt-2 font-bold text-green-700">
                  Vidéo {i + 1}
                </p>

                <p className="text-sm text-gray-700 mt-2">
                  {descriptions[i]}
                </p>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-green-900 text-white">
  <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

    {/* Logo / Présentation */}
    <div>
      <h3 className="text-2xl font-bold text-yellow-400">
        KOB YALGRÉ
      </h3>
      <p className="mt-3 text-green-100">
        Plateforme agricole dédiée à la mise en relation
        des producteurs et des consommateurs pour une agriculture
        moderne, durable et accessible.
      </p>
    </div>

    {/* Liens rapides */}
    <div>
      <h4 className="font-semibold text-lg mb-3">
        Liens rapides
      </h4>
      <ul className="space-y-2 text-green-100">
        <li><a href="/" className="hover:text-yellow-400">Accueil</a></li>
        <li><a href="APropos" className="hover:text-yellow-400">À propos</a></li>
        <li><a href="Marcher" className="hover:text-yellow-400">Marcher</a></li>
        <li><a href="Contact" className="hover:text-yellow-400">Contact</a></li>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h4 className="font-semibold text-lg mb-3">
        Contact
      </h4>
      <p className="text-green-100">📍 Ouagadougou, Burkina Faso</p>
      <p className="text-green-100">📧 contact@kobyalgre.bf</p>
      <p className="text-green-100">📞 +226 54 67 89 34</p>
    </div>

  </div>

  {/* Bas du footer */}
  <div className="border-t border-green-700 text-center py-4 text-green-200">
    © 2026 <span className="font-semibold">KOB YALGRÉ</span> —
    Tous droits réservés. Connecter l'agriculture à l'innovation.
  </div>
</footer>
    </div>
  );
}