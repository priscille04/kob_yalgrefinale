import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Trash2, Loader2, Plus, X, Pencil } from 'lucide-react';

export default function TypeProduits() {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ nom: '', description: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { loadTypes(); }, []);

    const loadTypes = async () => {
        try {
            const { data } = await api.get('/v1/typeproduits');
            setTypes(data.data || data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce type de produit ?')) return;
        try {
            await api.delete(`/v1/typeproduits/${id}`);
            setTypes(types.filter((t) => t.id !== id));
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const openCreate = () => {
        setEditItem(null);
        setForm({ nom: '', description: '' });
        setError('');
        setShowModal(true);
    };

    const openEdit = (t) => {
        setEditItem(t);
        setForm({ nom: t.nom || '', description: t.description || '' });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            if (editItem) {
                await api.put(`/v1/typeproduits/${editItem.id}`, form);
            } else {
                await api.post('/v1/typeproduits', form);
            }
            setShowModal(false);
            loadTypes();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur');
        } finally {
            setSaving(false);
        }
    };

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
                <h1 className="text-2xl font-bold text-gray-900">Types de produits ({types.length})</h1>
                <button onClick={openCreate} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    <Plus className="w-4 h-4" /> Ajouter
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Nom</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {types.map((t) => (
                                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900">{t.id}</td>
                                    <td className="py-3 px-4 font-medium text-gray-900">{t.nom}</td>
                                    <td className="py-3 px-4 text-gray-600">{t.description || '—'}</td>
                                    <td className="py-3 px-4 text-right flex justify-end gap-1">
                                        <button onClick={() => openEdit(t)} className="text-blue-500 hover:text-blue-700 p-1" title="Modifier">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 p-1" title="Supprimer">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {types.length === 0 && (
                                <tr><td colSpan="4" className="text-center text-gray-400 py-8">Aucun type de produit</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{editItem ? 'Modifier le type' : 'Nouveau type de produit'}</h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input type="text" required placeholder="Nom du type" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" rows="2" />
                            <button type="submit" disabled={saving} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editItem ? 'Enregistrer' : 'Créer'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
