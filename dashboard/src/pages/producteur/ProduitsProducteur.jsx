import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus, Loader2, Eye, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProduitsProducteur() {

  const { user } = useAuth();

  const [produits, setProduits] = useState([]);
  const [marketProduits, setMarketProduits] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("mes");
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    nom: '',
    prix: '',
    quantite: '',
    description: '',
    image: '',
    typeproduit_id: ''
  });

  const [editId, setEditId] = useState(null);

  const myId = Number(user?.producteur_id);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [prodRes, typeRes] = await Promise.all([
        api.get('/v1/produits'),
        api.get('/v1/typeproduits')
      ]);

      const allProduits = prodRes.data?.data || prodRes.data || [];

      //  DEBUG (REGARDE DANS LA CONSOLE)
      console.log("USER CONNECTÉ :", user);
      console.log("ID PRODUCTEUR :", myId);
      console.log("TOUS LES PRODUITS :", allProduits);

      //  FILTRAGE CORRECT
      const mine = allProduits.filter(p => Number(p.producteur_id) === myId);
      const others = allProduits.filter(p => Number(p.producteur_id) !== myId);

      console.log("MES PRODUITS :", mine);
      console.log("MARCHÉ :", others);

      setProduits(mine);
      setMarketProduits(others);
      setTypes(typeRes.data?.data || typeRes.data || []);

    } catch (err) {
      console.log("ERREUR LOAD :", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const payload = {
        nom: form.nom,
        prix: Number(form.prix),
        quantite: Number(form.quantite),
        description: form.description,
        image: form.image,
        typeproduit_id: Number(form.typeproduit_id),
        producteur_id: myId
      };

      console.log("ENVOI PRODUIT :", payload);

      if (editId) {
        await api.put(`/v1/produits/${editId}`, payload);
      } else {
        await api.post('/v1/produits', payload);
      }

      setForm({
        nom: '',
        prix: '',
        quantite: '',
        description: '',
        image: '',
        typeproduit_id: ''
      });

      setEditId(null);
      setShowForm(false);

      await loadData();

    } catch (err) {
      console.log("ERREUR SUBMIT :", err.response?.data || err.message);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await api.delete(`/v1/produits/${id}`);
    loadData();
  };

  const filteredMarket = marketProduits.filter(p =>
    p.nom?.toLowerCase().includes(search.toLowerCase())
  );

  const list = viewMode === "mes" ? produits : filteredMarket;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-green-50">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <h2 className="text-2xl font-bold text-gray-800">
          {viewMode === "mes" ? "Mes Produits" : "Marché Agricole"}
        </h2>

        <div className="flex gap-2 flex-wrap">

          <button
            onClick={() => setViewMode("mes")}
            className={`px-4 py-2 rounded-full transition transform hover:scale-105 
              ${viewMode === "mes"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"}`}
          >
            Mes produits
          </button>

          <button
            onClick={() => setViewMode("marche")}
            className={`px-4 py-2 rounded-full transition transform hover:scale-105 
              ${viewMode === "marche"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"}`}
          >
            Marché
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition transform hover:scale-105 shadow"
          >
            <Plus size={18} />
            Ajouter
          </button>

        </div>
      </div>

      {/* MESSAGE SI VIDE */}
      {viewMode === "mes" && produits.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
           <br />
           <strong></strong>
        </div>
      )}

      {/* SEARCH */}
      {viewMode === "marche" && (
        <input
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {/* FORMULAIRE */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-2xl p-6 rounded-2xl space-y-4 shadow-2xl">

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Produit</h3>
              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <input className="border p-2 rounded" placeholder="Nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />

              <input className="border p-2 rounded" placeholder="Prix"
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: e.target.value })}
              />

              <input className="border p-2 rounded" placeholder="Quantité"
                value={form.quantite}
                onChange={(e) => setForm({ ...form, quantite: e.target.value })}
              />

              <select className="border p-2 rounded"
                value={form.typeproduit_id}
                onChange={(e) => setForm({ ...form, typeproduit_id: e.target.value })}
              >
                <option value="">Type</option>
                {types.map(t => (
                  <option key={t.id} value={t.id}>{t.nom}</option>
                ))}
              </select>

            </div>

            <input className="border p-2 rounded w-full" placeholder="Image"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />

            <textarea className="border p-2 rounded w-full" placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
            >
              Enregistrer
            </button>

          </div>
        </div>
      )}

      {/* LISTE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {list.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition">

            <h3 className="font-bold">{p.nom}</h3>
            <p className="text-green-600">{p.prix} FCFA</p>

            {viewMode === "mes" ? (
              <div className="flex gap-2 mt-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">Modifier</button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Supprimer
                </button>
              </div>
            ) : (
              <button className="mt-2 w-full bg-green-50 text-green-700 py-2 rounded-xl flex justify-center gap-2">
                <Eye size={16} />
                Voir
              </button>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}