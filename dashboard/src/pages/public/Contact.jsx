import { useNavigate, Link } from 'react-router-dom';
import logo from "../../assets/image/logo.jpeg";
import contact from "../../assets/image/contact.jpg";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex flex-col">

      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow flex justify-between items-center px-8 py-4">

        {/* LOGO */}
         <div className="flex items-center gap-3">
                 <img
          src={logo}
          alt="KOB YALGRÉ"
          className="w-20 h-20 object-contain"
        />
                </div>

        {/* NAV */}
        <nav className="hidden md:flex gap-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-green-600">Accueil</Link>
          <Link to="/apropos" className="hover:text-green-600">À propos</Link>
          <Link to="/marcher" className="hover:text-green-600">Explorer</Link>
          <Link to="/contact" className="text-green-700 font-semibold">Contact</Link>
        </nav>

        {/* BTN */}
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
        >
          Connexion
        </button>
      </header>

      {/* CONTENU */}
      <main
  className="flex-1 relative"
 style={{
  backgroundImage: `url(${contact})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
}}
>
        <div className="max-w-6xl mx-auto px-8 py-12">

          {/* RETOUR */}
          <button
            onClick={() => navigate('/')}
            className="text-green-700 font-semibold hover:text-green-800 mb-6"
          >
          </button>

          {/* TITRE */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900">
             Contactez-nous
          </h1>

          <p className="text-gray-600 mt-3 max-w-2xl">
            Une question, un projet ou une collaboration ? Nous sommes là pour vous accompagner dans votre réussite agricole.
          </p>

          {/* SECTION CONTACT */}
          <div className="mt-10 grid md:grid-cols-2 gap-10">

            {/* INFOS */}
            <div className="bg-gradient-to-br from-green-700 to-emerald-600 text-white p-8 rounded-3xl shadow-xl">

              <h2 className="text-2xl font-bold mb-4">
                Parlons ensemble
              </h2>

              <p className="text-white/90 leading-relaxed">
                KOB YALGRÉ vous accompagne dans vos projets agricoles numériques.
                Nous croyons en une agriculture moderne, connectée et rentable.
              </p>

              <div className="mt-6 space-y-2 text-white/90">
                <p>contact@kobyalgre.bf</p>
                <p> +226 54 67 89 34</p>
                <p> Ouagadougou, Burkina Faso</p>
              </div>

              <p className="mt-6 text-white/80 text-sm italic">
                “Construisons ensemble l’avenir de l’agriculture africaine.”
              </p>

            </div>

            {/* FORMULAIRE */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-8">

              <h2 className="text-xl font-bold text-green-900 mb-6">
                Envoyez un message 
              </h2>

              <form className="space-y-4">

                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <textarea
                  placeholder="Votre message..."
                  rows="5"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold"
                >
                  Envoyer le message
                </button>

              </form>

            </div>

          </div>

        </div>

      </main>

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

 