import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ShoppingCart, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Commandes() {

    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCommandes();
    }, []);

    const loadCommandes = async () => {
        try {
            console.log('[Producteur] Chargement commandes...');
            const res = await api.get('/v1/commandes?all=true');
            console.log('[Producteur] Response commandes:', res.data);
            const data = res.data?.data ?? res.data ?? [];
            setCommandes(Array.isArray(data) ? data : []);
            console.log('[Producteur] Commandes count:', Array.isArray(data) ? data.length : 0);

        } catch (err) {
            console.error('[Producteur] Erreur loadCommandes:', err?.response?.data ?? err);

            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, statut) => {
        try {
            await api.put(`/v1/commandes/${id}`, { statut });
            loadCommandes();
        } catch (err) {
            console.error(err);
            alert("Erreur mise à jour statut");
        }
    };

    const getStatusStyle = (statut) => {
        switch (statut) {
            case 'livree':
                return 'bg-green-100 text-green-700';
            case 'en_cours':
                return 'bg-blue-100 text-blue-700';
            case 'annulee':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-yellow-100 text-yellow-700';
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
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
                <p className="text-gray-500">Gestion des commandes clients</p>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-x-auto">

                <table className="w-full text-sm">

                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">ID</th>
                            <th>Client</th>
                            <th>Produit</th>
                            <th>Quantité</th>
                            <th>Total</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {commandes.map((c) => (
                            <tr key={c.id} className="border-b hover:bg-gray-50">

                                <td className="p-3 font-bold">#{c.id}</td>

                                <td>
                                    {c.client?.utilisateur?.nom || 'Client'}
                                </td>

                                <td>
                                    {c.produit?.nom || 'Produit'}
                                </td>

                                <td>{c.quantite}</td>

                                <td className="font-semibold text-green-600">
                                    {parseFloat(c.total || 0).toLocaleString('fr-FR')} F
                                </td>

                                {/* STATUT */}
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(c.statut)}`}>
                                        {c.statut || 'en_attente'}
                                    </span>
                                </td>

                                {/* ACTIONS */}
                                <td className="flex gap-2 p-2">

                                    <button
                                        onClick={() => updateStatus(c.id, 'en_cours')}
                                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                        En cours
                                    </button>

                                    <button
                                        onClick={() => updateStatus(c.id, 'livree')}
                                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                                    >
                                        Livrée
                                    </button>

                                    <button
                                        onClick={() => updateStatus(c.id, 'annulee')}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                        Annuler
                                    </button>

                                </td>

                            </tr>
                        ))}

                        {commandes.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center p-6 text-gray-400">
                                    Aucune commande
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}