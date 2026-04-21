import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Trash2, Edit, Loader2, Plus, X, Check } from 'lucide-react';

export default function Conseils() {
    const [conseils, setConseils] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ titre: '', contenu: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { loadConseils(); }, []);

    const loadConseils = async () => {
        try {
            const { data } = await api.get('/v1/conseils-agricoles');
            setConseils(data.data || data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce conseil ?')) return;
        try {
            await api.delete(`/v1/conseils-agricoles/${id}`);
            setConseils(conseils.filter((c) => c.id !== id));
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const openEdit = (c) => {
        setEditing(c);
        setForm({ titre: c.titre, contenu: c.contenu });
        setShowModal(true);
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ titre: '', contenu: '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            if (editing) {
                await api.put(`/v1/conseils-agricoles/${editing.id}`, form);
            } else {
                await api.post('/v1/conseils-agricoles', form);
            }
            setShowModal(false);
            loadConseils();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur');
        } finally {
            setSaving(false);
        }
    };

    const filtered = conseils.filter(
        (c) =>
            c.titre?.toLowerCase().includes(search.toLowerCase()) ||
            c.contenu?.toLowerCase().includes(search.toLowerCase())
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
                <h1 className="text-2xl font-bold text-gray-900">Conseils agricoles ({conseils.length})</h1>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
                        <h3 className="font-semibold text-gray-900 mb-2">{c.titre}</h3>
                        <p className="text-sm text-gray-600 flex-1 line-clamp-4">{c.contenu}</p>
                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                            <button onClick={() => openEdit(c)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                                <Edit className="w-4 h-4" /> Modifier
                            </button>
                            <button onClick={() => handleDelete(c.id)} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 ml-auto">
                                <Trash2 className="w-4 h-4" /> Supprimer
                            </button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-12">Aucun conseil trouvé</div>
                )}
            </div>

            {/* Modal création/édition */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Modifier le conseil' : 'Nouveau conseil'}</h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input type="text" required placeholder="Titre" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            <textarea required placeholder="Contenu du conseil..." value={form.contenu} onChange={(e) => setForm({ ...form, contenu: e.target.value })} rows="6" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
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
