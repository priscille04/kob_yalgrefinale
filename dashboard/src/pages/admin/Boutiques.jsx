import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Trash2, Pencil } from "lucide-react";

export default function Boutiques() {
  const [boutiques, setBoutiques] = useState([]);
  const [producteurs, setProducteurs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nom: "",
    code: "",
    ville: "",
    producteur_id: "",
  });

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    try {
      const [bRes, pRes] = await Promise.all([
        api.get("/v1/boutiques?all=true"),
        api.get("/v1/producteurs"),
      ]);

      setBoutiques(bRes.data?.data ?? bRes.data ?? []);
      const prods = pRes.data ?? [];
      setProducteurs(prods);

      // auto selection d'un producteur sans boutique pour éviter un POST bloqué
      const firstFree = prods.find((p) => !p.boutique_id);
      setForm((prev) => ({
        ...prev,
        producteur_id: prev.producteur_id || (firstFree ? String(firstFree.id) : ""),
      }));
    } catch (err) {
      console.log(err);
      alert("Erreur chargement boutiques/producteurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    try {
      await api.post("/v1/boutiques", {
        nom: form.nom,
        code_unique: form.code,
        ville: form.ville,
        producteur_id: form.producteur_id,
      });

      setForm({ nom: "", code: "", ville: "", producteur_id: "" });
      await load();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Erreur création boutique");
    }
  };

  const remove = async (id) => {
    await api.delete(`/v1/boutiques/${id}`);
    setBoutiques((prev) => prev.filter((b) => b.id !== id));
  };

  const openEdit = (b) => {
    setEditId(b.id);
    setForm({
      nom: b.nom,
      code: b.code_unique,
      ville: b.ville || "",
      producteur_id: b.producteur_id ? String(b.producteur_id) : String(b.boutique_id || ""),
    });
    setShowModal(true);
  };

  const update = async () => {
    try {
      const res = await api.put(`/v1/boutiques/${editId}`, {
        nom: form.nom,
        code_unique: form.code,
        ville: form.ville,
        producteur_id: form.producteur_id,
      });

      setBoutiques((prev) => prev.map((b) => (b.id === editId ? res.data : b)));
      setShowModal(false);
      setEditId(null);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Erreur modification boutique");
    }
  };

  const freeProducteurs = producteurs.filter((p) => !p.boutique_id);

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Boutiques</h1>

      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <input
          placeholder="Nom boutique"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Code boutique"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Ville"
          value={form.ville}
          onChange={(e) => setForm({ ...form, ville: e.target.value })}
          className="border p-2 w-full"
        />

        <select
          value={form.producteur_id}
          onChange={(e) => setForm({ ...form, producteur_id: e.target.value })}
          className="border p-2 w-full"
          required
        >
          <option value="">Choisir un producteur (sans boutique)</option>
          {freeProducteurs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.utilisateur?.nom || `Producteur #${p.id}`}
            </option>
          ))}
        </select>

        <button onClick={create} className="bg-green-600 text-white px-4 py-2 rounded">
          Ajouter boutique
        </button>
      </div>

      <div className="grid gap-3">
        {boutiques.map((b) => (
          <div
            key={b.id}
            className="bg-white p-4 shadow rounded flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{b.nom}</p>
              <p className="text-sm text-gray-500">Code: {b.code_unique}</p>
              <p className="text-sm text-gray-500">Ville: {b.ville}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => openEdit(b)}>
                <Pencil className="text-blue-500" />
              </button>

              <button onClick={() => remove(b.id)}>
                <Trash2 className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-3">
            <h2 className="text-lg font-bold">Modifier boutique</h2>

            <input
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="border p-2 w-full"
            />

            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="border p-2 w-full"
            />

            <input
              value={form.ville}
              onChange={(e) => setForm({ ...form, ville: e.target.value })}
              className="border p-2 w-full"
            />

            <select
              value={form.producteur_id}
              onChange={(e) => setForm({ ...form, producteur_id: e.target.value })}
              className="border p-2 w-full"
            >
              <option value="">Choisir producteur</option>
              {freeProducteurs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.utilisateur?.nom || `Producteur #${p.id}`}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Annuler
              </button>

              <button
                onClick={update}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

