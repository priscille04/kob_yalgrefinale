import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Trash2, Edit, Loader2, Plus, X, Check } from 'lucide-react';

export default function Annonces() {
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ titre: '', contenu: '', producteur_id: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [producteurs, setProducteurs] = useState([]);

    useEffect(() => { loadAnnonces(); }, []);

    const loadAnnonces = async () => {
        try {
            const { data } = await api.get('/v1/annonces?all=true');
            setAnnonces(data.data || data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette annonce ?')) return;
        try {
            await api.delete(`/v1/annonces/${id}`);
            setAnnonces(annonces.filter((a) => a.id !== id));
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const loadProducteurs = async () => {
        try {
            const { data } = await api.get('/v1/producteurs?all=true');
            setProducteurs(data.data || data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const openEdit = (a) => {
        setEditing(a);
        setForm({ titre: a.titre, contenu: a.contenu, producteur_id: a.producteur_id || '' });
        loadProducteurs();
        setShowModal(true);
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ titre: '', contenu: '', producteur_id: '' });
        loadProducteurs();
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const payload = { titre: form.titre, contenu: form.contenu, producteur_id: parseInt(form.producteur_id) };
            if (editing) {
                await api.put(`/v1/annonces/${editing.id}`, payload);
            } else {
                await api.post('/v1/annonces', payload);
            }
            setShowModal(false);
            loadAnnonces();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur');
        } finally {
            setSaving(false);
        }
    };

    const filtered = annonces.filter(
        (a) =>
            a.titre?.toLowerCase().includes(search.toLowerCase()) ||
            a.contenu?.toLowerCase().includes(search.toLowerCase()) ||
            a.producteur?.utilisateur?.nom?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Annonces ({annonces.length})</h1>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        <Plus className="w-4 h-4" /> Ajouter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((a) => (
                    <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{a.titre}</h3>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                {a.created_at ? new Date(a.created_at).toLocaleDateString('fr-FR') : ''}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 flex-1 line-clamp-3 mb-2">{a.contenu}</p>
                        <p className="text-xs text-gray-500">Par : {a.producteur?.utilisateur?.nom || `Producteur #${a.producteur_id}`}</p>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                            <button onClick={() => openEdit(a)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                                <Edit className="w-4 h-4" /> Modifier
                            </button>
                            <button onClick={() => handleDelete(a.id)} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 ml-auto">
                                <Trash2 className="w-4 h-4" /> Supprimer
                            </button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-12">Aucune annonce trouvée</div>
                )}
            </div>

            {/* Modal création/édition */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{editing ? "Modifier l'annonce" : 'Nouvelle annonce'}</h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input type="text" required placeholder="Titre" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            <textarea required placeholder="Contenu de l'annonce..." value={form.contenu} onChange={(e) => setForm({ ...form, contenu: e.target.value })} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            <select required value={form.producteur_id} onChange={(e) => setForm({ ...form, producteur_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                                <option value="">Producteur...</option>
                                {producteurs.map((p) => <option key={p.id} value={p.id}>{p.utilisateur?.nom || `#${p.id}`}</option>)}
                            </select>
                            <button type="submit" disabled={saving} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                {editing ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
