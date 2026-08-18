import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import elearning from "../../assets/image/elearning.jpg";
import videoAcceuil from "../../assets/image/video10.mp4";
import marcherBg from "../../assets/image/marcher.jpg";
import contactBg from "../../assets/image/contacte.jpg";
import logo from "../../assets/image/logo.jpeg";
import activeImg from "../../assets/image/active.jpg";
import durableImg from "../../assets/image/durable.jpg";
import pibImg from "../../assets/image/pib.jpg";

export default function PublicHome() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMarcheInView, setIsMarcheInView] = useState(false);
  const marcheRef = useRef(null);

  // Détecte si on est sur la section Marché
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMarcheInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    if (marcheRef.current) {
      observer.observe(marcheRef.current);
    }

    return () => {
      if (marcheRef.current) observer.unobserve(marcheRef.current);
    };
  }, []);

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Explorer', path: '/marcher' },
    { label: 'À propos', path: '/APropos' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="bg-[#f0fdf4] min-h-screen flex flex-col overflow-x-hidden">

      {/* ===================== HEADER ===================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white via-green-50 to-emerald-100 border-b border-green-200 shadow-lg shadow-green-900/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <div
            onClick={() => { navigate('/'); setMenuOpen(false); }}
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
            <span className="hidden sm:block text-xl font-black tracking-tight text-green-800">
              KOB YALGRÉ
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <a
                key={item.path}
                href="#"
                onClick={(e) => { e.preventDefault(); navigate(item.path); }}
                className="relative text-sm font-semibold text-gray-700 hover:text-green-700 transition group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block text-sm font-semibold text-green-700 hover:text-green-900 transition px-3"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              S’inscrire
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-green-200 text-green-700 shadow-sm"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 pb-6 bg-gradient-to-b from-white to-emerald-50 border-t border-green-100">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((item) => (
                <a
                  key={item.path}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className="px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-green-100 hover:text-green-800 transition"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-center py-3 rounded-xl border border-green-200 text-green-700 font-semibold">
                Connexion
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-center py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold">
                S’inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="h-20"></div>

      <main className="flex-1">

        {/* ===================== HERO AVEC ÉCLAIRAGE AMÉLIORÉ ===================== */}
        <section className="relative h-[88vh] flex items-center overflow-hidden">
          
          {/* Vidéo éclairée */}
          <video
            className="absolute inset-0 w-full h-full object-cover brightness-110 contrast-105 saturate-110"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoAcceuil} type="video/mp4" />
          </video>

          {/* Overlay plus léger pour laisser la vidéo visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/15"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>

          {/* Effets de lumière */}
          <div className="absolute top-20 left-10 w-80 h-80 bg-green-400/25 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-16 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative max-w-6xl mx-auto px-8 z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-xs font-bold tracking-widest uppercase rounded-full text-green-100 bg-white/15 backdrop-blur-xl border border-white/25">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              BIENVENUE · NIWONGO · DANSSER · IZOUBA_ZOUBA
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-none tracking-tight drop-shadow-lg">
              À <span className="bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">KOB-YALGRÉ</span>
            </h1>

            <p className="mt-6 text-white text-xl md:text-2xl font-medium max-w-2xl drop-shadow">
              Un partenaire numérique au service des agriculteurs africains
            </p>

            <p className="mt-5 text-white/85 text-base max-w-2xl border-l-4 border-green-400 pl-5">
              KOB YALGRÉ accompagne les producteurs dans la modernisation de leurs activités,
              l’amélioration de leurs rendements et la valorisation de leur travail.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/marcher')}
                className="px-8 py-4 rounded-2xl bg-white text-green-800 font-bold shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Explorer le marché
              </button>
              <button
                onClick={() => navigate('/VideoPublic')}
                className="px-8 py-4 rounded-2xl bg-white/15 backdrop-blur-md text-white font-semibold border border-white/40 hover:bg-white/25 transition"
              >
                E-learning
              </button>
            </div>
          </div>
        </section>

        {/* ===================== MARCHÉ AGRICOLE - ZOOM EN BOUCLE ===================== */}
        <section
          ref={marcheRef}
          id="explorer"
          className="relative py-32 text-center overflow-hidden"
        >
          <div
            className={`absolute inset-0 will-change-transform ${
              isMarcheInView ? 'animate-zoom-loop' : ''
            }`}
            style={{
              backgroundImage: `url(${marcherBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: isMarcheInView ? undefined : 'scale(1)',
              transition: isMarcheInView ? 'none' : 'transform 1.2s ease-out',
            }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/70"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-8">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Marché agricole
            </h2>
            <p className="text-white/85 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Découvrez les produits agricoles disponibles et connectez-vous directement aux producteurs.
            </p>

            <button
              onClick={() => navigate('/marcher')}
              className="mt-10 inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-2xl shadow-green-900/40 hover:scale-105 transition-all duration-300"
            >
              Accéder au marché
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </section>

        {/* ===================== E-LEARNING ===================== */}
        <section className="relative bg-white py-24 px-6 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-100/60 rounded-full blur-3xl"></div>

          <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-700"></div>
              <img
                src={elearning}
                alt="E-learning"
                className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover group-hover:scale-[1.02] transition duration-700"
              />
            </div>

            <div>
              <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest uppercase text-green-700 bg-green-100 rounded-full">
                Formation
              </span>
              <h2 className="text-4xl font-black text-gray-900 mb-5">
                KOB YALGRÉ <span className="text-green-600">E-learning</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Apprenez les meilleures techniques agricoles modernes adaptées aux réalités africaines.
                Améliorez vos rendements et développez une agriculture durable.
              </p>
              <button
                onClick={() => navigate('/VideoPublic')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg shadow-green-600/30 hover:-translate-y-1 transition-all"
              >
                Accéder aux cours
              </button>
            </div>
          </div>
        </section>

        {/* ===================== CARTES ===================== */}
        <section className="py-24 px-6 bg-gradient-to-b from-emerald-50/50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-3">
                Pourquoi <span className="text-green-600">KOB YALGRÉ</span> ?
              </h2>
              <p className="text-gray-600 text-lg">Une plateforme pensée pour transformer l’agriculture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { img: activeImg, title: "L'agriculture", desc: "Base de l'alimentation et des revenus pour des millions de familles au Burkina Faso" },
                { img: durableImg, title: "KOB YALGRÉ", desc: "Connecte directement producteurs et consommateurs, sans intermédiaire" },
                { img: pibImg, title: "Accessible à tous", desc: "Une plateforme simple, utilisable depuis un simple smartphone" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
                >
                  <div className="overflow-hidden">
                    <img src={card.img} alt={card.title} className="w-full h-60 object-cover group-hover:scale-110 transition duration-700" />
                  </div>
                  <div className="p-7 text-center">
                    <h3 className="text-xl font-bold text-green-700 mb-2">{card.title}</h3>
                    <p className="text-gray-600">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CONTACT ===================== */}
        <section
          className="relative py-28 px-6"
          style={{
            backgroundImage: `url(${contactBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-emerald-950/80"></div>

          <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-black mb-6">Contactez-nous</h2>
              <p className="text-white/80 text-lg mb-10">
                Une question ? Un projet ? Nous vous accompagnons dans votre réussite agricole.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '📧', text: 'contact@kobyalgre.bf' },
                  { icon: '📞', text: '+226 54 66 77 88' },
                  { icon: '📍', text: 'Ouagadougou, Burkina Faso' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl space-y-5">
              <input type="text" placeholder="Votre nom" className="w-full bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 p-4 rounded-2xl outline-none transition" />
              <input type="email" placeholder="Votre email" className="w-full bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 p-4 rounded-2xl outline-none transition" />
              <textarea placeholder="Votre message..." rows="5" className="w-full bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 p-4 rounded-2xl outline-none transition resize-none" />
              <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-all">
                Envoyer le message
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-gradient-to-b from-green-950 to-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-black text-yellow-400 mb-4">KOB YALGRÉ</h3>
            <p className="text-green-100/80 leading-relaxed">
              Plateforme agricole dédiée à la mise en relation des producteurs et des consommateurs.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-green-100/80">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate(link.path); }} className="hover:text-yellow-400 transition">
                    {link.label}
                  </a>
                </li>
              ))}
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
        </div>
      </footer>

      {/* ========== ANIMATION CSS DU ZOOM EN BOUCLE ========== */}
      <style>{`
        @keyframes zoom-loop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.42);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-zoom-loop {
          animation: zoom-loop 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}