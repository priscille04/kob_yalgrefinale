import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function PublicHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 min-h-screen flex flex-col">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow flex justify-between items-center px-8 py-4">

        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain" />
          <h1 className="text-xl font-extrabold text-green-700 tracking-wide">
            KOB YALGRÉ
          </h1>
        </div>

        <nav className="hidden md:flex gap-8 font-medium text-gray-700">
           <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/#elearning');
            }}
            className="hover:text-green-600 transition"
          >
            Accueil
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/marcher');
            }}
            className="hover:text-green-600 transition"
          >
            Explorer
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/APropos');
            }}
            className="hover:text-green-600 transition"
          >
            À propos
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/contact');
            }}
            className="hover:text-green-600 transition"
          >
            Contact
          </a>

        </nav>

        <div className="flex gap-3">
          <Link to="/login" className="text-green-700 font-semibold">
            Connexion
          </Link>

          <Link
            to="/register"
            className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            S’inscrire
          </Link>
        </div>
      </header>

      <main className="flex-1">

        {/* HERO PREMIUM */}
        <section className="relative h-[85vh] flex items-center">

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/hero.png)' }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-900/60 to-green-500/20" />

          <div className="relative max-w-6xl mx-auto px-8">

            {/* BADGE */}
            <div className="inline-block px-4 py-1 mb-5 text-xs tracking-widest uppercase bg-white/10 text-white rounded-full">
              Plateforme Agricole Digitale
            </div>

            {/* TITRE */}
            <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-none tracking-tight">
              KOB YALGRÉ
            </h1>

            {/* SLOGAN */}
            <p className="mt-6 text-white/95 text-xl md:text-2xl font-semibold max-w-2xl">
               Un partenaire numérique au service des agriculteurs africains
            </p>

            {/* DESCRIPTION */}
            <p className="mt-5 text-white/75 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-green-400 pl-4">
              KOB YALGRÉ accompagne les producteurs dans la modernisation de leurs activités,
              l’amélioration de leurs rendements et la valorisation de leur travail à travers le numérique.
            </p>

            {/* CTA */}
            <div className="mt-8">
              <a
              href="#marcher"
              onClick={(e) => {
                e.preventDefault();
                navigate('/marcher');
              }}
              className="bg-white text-green-800 font-bold px-6 py-3 rounded-xl shadow hover:scale-105 transition"
              >
                Explorer le marché
              </a>

            </div>

          </div>
        </section>

        {/* EXPLORER */}
        <section id="explorer" className="max-w-6xl mx-auto px-8 py-20 text-center">

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
             Marché agricole
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Découvrez les produits agricoles disponibles et connectez-vous pour commander.
          </p>

          <button
            onClick={() => navigate('/marcher')}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700"
          >
            Accéder au marché
          </button>


        </section>

        {/* E-LEARNING */}
        <section id="elearning" className="bg-white py-20 px-8">

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

            <img
              src="/elearning.jpg"
              className="rounded-3xl shadow-lg"
            />

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                KOB YALGRÉ E-learning
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Apprenez les meilleures techniques agricoles modernes adaptées aux réalités africaines.
              </p>

              <button
                onClick={() => navigate('/login')}
                className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700"
              >
                Accéder aux cours
              </button>
            </div>

          </div>
        </section>

        {/* STATS PREMIUM */}
        <section className="py-16 px-8">

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-center">

            <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
              <p className="text-4xl font-extrabold text-green-700">70%</p>
              <p className="text-gray-600 mt-2">Population agricole active</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
              <p className="text-4xl font-extrabold text-green-700">+10 ans</p>
              <p className="text-gray-600 mt-2">Impact économique durable</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
              <p className="text-4xl font-extrabold text-green-700">35%</p>
              <p className="text-gray-600 mt-2">Contribution au PIB</p>
            </div>

          </div>

        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-green-100 py-20 px-8">

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                 Contact
              </h2>

              <p className="text-gray-600 mb-6">
                Une question ? Un projet ? Nous vous accompagnons dans votre réussite agricole.
              </p>

              <div className="space-y-2 text-gray-700">
                <p> contact@kobyalgre.com</p>
                <p> +226 54667788</p>
                <p> Ouagadougou, Burkina Faso</p>
              </div>
            </div>

            <form className="bg-white p-8 rounded-3xl shadow space-y-4">

              <input type="text" placeholder="Nom" className="w-full border p-3 rounded-xl" />
              <input type="email" placeholder="Email" className="w-full border p-3 rounded-xl" />
              <textarea placeholder="Message" rows="4" className="w-full border p-3 rounded-xl"></textarea>

              <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">
                Envoyer
              </button>

            </form>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-green-900 text-white py-6 text-center">
        © 2026 KOB YALGRÉ — Plateforme agricole intelligente
      </footer>

    </div>
  );
}