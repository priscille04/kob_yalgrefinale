import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Loader2, Eye, X } from 'lucide-react';

const STATUSES = ['en_attente', 'confirmee', 'en_cours', 'livree', 'annulee', 'refusee'];

export default function Commandes() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showDetail, setShowDetail] = useState(null);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const { data } = await api.get('/v1/commandes');
            setOrders(data.data || data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, statut) => {
        try {
            await api.put(`/v1/commandes/${id}`, { statut });
            setOrders(orders.map((o) => (o.id === id ? { ...o, statut } : o)));
            if (showDetail?.id === id) setShowDetail({ ...showDetail, statut });
        } catch (err) {
            alert('Erreur lors de la mise à jour');
        }
    };

    const filtered = orders.filter((o) => {
        const matchSearch =
            String(o.id).includes(search) ||
            o.client?.utilisateur?.nom?.toLowerCase().includes(search.toLowerCase()) ||
            o.produit?.nom?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || o.statut === filterStatus;
        return matchSearch && matchStatus;
    });

    const statusBadge = (statut) => {
        const s = {
            en_attente: 'bg-yellow-100 text-yellow-700',
            confirmee: 'bg-blue-100 text-blue-700',
            en_cours: 'bg-indigo-100 text-indigo-700',
            livree: 'bg-green-100 text-green-700',
            annulee: 'bg-red-100 text-red-700',
            refusee: 'bg-rose-100 text-rose-800',
        };
        return s[statut] || 'bg-gray-100 text-gray-700';
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
                <h1 className="text-2xl font-bold text-gray-900">Commandes ({orders.length})</h1>
                <div className="flex gap-3 flex-wrap">
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
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Tous les statuts</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Produit</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Qté</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Total (FCFA)</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-500">Statut</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((o) => (
                                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900">#{o.id}</td>
                                    <td className="py-3 px-4 text-gray-600">{o.client?.utilisateur?.nom || o.client_id}</td>
                                    <td className="py-3 px-4 text-gray-600">{o.produit?.nom || o.produit_id}</td>
                                    <td className="py-3 px-4 text-gray-600">{o.quantite}</td>
                                    <td className="py-3 px-4 font-medium text-gray-900">{parseFloat(o.total || 0).toLocaleString('fr-FR')}</td>
                                    <td className="py-3 px-4">
                                        <select
                                            value={o.statut || 'en_attente'}
                                            onChange={(e) => updateStatus(o.id, e.target.value)}
                                            className={`text-xs font-medium rounded-full px-2 py-1 border-0 outline-none cursor-pointer ${statusBadge(o.statut)}`}
                                        >
                                            {STATUSES.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button onClick={() => setShowDetail(o)} className="text-blue-500 hover:text-blue-700 p-1">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="7" className="text-center text-gray-400 py-8">Aucune commande trouvée</td></tr>
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
                            <h3 className="text-lg font-semibold text-gray-900">Commande #{showDetail.id}</h3>
                            <button onClick={() => setShowDetail(null)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p><span className="font-medium text-gray-700">Client :</span> {showDetail.client?.utilisateur?.nom || showDetail.client_id}</p>
                            <p><span className="font-medium text-gray-700">Produit :</span> {showDetail.produit?.nom || showDetail.produit_id}</p>
                            <p><span className="font-medium text-gray-700">Quantité :</span> {showDetail.quantite}</p>
                            <p><span className="font-medium text-gray-700">Total :</span> {parseFloat(showDetail.total || 0).toLocaleString('fr-FR')} FCFA</p>
                            <div>
                                <span className="font-medium text-gray-700">Statut :</span>
                                <select
                                    value={showDetail.statut || 'en_attente'}
                                    onChange={(e) => updateStatus(showDetail.id, e.target.value)}
                                    className={`ml-2 text-xs font-medium rounded-full px-3 py-1 border-0 outline-none cursor-pointer ${statusBadge(showDetail.statut)}`}
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <p><span className="font-medium text-gray-700">Créée le :</span> {showDetail.created_at ? new Date(showDetail.created_at).toLocaleDateString('fr-FR') : '—'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
