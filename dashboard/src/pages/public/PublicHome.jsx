import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import elearning from "../../assets/image/elearning.jpg";
import videoAcceuil from "../../assets/image/acceuil.mp4";
import marcherBg from "../../assets/image/marcher.jpg";
import contactBg from "../../assets/image/contacte.jpg";
import logo from "../../assets/image/logo.jpeg";
import activeImg from "../../assets/image/active.jpg";
import durableImg from "../../assets/image/durable.jpg";
import pibImg from "../../assets/image/pib.jpg";

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
         <img
  src={logo}
  alt="KOB YALGRÉ"
  className="w-20 h-20 object-contain"
/>
        </div>

        <nav className="hidden md:flex gap-8 font-medium text-gray-700">
           <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
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
        <section className="relative h-[85vh] flex items-center overflow-hidden">

          {/*   VIDEO */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoAcceuil} type="video/mp4" />
          </video>

          

          <div className="relative max-w-6xl mx-auto px-8">

          {/* BADGE */}
<div className="inline-block px-6 py-3 mb-5 text-sm md:text-base font-bold tracking-widest uppercase rounded-full text-green-300 bg-black shadow-[0_0_25px_rgba(0,0,0,0.9),0_0_20px_rgba(34,197,94,0.6)] animate-pulse">
  BIENVENUE , NIWONGO , DANSSER , IZOUBA_ZOUBA
</div>

            {/* TITRE */}
            <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-none tracking-tight">
             À KOB-YALGRÉ
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
<section
  id="explorer"
  className="relative py-24 text-center overflow-hidden"
  style={{
    backgroundImage: `url(${marcherBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  
  {/* Overlay sombre */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Contenu */}
  <div className="relative z-10 max-w-6xl mx-auto px-8">

    <h2 className="text-4xl font-bold text-white mb-6">
      Marché agricole
    </h2>

    <p className="text-white/90 max-w-xl mx-auto text-lg">
      Découvrez les produits agricoles disponibles et connectez-vous pour commander directement auprès des producteurs.
    </p>

    <button
      onClick={() => navigate('/marcher')}
      className="mt-8 bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-green-700 hover:scale-105 transition"
    >
      Accéder au marché
    </button>

  </div>

</section>

        {/* E-LEARNING */}
        <section id="elearning" className="bg-white py-20 px-8">

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

           <img
  src={elearning}
  alt="E-learning agricole"
  className="rounded-3xl shadow-lg"
/>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                KOB YALGRÉ E-learning
              </h2>

             <p className="text-gray-600 mb-6 leading-relaxed">
  Apprenez les meilleures techniques agricoles modernes adaptées aux réalités africaines. 
  Découvrez des méthodes simples, efficaces et accessibles pour améliorer vos rendements, 
  optimiser vos cultures et développer une agriculture durable et rentable au quotidien.
</p>

              <button
                onClick={() => navigate('/VideoPublic')}
                className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700"
              >
                Accéder aux cours
              </button>
            </div>

          </div>
        </section>

        {/* STATS PREMIUM */}
        <section className="py-16 px-8">
<div className="w-full px-6 py-10">

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

    {/* ACTIVE */}
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      <img src={activeImg} className="w-full h-64 object-cover" />

      <div className="p-6 text-center">
        <p className="text-5xl font-bold text-green-700">70%</p>
        <p className="text-gray-600 mt-2 text-lg">Population agricole active</p>
      </div>

    </div>

    {/* DURABLE */}
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      <img src={durableImg} className="w-full h-64 object-cover" />

      <div className="p-6 text-center">
        <p className="text-5xl font-bold text-green-700">+10 ans</p>
        <p className="text-gray-600 mt-2 text-lg">Impact économique durable</p>
      </div>

    </div>

    {/* PIB */}
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      <img src={pibImg} className="w-full h-64 object-cover" />

      <div className="p-6 text-center">
        <p className="text-5xl font-bold text-green-700">35%</p>
        <p className="text-gray-600 mt-2 text-lg">Contribution au PIB</p>
      </div>

    </div>

  </div>

</div>

        </section>

        {/* CONTACT */}
        <section id="contact" 
        className="bg-green-100 py-20 px-8"
                style={{
    backgroundImage: `url(${contactBg})`,
    
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 text-gray-900">

{/* TEXTE */}
<div className="flex flex-col justify-center text-white">

  {/* TITRE */}
  <h2 className="text-3xl font-bold mb-4">
    Contact
  </h2>

  <p className="text-white/80 mb-6">
    Une question ? Un projet ? Nous vous accompagnons dans votre réussite agricole.
  </p>

  <div className="space-y-2 text-white/90">
    <p>contact@kobyalgre.bf</p>
    <p>+226 54667788</p>
    <p>Ouagadougou, Burkina Faso</p>
  </div>

</div>
  {/* FORMULAIRE */}
  <form className="bg-white p-8 rounded-3xl shadow space-y-4 text-gray-900">

    <input
      type="text"
      placeholder="Nom"
      className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 placeholder-gray-500"
    />

    <input
      type="email"
      placeholder="Email"
      className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 placeholder-gray-500"
    />

    <textarea
      placeholder="Message"
      rows="4"
      className="w-full border border-gray-300 p-3 rounded-xl text-gray-900 placeholder-gray-500"
    />

    <button
      type="submit"
      className="w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition"
    >
      Envoyer
    </button>

  </form>

</div>
             

        </section>

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