import { useNavigate, Link } from 'react-router-dom';
import logo from "../../assets/image/logo.jpeg";
import contact from "../../assets/image/contact.jpg";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col">

      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-100/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <img
                src={logo}
                alt="KOB YALGRÉ"
                className="relative w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl ring-2 ring-green-100 group-hover:ring-green-300 transition"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-green-800">
              KOB YALGRÉ
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600">
            <Link to="/" className="hover:text-green-700 transition-colors duration-200">Accueil</Link>
            <Link to="/apropos" className="hover:text-green-700 transition-colors duration-200">À propos</Link>
            <Link to="/marcher" className="hover:text-green-700 transition-colors duration-200">Marché</Link>
            <Link
              to="/contact"
              className="text-green-700 font-semibold relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-green-600 after:rounded-full"
            >
              Contact
            </Link>
          </nav>

          {/* Bouton Connexion */}
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 font-semibold text-sm"
          >
            Connexion
          </button>
        </div>
      </header>

      {/* ===================== CONTENU ===================== */}
      <main className="flex-1 relative">
        {/* Image de fond + overlay pour lisibilité */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${contact})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 via-green-900/60 to-emerald-950/75" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16">

          {/* Bouton retour */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-white/90 font-medium hover:text-white mb-8 sm:mb-10 transition-colors group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l’accueil
          </button>

          {/* Titre */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Contactez-nous
            </h1>
            <p className="text-green-100/90 mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed">
              Une question, un projet ou une collaboration ? Nous sommes là pour vous accompagner dans votre réussite agricole.
            </p>
          </div>

          {/* Section Contact */}
          <div className="mt-12 sm:mt-16 grid lg:grid-cols-2 gap-8 lg:gap-10">

            {/* Infos */}
            <div className="bg-gradient-to-br from-green-700 via-emerald-600 to-teal-600 text-white p-8 sm:p-10 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/20 relative overflow-hidden">
              {/* Décoration */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-tight">
                  Parlons ensemble
                </h2>

                <p className="text-white/90 leading-relaxed text-[15px] sm:text-base">
                  KOB YALGRÉ vous accompagne dans vos projets agricoles numériques.
                  Nous croyons en une agriculture moderne, connectée et rentable.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg">
                      📧
                    </div>
                    <div>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Email</p>
                      <p className="text-white font-medium">contact@kobyalgre.bf</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg">
                      📞
                    </div>
                    <div>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Téléphone</p>
                      <p className="text-white font-medium">+226 54 67 89 34</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg">
                      📍
                    </div>
                    <div>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Adresse</p>
                      <p className="text-white font-medium">Ouagadougou, Burkina Faso</p>
                    </div>
                  </div>
                </div>

                <p className="mt-10 text-white/80 text-sm italic border-t border-white/20 pt-6">
                  “Construisons ensemble l’avenir de l’agriculture africaine.”
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/10 p-8 sm:p-10">
              <h2 className="text-xl sm:text-2xl font-extrabold text-green-900 mb-6 tracking-tight">
                Envoyez un message
              </h2>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Amadou Ouédraogo"
                    className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Votre email
                  </label>
                  <input
                    type="email"
                    placeholder="exemple@email.com"
                    className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Votre message
                  </label>
                  <textarea
                    placeholder="Décrivez votre projet ou votre question..."
                    rows={5}
                    className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-3.5 rounded-xl shadow-md shadow-green-500/25 hover:shadow-lg hover:shadow-green-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 font-semibold"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-gradient-to-b from-green-950 to-emerald-950 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-extrabold text-yellow-400 mb-4 tracking-tight">KOB YALGRÉ</h3>
            <p className="text-green-100/75 leading-relaxed text-[15px] max-w-sm">
              Plateforme agricole dédiée à la mise en relation des producteurs et des consommateurs
              pour une agriculture moderne, durable et accessible.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-5 text-white">Liens rapides</h4>
            <ul className="space-y-3 text-green-100/75">
              <li><Link to="/" className="hover:text-yellow-400 transition-colors duration-200">Accueil</Link></li>
              <li><Link to="/apropos" className="hover:text-yellow-400 transition-colors duration-200">À propos</Link></li>
              <li><Link to="/marcher" className="hover:text-yellow-400 transition-colors duration-200">Marché</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-5 text-white">Contact</h4>
            <ul className="space-y-3 text-green-100/75 text-[15px]">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Ouagadougou, Burkina Faso</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span>contact@kobyalgre.bf</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📞</span>
                <span>+226 54 67 89 34</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800/40 text-center py-5 text-green-200/60 text-sm">
          © 2026 <span className="font-semibold text-yellow-400">KOB YALGRÉ</span> — Tous droits réservés.
          <span className="hidden sm:inline"> · Connecter l'agriculture à l'innovation.</span>
        </div>
      </footer>
    </div>
  );
}