import { useNavigate, Link } from 'react-router-dom';
import logo from "../../assets/image/logo.jpeg";
import mae2 from "../../assets/image/mae2.jpg";
import elearning1 from "../../assets/image/elearning1.jpg";
import accompagnement from "../../assets/image/accompagne.jpg";

export default function APropos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex flex-col">

      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-white via-green-50 to-emerald-100 border-b border-green-200 shadow-lg shadow-green-900/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
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
            <Link to="/marcher" className="hover:text-green-600 transition">Marché</Link>
            <Link to="/apropos" className="text-green-700 font-semibold">À propos</Link>
            <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>
          </nav>

          {/* Bouton Connexion */}
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all font-semibold text-sm"
          >
            Connexion
          </button>
        </div>
      </header>

      {/* ===================== CONTENU ===================== */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-14">

          {/* Bouton retour */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 mb-8 transition group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l’accueil
          </button>

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl font-black text-green-900 leading-tight">
            À propos de <span className="text-green-600">KOB YALGRÉ</span>
          </h1>

          {/* Intro */}
          <p className="text-gray-600 mt-5 max-w-3xl text-lg leading-relaxed border-l-4 border-green-500 pl-5">
            KOB YALGRÉ est une plateforme agricole digitale pensée pour transformer
            l’agriculture en Afrique grâce au numérique, à la formation et à l’accès au marché.
          </p>

          {/* Cartes */}
          <div className="mt-12 grid md:grid-cols-3 gap-7">

            {/* Marché agricole */}
            <div className="group bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <div className="overflow-hidden">
                <img
                  src={mae2}
                  alt="Marché agricole"
                  className="w-full h-44 object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
              <div className="p-6">
                <h2 className="font-bold text-green-900 text-lg flex items-center gap-2">
                  <span>🛒</span> Marché agricole
                </h2>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  Connexion directe entre producteurs et acheteurs pour un commerce simple et rapide.
                </p>
              </div>
            </div>

            {/* E-learning */}
            <div className="group bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <div className="overflow-hidden">
                <img
                  src={elearning1}
                  alt="E-learning agricole"
                  className="w-full h-44 object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
              <div className="p-6">
                <h2 className="font-bold text-green-900 text-lg flex items-center gap-2">
                  <span>🎓</span> E-learning
                </h2>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  Formation agricole moderne adaptée aux réalités africaines.
                </p>
              </div>
            </div>

            {/* Accompagnement */}
            <div className="group bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <div className="overflow-hidden">
                <img
                  src={accompagnement}
                  alt="Accompagnement agricole"
                  className="w-full h-44 object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
              <div className="p-6">
                <h2 className="font-bold text-green-900 text-lg flex items-center gap-2">
                  <span>🤝</span> Accompagnement
                </h2>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  Soutien et orientation pour développer une agriculture rentable et durable.
                </p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="mt-14 relative overflow-hidden bg-gradient-to-r from-green-700 to-emerald-600 text-white p-10 md:p-12 rounded-3xl shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black mb-4">Notre vision</h2>
              <p className="text-white/90 leading-relaxed text-lg max-w-3xl">
                Construire une agriculture africaine moderne, connectée et durable où chaque producteur
                a accès à la technologie, au savoir et au marché.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-gradient-to-b from-green-950 to-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-2xl font-black text-yellow-400 mb-4">KOB YALGRÉ</h3>
            <p className="text-green-100/80 leading-relaxed">
              Plateforme agricole dédiée à la mise en relation des producteurs et des consommateurs
              pour une agriculture moderne, durable et accessible.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-green-100/80">
              <li><Link to="/" className="hover:text-yellow-400 transition">Accueil</Link></li>
              <li><Link to="/apropos" className="hover:text-yellow-400 transition">À propos</Link></li>
              <li><Link to="/marcher" className="hover:text-yellow-400 transition">Marché</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <p className="text-green-100/80">📍 Ouagadougou, Burkina Faso</p>
            <p className="text-green-100/80">📧 contact@kobyalgre.bf</p>
            <p className="text-green-100/80">📞 +226 54 67 89 34</p>
          </div>
        </div>

        <div className="border-t border-green-800/50 text-center py-5 text-green-200/70 text-sm">
          © 2026 <span className="font-semibold text-yellow-400">KOB YALGRÉ</span> — Tous droits réservés.
          Connecter l'agriculture à l'innovation.
        </div>
      </footer>
    </div>
  );
}