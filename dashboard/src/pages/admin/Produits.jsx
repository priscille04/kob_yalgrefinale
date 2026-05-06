import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus, Loader2 } from 'lucide-react';

export default function Produits() {

    const [produits, setProduits] = useState([]);
    const [types, setTypes] = useState([]);
    const [producteurs, setProducteurs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        nom: '',
        prix: '',
        quantite: '',
        description: '',
        image: '',
        typeproduit_id: '',
        producteur_id: '',
    });

    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [prodRes, typeRes, producteurRes] = await Promise.all([
                api.get('/v1/produits?all=true'),
                api.get('/v1/typeproduits?all=true'),
                api.get('/v1/producteurs?all=true')
            ]);

            setProduits(prodRes.data || []);
            setTypes(typeRes.data || []);
            setProducteurs(producteurRes.data || []);

        } catch (err) {
            console.log(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // DEBUG IMPORTANT (à garder si bug)
            console.log("FORM DATA :", form);

            const payload = {
                nom: form.nom,
                prix: form.prix,
                quantite: form.quantite,
                description: form.description,
                image: form.image,

                // CORRECTION IMPORTANTE
                typeproduit_id: form.typeproduit_id ? Number(form.typeproduit_id) : null,
                producteur_id: form.producteur_id ? Number(form.producteur_id) : null,
            };

            if (editId) {
                await api.put(`/v1/produits/${editId}`, payload);
            } else {
                await api.post('/v1/produits', payload);
            }

            // reset form
            setForm({
                nom: '',
                prix: '',
                quantite: '',
                description: '',
                image: '',
                typeproduit_id: '',
                producteur_id: '',
            });

            setEditId(null);
            setShowForm(false);
            loadData();

        } catch (err) {
            console.log(err.response?.data);
            alert(err.response?.data?.message || "Erreur enregistrement");
        }
    };

    const handleEdit = (p) => {
        setForm({
            nom: p.nom,
            prix: p.prix,
            quantite: p.quantite,
            description: p.description,
            image: p.image,
            typeproduit_id: p.typeproduit_id ? Number(p.typeproduit_id) : '',
             //typeproduit_id: e.target.value ? Number(e.target.value) : ""
            producteur_id: p.producteur_id ? Number(p.producteur_id) : '',
        });

        setEditId(p.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Supprimer ce produit ?")) return;

        try {
            await api.delete(`/v1/produits/${id}`);
            loadData();
        } catch (err) {
            console.log(err);
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
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Produits</h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                    <Plus size={18} />
                    Ajouter
                </button>
            </div>

            {/* FORM */}
            {showForm && (  
                <div className="bg-white p-6 rounded-2xl shadow space-y-4">

                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Nom produit"
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    />

                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Prix"
                        value={form.prix}
                        onChange={(e) => setForm({ ...form, prix: e.target.value })}
                    />

                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Quantité"
                        value={form.quantite}
                        onChange={(e) => setForm({ ...form, quantite: e.target.value })}
                    />

                    {/* TYPE PRODUIT */}
                    <select
                        className="w-full border p-2 rounded"
                        value={form.typeproduit_id}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                typeproduit_id: Number(e.target.value)
                            })
                        }
                        required
                    >
                        <option value="">-- Choisir un type --</option>
                        {types.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nom}
                            </option>
                        ))}
                    </select>

                    {/* PRODUCTEUR */}
                    <select
                        className="w-full border p-2 rounded"
                        value={form.producteur_id}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                producteur_id: Number(e.target.value)
                            })
                        }
                        required
                    >
                        <option value="">-- Choisir un producteur --</option>
                        {producteurs.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                                {prod.id}
                            </option>
                        ))}
                    </select>

                    <textarea
                        className="w-full border p-2 rounded"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Image URL"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl"
                        >
                            Enregistrer
                        </button>

                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-gray-300 px-4 py-2 rounded-xl"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* LIST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {produits.map((p) => (
                    <div key={p.id} className="bg-white p-4 rounded-xl shadow">
                        <h2 className="font-bold">{p.nom}</h2>
                        <p>{p.prix} FCFA</p>

                        <button
                            onClick={() => handleEdit(p)}
                            className="text-blue-500"
                        >
                            Modifier
                        </button>

                        <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-500 ml-2"
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}