import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function MarchePublic() {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/v1/produits');
        setProduits(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCommander = () => {
    navigate('/register', { state: { defaultRole: 'client' } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">

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
          <Link to="/" className="hover:text-green-600">Accueil</Link>
          <Link to="/apropos" className="hover:text-green-600">À propos</Link>
          <Link to="/marche" className="text-green-700 font-semibold">Marché</Link>
          <Link to="/contact" className="hover:text-green-600">Contact</Link>
        </nav>

        {/* BTN */}
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700"
        >
          Connexion
        </button>
      </header>

      {/* CONTENU */}
      <main className="flex-1">

        {/* HERO MARCHE */}
        <section className="relative py-16 text-center">

          <div className="max-w-3xl mx-auto px-8">

            <h1 className="text-4xl md:text-5xl font-extrabold text-green-900">
               Marché Agricole
            </h1>

            <p className="text-gray-600 mt-4">
              Découvrez, comparez et commandez directement les produits des producteurs locaux.
            </p>

            <button
              onClick={handleCommander}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition font-semibold"
            >
              Devenir client / Commander
            </button>

          </div>

        </section>

        {/* PRODUITS */}
        <section className="max-w-6xl mx-auto px-8 pb-16">

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {produits.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-5 border border-green-50"
                >

                  <h3 className="font-bold text-lg text-gray-900">
                    {p.nom}
                  </h3>

                  <p className="text-green-700 font-bold mt-2 text-lg">
                    {p.prix} FCFA
                  </p>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {p.description}
                  </p>

                  <button
                    onClick={handleCommander}
                    className="mt-4 w-full bg-green-50 text-green-800 border border-green-200 py-2 rounded-xl hover:bg-green-100 font-semibold transition"
                  >
                    Commander
                  </button>

                </div>
              ))}

              {produits.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12">
                  Aucun produit disponible pour le moment.
                </div>
              )}

            </div>

          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-green-900 text-white py-6 text-center mt-auto">
        © 2026 KOB YALGRÉ — Plateforme agricole intelligente
      </footer>

    </div>
  );
}