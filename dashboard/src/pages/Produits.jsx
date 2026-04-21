import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Trash2, Eye, Loader2, Plus, X, Pencil } from 'lucide-react';

export default function Produits() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [showDetail, setShowDetail] = useState(null);
    const [form, setForm] = useState({ nom: '', description: '', quantite: '', prix: '', producteur_id: '', typeproduit_id: '' });
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [producteurs, setProducteurs] = useState([]);
    const [typeProduits, setTypeProduits] = useState([]);

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        try {
            const { data } = await api.get('/v1/produits?all=true');
            setProducts(data.data || data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadDropdowns = async () => {
        try {
            const [pRes, tRes] = await Promise.all([api.get('/v1/producteurs?all=true'), api.get('/v1/typeproduits?all=true')]);
            setProducteurs(pRes.data.data || pRes.data || []);
            setTypeProduits(tRes.data.data || tRes.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce produit ?')) return;
        try {
            await api.delete(`/v1/produits/${id}`);
            setProducts(products.filter((p) => p.id !== id));
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const openCreate = () => {
        setEditItem(null);
        setForm({ nom: '', description: '', quantite: '', prix: '', producteur_id: '', typeproduit_id: '' });
        setImageFile(null);
        setError('');
        loadDropdowns();
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditItem(p);
        setForm({
            nom: p.nom || '', description: p.description || '',
            quantite: String(p.quantite ?? ''), prix: String(p.prix ?? ''),
            producteur_id: String(p.producteur_id || p.producteur?.id || ''),
            typeproduit_id: String(p.typeproduit_id || p.type_produit?.id || ''),
        });
        setImageFile(null);
        setError('');
        loadDropdowns();
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('nom', form.nom);
            fd.append('description', form.description);
            fd.append('quantite', form.quantite);
            fd.append('prix', form.prix);
            fd.append('producteur_id', form.producteur_id);
            if (form.typeproduit_id) fd.append('typeproduit_id', form.typeproduit_id);
            if (imageFile) fd.append('image', imageFile);

            if (editItem) {
                fd.append('_method', 'PUT');
                await api.post(`/v1/produits/${editItem.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/v1/produits', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setShowModal(false);
            loadProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const filtered = products.filter(
        (p) =>
            p.nom?.toLowerCase().includes(search.toLowerCase()) ||
            p.producteur?.utilisateur?.nom?.toLowerCase().includes(search.toLowerCase())
    );

    const imgUrl = (p) => p.image ? `http://localhost:8000/storage/${p.image}` : null;

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
                <h1 className="text-2xl font-bold text-gray-900">Produits ({products.length})</h1>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        <Plus className="w-4 h-4" /> Ajouter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Image</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Nom</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Producteur</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Qté</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Prix (FCFA)</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => (
                                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-2 px-4">
                                        {imgUrl(p) ? (
                                            <img src={imgUrl(p)} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500 text-xs">—</div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 font-medium text-gray-900">{p.nom}</td>
                                    <td className="py-3 px-4 text-gray-600">{p.producteur?.utilisateur?.nom || p.producteur_id}</td>
                                    <td className="py-3 px-4 text-gray-600">{p.type_produit?.nom || '—'}</td>
                                    <td className="py-3 px-4 text-gray-600">{p.quantite}</td>
                                    <td className="py-3 px-4 font-medium text-gray-900">{parseFloat(p.prix || 0).toLocaleString('fr-FR')}</td>
                                    <td className="py-3 px-4 text-right flex justify-end gap-1">
                                        <button onClick={() => setShowDetail(p)} className="text-blue-500 hover:text-blue-700 p-1" title="Détails"><Eye className="w-4 h-4" /></button>
                                        <button onClick={() => openEdit(p)} className="text-amber-500 hover:text-amber-700 p-1" title="Modifier"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 p-1" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="7" className="text-center text-gray-400 py-8">Aucun produit trouvé</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal détail */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{showDetail.nom}</h3>
                            <button onClick={() => setShowDetail(null)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        {imgUrl(showDetail) && <img src={imgUrl(showDetail)} alt="" className="w-full h-48 object-cover rounded-lg mb-4" />}
                        <div className="space-y-2 text-sm">
                            <p><span className="font-medium text-gray-700">Description :</span> {showDetail.description || '—'}</p>
                            <p><span className="font-medium text-gray-700">Producteur :</span> {showDetail.producteur?.utilisateur?.nom || showDetail.producteur_id}</p>
                            <p><span className="font-medium text-gray-700">Type :</span> {showDetail.type_produit?.nom || '—'}</p>
                            <p><span className="font-medium text-gray-700">Quantité :</span> {showDetail.quantite}</p>
                            <p><span className="font-medium text-gray-700">Prix :</span> {parseFloat(showDetail.prix || 0).toLocaleString('fr-FR')} FCFA</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal création / édition */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{editItem ? 'Modifier le produit' : 'Nouveau produit'}</h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input type="text" required placeholder="Nom du produit" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" rows="2" />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" required placeholder="Quantité" value={form.quantite} onChange={(e) => setForm({ ...form, quantite: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                                <input type="number" step="0.01" required placeholder="Prix (FCFA)" value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <select required value={form.producteur_id} onChange={(e) => setForm({ ...form, producteur_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="">Producteur...</option>
                                    {producteurs.map((p) => <option key={p.id} value={p.id}>{p.utilisateur?.nom || `#${p.id}`}</option>)}
                                </select>
                                <select value={form.typeproduit_id} onChange={(e) => setForm({ ...form, typeproduit_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="">Type...</option>
                                    {typeProduits.map((t) => <option key={t.id} value={t.id}>{t.nom}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Image du produit</label>
                                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0] || null)} className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                            </div>
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
