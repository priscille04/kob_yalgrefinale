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
            const res = await api.get('/v1/commandes?all=true');
            setCommandes(res.data.data || res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, statut) => {
        try {
            await api.put(`/v1/commandes/${id}`, { statut });
            loadCommandes();

            // Redirect vers l'espace Flutter du client (deep-link)
            // Variante liste : `kobyalgre://client/commandes`
            // Variante commande exacte : `kobyalgre://client/commandes?commandeId=${id}`
            window.location.href = `kobyalgre://client/commandes?commandeId=${id}`;
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

    const canModifier = (c) => {
        // Pour le client : annuler/modifier seulement si en_attente
        // (Le backend gère le stock et l'état.)
        return c?.statut === 'en_attente';
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
                            {/*<th>Actions</th>*/}
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