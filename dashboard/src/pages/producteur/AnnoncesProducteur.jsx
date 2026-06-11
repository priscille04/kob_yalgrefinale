import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2, Megaphone } from 'lucide-react';

export default function AnnoncesProducteur() {

  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnonces();
  }, []);

  const loadAnnonces = async () => {
    try {
      const res = await api.get('/v1/annonces?all=true');

      const data =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setAnnonces(data);

    } catch (err) {
      console.log("ERREUR ANNONCES :", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold flex items-center gap-2">
       Les Annonces 
      </h1>

      {annonces.length === 0 ? (
        <p className="text-gray-500">Aucune annonce disponible</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {annonces.map((a) => (
            <div
              key={a.id}
              className="bg-white p-5 rounded-2xl shadow border-l-4 border-green-600 hover:shadow-lg transition"
            >

              <h3 className="text-lg font-bold text-green-700">
                {a.titre}
              </h3>

              <p className="text-gray-600 mt-2">
                {a.contenu}
              </p>

              <p className="text-xs text-gray-400 mt-3">
               
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}