import { useNavigate, Link } from 'react-router-dom';
import mae2 from "../../assets/image/mae2.jpg";
import elearning1 from "../../assets/image/elearning1.jpg";
import accompagnement from "../../assets/image/accompagne.jpg";

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
          <Link to="/marcher" className="hover:text-green-600 transition">Marché</Link>
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

  {/* MARCHE AGRICOLE */}
  <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 hover:scale-105 transition">

    <img
  src={mae2}
  alt="Marché agricole"
  className="w-full h-40 object-cover rounded-2xl mb-4"
/>

    <h2 className="font-bold text-green-900 text-lg">🛒 Marché agricole</h2>
    <p className="text-gray-600 mt-2">
      Connexion directe entre producteurs et acheteurs pour un commerce simple et rapide.
    </p>
  </div>

  {/* E-LEARNING */}
  <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 hover:scale-105 transition">

    <img
      src={elearning1}
      alt="E-learning agricole"
      className="w-full h-40 object-cover rounded-2xl mb-4"
    />

    <h2 className="font-bold text-green-900 text-lg">🎓 E-learning</h2>
    <p className="text-gray-600 mt-2">
      Formation agricole moderne adaptée aux réalités africaines.
    </p>
  </div>

  {/* ACCOMPAGNEMENT */}
  <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 hover:scale-105 transition">

    <img
      src={accompagnement}
      alt="Accompagnement agricole"
      className="w-full h-40 object-cover rounded-2xl mb-4"
    />

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