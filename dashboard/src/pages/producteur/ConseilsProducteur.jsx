import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

export default function ConseilsProducteur() {

  const [conseils, setConseils] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get('/v1/conseils-agricoles?all=true');

      const data = Array.isArray(res.data) ? res.data : [];

      setConseils(data);

    } catch (err) {
      console.log(err.response?.data || err.message);
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

      <h1 className="text-2xl font-bold">🌿 Conseils agricoles</h1>

      {conseils.length === 0 ? (
        <p className="text-gray-500">Aucun conseil disponible</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {conseils.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-xl shadow">

              <h3 className="font-bold text-green-700">
                {c.titre}
              </h3>

              <p className="text-gray-600 mt-2">
                {c.contenu}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}