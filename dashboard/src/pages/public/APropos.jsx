import { useNavigate, Link } from 'react-router-dom';

export default function APropos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex flex-col">

      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow flex justify-between items-center px-8 py-4">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain" />
          <h1 className="text-xl font-extrabold text-green-700 tracking-wide">
            KOB YALGRÉ
          </h1>
        </div>

        {/* NAV */}
        <nav className="hidden md:flex gap-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-green-600 transition">Accueil</Link>
          <Link to="/marche" className="hover:text-green-600 transition">Marché</Link>
          <Link to="/apropos" className="text-green-700 font-semibold">À propos</Link>
          <Link to="/contact" className="hover:text-green-600 transition">Contact</Link>
        </nav>

        {/* ACTION */}
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
        >
          Connexion
        </button>

      </header>

      {/* CONTENU */}
      <main className="flex-1">

        <div className="max-w-6xl mx-auto px-8 py-14">

          {/* RETOUR */}
          <button
            onClick={() => navigate('/')}
            className="text-green-700 font-semibold hover:text-green-800 mb-6"
          >
           
          </button>

          {/* TITRE */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 leading-tight">
            À propos de <span className="text-green-700">KOB YALGRÉ</span>
          </h1>

          {/* INTRO */}
          <p className="text-gray-600 mt-4 max-w-3xl text-lg leading-relaxed border-l-4 border-green-500 pl-4">
            KOB YALGRÉ est une plateforme agricole digitale pensée pour transformer
            l’agriculture en Afrique grâce au numérique, à la formation et à l’accès au marché.
          </p>

          {/* CARTES */}
          <div className="mt-10 grid md:grid-cols-3 gap-6">

            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
              <h2 className="font-bold text-green-900 text-lg">🛒 Marché agricole</h2>
              <p className="text-gray-600 mt-2">
                Connexion directe entre producteurs et acheteurs pour un commerce simple et rapide.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
              <h2 className="font-bold text-green-900 text-lg">🎓 E-learning</h2>
              <p className="text-gray-600 mt-2">
                Formation agricole moderne adaptée aux réalités africaines.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
              <h2 className="font-bold text-green-900 text-lg"> Accompagnement</h2>
              <p className="text-gray-600 mt-2">
                Soutien et orientation pour développer une agriculture rentable et durable.
              </p>
            </div>

          </div>

          {/* VISION */}
          <div className="mt-14 bg-gradient-to-r from-green-700 to-emerald-600 text-white p-10 rounded-3xl shadow-xl">

            <h2 className="text-2xl font-bold"> Notre vision</h2>
            <p className="mt-3 text-white/90 leading-relaxed">
              Construire une agriculture africaine moderne, connectée et durable où chaque producteur
              a accès à la technologie, au savoir et au marché.
            </p>

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-green-900 text-white py-6 text-center">
        © 2026 KOB YALGRÉ — Plateforme agricole intelligente
      </footer>

    </div>
  );
}