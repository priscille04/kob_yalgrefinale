import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

export default function Produits() {

    const [produits, setProduits] = useState([]);
    const [types, setTypes] = useState([]);
    const [producteurs, setProducteurs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const parseResponse = (res) => {
        if (!res) return [];
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data)) return res.data.data;
        return [];
    };

    const loadData = async () => {
        try {
            const [prodRes, typeRes, producteurRes] = await Promise.all([
                api.get('/v1/produits?all=true'),
                api.get('/v1/typeproduits?all=true'),
                api.get('/v1/producteurs?all=true&with=boutique')
            ]);

            setProduits(parseResponse(prodRes));
            setTypes(parseResponse(typeRes));
            setProducteurs(parseResponse(producteurRes));

        } catch (err) {
            console.log(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const findProducteur = (id) => {
        return producteurs.find((prod) => Number(prod.id) === Number(id));
    };

    const findType = (id) => {
        return types.find((t) => Number(t.id) === Number(id));
    };

    const validProduits = produits.filter((p) => {
        const producteur = findProducteur(p.producteur_id);
        return Boolean(producteur?.id);
    });

    const invalidCount = produits.length - validProduits.length;

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Produits</h1>
                    <p className="mt-2 text-gray-600 max-w-2xl">
                        
                    </p>
                </div>
            </div>

            {/* LIST */}
            <div className="grid grid-cols-1 gap-4">
                {produits.length === 0 ? (
                    <div className="bg-white p-6 rounded-2xl shadow text-gray-600">
                        Aucun produit trouvé pour le moment.
                    </div>
                ) : (
                    <>
                        {invalidCount > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-sm">
                                {invalidCount} produit(s) sans producteur valide ont été ignorés. Corrigez la base de données ou recréez ces produits via un compte producteur.
                            </div>
                        )}

                        {validProduits.length === 0 ? (
                            <div className="bg-white p-6 rounded-2xl shadow text-gray-600">
                                Aucun produit valide trouvé.
                            </div>
                        ) : (
                            validProduits.map((p) => {
                                const producteur = findProducteur(p.producteur_id);
                                const type = findType(p.typeproduit_id);
                                const producteurName = producteur?.utilisateur?.nom || producteur?.utilisateur?.email || 'Nom non disponible';
                                const boutiqueNom = producteur?.boutique?.nom || 'Boutique non renseignée';

                                return (
                                    <div key={p.id} className="bg-white p-6 rounded-3xl shadow border border-gray-200">
                                        <div className="flex flex-col gap-3">
                                            <div className="text-sm text-gray-500">
                                                <span className="font-semibold">Boutique :</span>{' '}
                                                {boutiqueNom}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="font-semibold">Producteur :</span>{' '}
                                                {producteurName}
                                            </div>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {p.nom}
                                            </div>
                                            {p.prix && (
                                                <div className="text-sm text-gray-600">
                                                    Prix : {p.prix} FCFA
                                                </div>
                                            )}
                                            {p.quantite != null && (
                                                <div className="text-sm text-gray-600">
                                                    Quantité : {p.quantite}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </>
                )}
            </div>

        </div>
    );
}